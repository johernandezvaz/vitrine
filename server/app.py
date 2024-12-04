from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
from flask_cors import CORS
from config import supabase
import datetime
from uuid import UUID
import os
import mimetypes
import base64
import secrets
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True ,resources={r"/api/*": {"origins": ["http://localhost:5173"]}})
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)
app.config["JWT_IDENTITY_CLAIM"] = "identity"
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
jwt = JWTManager(app)

BUCKET_NAME = "project-documents"


# Ruta de registro
@app.route('/api/register', methods=['POST'])
def register():
    print("Request JSON:", request.json)
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # 'user' solamente, ya que 'admin' se crea localmente.

    if not (name and email and password and role):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    if role != 'client':  # Evitar que se creen administradores desde la API.
        return jsonify({"error": "No puedes registrarte como administrador"}), 403

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    print(hashed_password)

    try:
        response = supabase.table('users').insert({
            "email": email,
            "password": hashed_password,
            "role": role,
            "name": name
        }).execute()
        return jsonify({"message": "Usuario registrado correctamente", "user": response.data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta de login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not (email and password):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    try:
        response = supabase.table('users').select('id, password, role').eq('email', email).execute()
        if response.data:
            user = response.data[0]

            if bcrypt.check_password_hash(user['password'], password):
                try:
                    access_token = create_access_token(
                        identity={"id": user["id"], "role": user["role"]},
                        additional_claims={"sub": str(user["id"])}  # Incluye el campo "sub" con el ID del usuario
                        )
                    return jsonify({"access_token": access_token, "user": {"id": user["id"], "role": user["role"]}})
                except:
                    return jsonify({"error": f"Error al crear el token: {str(e)}"}), 500
        return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Ruta de logout
@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        jwt_payload = get_jwt()
        jti = jwt_payload["jti"]  # Obtén el identificador único del token
        
        # Agregar el jti a la lista negra en Supabase
        response = supabase.table("token_blacklist").insert({"jti": jti}).execute()

        # Verificar si se agregó correctamente a la base de datos
        if response.data:  # Si "data" no está vacío, la operación fue exitosa
            return jsonify({"message": "Sesión cerrada correctamente"}), 200
        else:
            return jsonify({"error": "Error al cerrar la sesión: no se registró el token"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Ruta del dashboard
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    # Obtener los datos del usuario del token
    current_user = get_jwt_identity()
    return jsonify({"message": f"Bienvenido, usuario {current_user['id']} con rol {current_user['role']}"})


@app.route('/api/all-projects', methods=['GET'])
@jwt_required()
def get_all_projects():
    try:
        current_user = get_jwt_identity()
        
        # If user is a client, only show their projects
        if current_user['role'] == 'client':
            projects_response = supabase.table("projects").select("*").eq("user_id", current_user['id']).execute()
        else:
            # If user is a provider, show all projects
            projects_response = supabase.table("projects").select("*").execute()
        
        # If no projects, return a message
        if not projects_response.data:
            return jsonify({"message": "No hay proyectos disponibles"}), 200

        # Get the users related to these projects
        user_ids = list(set(project["user_id"] for project in projects_response.data if project["user_id"]))
        users_response = supabase.table("users").select("id, name, email").in_("id", user_ids).execute()

        if not users_response.data:
            return jsonify({"error": "Error al obtener datos de usuarios"}), 500

        users_dict = {user["id"]: user for user in users_response.data}
        projects_with_users = [
            {
                "project_id": project["id"],
                "project_name": project["name"],
                "project_description": project["description"],
                "project_status": project["status"],
                "project_created_at": project["created_at"],
                "user_id": project["user_id"],
                "user_name": users_dict.get(project["user_id"], {}).get("name"),
                "user_email": users_dict.get(project["user_id"], {}).get("email"),
            }
            for project in projects_response.data
        ]

        return jsonify(projects_with_users), 200

    except Exception as e:
        print("Error interno:", str(e))
        return jsonify({"error": "Error interno del servidor"}), 500

def is_valid_uuid(uuid_string):
    try:
        UUID(uuid_string)
        return True
    except ValueError:
        return False
    
def ensure_bucket_exists():
    try:
        # List all buckets
        buckets = supabase.storage.list_buckets()
        bucket_exists = any(bucket.name == BUCKET_NAME for bucket in buckets)
        
        if not bucket_exists:
            # Create the bucket if it doesn't exist
            supabase.storage.create_bucket(BUCKET_NAME, options={'public': True})
            print(f"Created bucket: {BUCKET_NAME}")
        
        return True
    except Exception as e:
        print(f"Error ensuring bucket exists: {str(e)}")
        return False

def upload_file_to_storage(file_data, file_name):
    try:
        # Ensure bucket exists
        if not ensure_bucket_exists():
            raise Exception("Failed to ensure bucket exists")

        # Get file extension and content type
        content_type = mimetypes.guess_type(file_name)[0] or 'application/octet-stream'
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(BUCKET_NAME).upload(
            path=file_name,
            file=file_data,
            file_options={"content-type": content_type}
        )
        
        # Get public URL
        file_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)
        return file_url
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        raise e 



@app.route('/api/projects/<string:project_id>/upload-documents', methods=['POST', 'OPTIONS'])
@jwt_required()
def upload_project_documents(project_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    if not is_valid_uuid(project_id):
        return jsonify({"error": "ID de proyecto inválido"}), 400

    try:
        current_user = get_jwt_identity()
        
        if 'contract' not in request.files or 'payment' not in request.files:
            return jsonify({"error": "Se requieren ambos archivos: contrato y comprobante de pago"}), 400

        contract_file = request.files['contract']
        payment_file = request.files['payment']

        if not contract_file.filename or not payment_file.filename:
            return jsonify({"error": "Los archivos no tienen nombre"}), 400

        # Verify project exists and belongs to user
        project_response = supabase.table('projects').select('*').eq('id', project_id).execute()
        
        if not project_response.data:
            return jsonify({"error": "Proyecto no encontrado"}), 404

        # Generate unique filenames
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        contract_filename = f"{project_id}_contract_{timestamp}{os.path.splitext(contract_file.filename)[1]}"
        payment_filename = f"{project_id}_payment_{timestamp}{os.path.splitext(payment_file.filename)[1]}"

        # Upload files to Supabase Storage
        contract_url = upload_file_to_storage(contract_file.read(), contract_filename)
        payment_url = upload_file_to_storage(payment_file.read(), payment_filename)

        # Create contract record
        contract_data = {
            "project_id": project_id,
            "contract_url": contract_url,
            "payment_url": payment_url,
            "created_at": datetime.datetime.utcnow().isoformat()
        }

        response = supabase.table('contracts').insert(contract_data).execute()

        if response.data:
            return jsonify({
                "message": "Documentos subidos exitosamente",
                "contract": response.data[0]
            }), 201
        else:
            return jsonify({"error": "Error al guardar los documentos en la base de datos"}), 500

    except Exception as e:
        print(f"Error in upload_project_documents: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/projects/count', methods=['GET'])
@jwt_required()
def get_project_count():
    try:
        response = supabase.table('projects').select('id', count='exact').execute()
        return jsonify({"count": response.count}), 200
    except Exception as e:
        print(f"Error in get_project_count: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

# Get user's messages
@app.route('/api/messages/user', methods=['GET'])
@jwt_required()
def get_user_messages():
    current_user = get_jwt_identity()
    try:
        # Get user's projects first
        projects_response = supabase.table('projects').select('id').eq('user_id', current_user['id']).execute()
        
        if not projects_response.data:
            return jsonify([])

        project_ids = [project['id'] for project in projects_response.data]
        
        # Get messages for these projects
        messages_response = supabase.table('messages').select(
            'id, content, type, created_at, project_id, projects(name)'
        ).in_('project_id', project_ids).execute()

        return jsonify(messages_response.data)
    except Exception as e:
        print("Error in get_user_messages:", str(e))
        return jsonify({"error": str(e)}), 500

# Create a new message
@app.route('/api/messages', methods=['POST'])
@jwt_required()
def create_message():
    current_user = get_jwt_identity()
    data = request.json

    if not data or not data.get('project_id') or not data.get('content'):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        message_data = {
            "project_id": data['project_id'],
            "content": data['content'],
            "type": data.get('type', 'update'),
            "sender_id": current_user['id'],
            "created_at": datetime.datetime.utcnow().isoformat()
        }

        response = supabase.table('messages').insert(message_data).execute()
        
        if not response.data:
            raise Exception("Error creating message")

        return jsonify({"message": "Message created successfully", "data": response.data[0]}), 201
    except Exception as e:
        print("Error in create_message:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/projects/user', methods=['GET'])
@jwt_required()
def get_user_projects():
    current_user = get_jwt_identity()
    try:
        response = supabase.table('projects').select('*').eq('user_id', current_user['id']).execute()
        return jsonify(response.data)
    except Exception as e:
        print("Error in get_user_projects:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/messages/broadcast', methods=['POST'])
@jwt_required()
def broadcast_message():
    current_user = get_jwt_identity()
    
    if current_user['role'] != 'provider':
        return jsonify({"error": "Solo los proveedores pueden enviar mensajes"}), 403
        
    try:
        data = request.json
        if 'content' not in data:
            return jsonify({"error": "El contenido del mensaje es requerido"}), 400
            
        # Get all projects
        projects_response = supabase.table('projects').select('id').execute()
        if not projects_response.data:
            return jsonify({"error": "No hay proyectos disponibles"}), 404
            
        # Create a message for each project
        messages = []
        for project in projects_response.data:
            message_data = {
                "project_id": project['id'],
                "content": data['content'],
                "sender_id": current_user['id'],
                "created_at": datetime.datetime.utcnow().isoformat()
            }
            messages.append(message_data)
            
        # Insert all messages at once
        response = supabase.table('messages').insert(messages).execute()
        
        return jsonify({"message": "Mensajes enviados exitosamente"}), 201
        
    except Exception as e:
        print(f"Error in broadcast_message: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Messages routes
@app.route('/api/messages', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        current_user = get_jwt_identity()
        
        if current_user['role'] == 'client':
            # Get projects for this client
            projects = supabase.table('projects').select('id').eq('user_id', current_user['id']).execute()
            if not projects.data:
                return jsonify([])
            
            project_ids = [p['id'] for p in projects.data]
            messages = supabase.table('messages').select('*').in_('project_id', project_ids).execute()
        else:
            # Provider sees all messages
            messages = supabase.table('messages').select('*').execute()
        
        if not messages.data:
            return jsonify([])

        # Get project details for each message
        project_ids = list(set(msg['project_id'] for msg in messages.data))
        projects = supabase.table('projects').select('*').in_('id', project_ids).execute()
        projects_dict = {p['id']: p for p in projects.data}

        # Format messages with project details
        formatted_messages = []
        for msg in messages.data:
            project = projects_dict.get(msg['project_id'], {})
            formatted_messages.append({
                'id': msg['id'],
                'content': msg['content'],
                'type': msg['type'],
                'sender_id': msg['sender_id'],
                'created_at': msg['created_at'],
                'project': {
                    'name': project.get('name', 'Unknown Project'),
                    'user_name': project.get('user_name', 'Unknown User')
                }
            })

        return jsonify(formatted_messages)

    except Exception as e:
        print(f"Error in get_messages: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
@app.route('/api/projects/<project_id>/updates', methods=['GET'])
@jwt_required()
def get_project_updates(project_id):
    try:
        response = supabase.table('progress_updates').select('*').eq('project_id', project_id).order('created_at', desc=True).execute()
        
        if not response.data:
            return jsonify([])
            
        return jsonify(response.data)
    except Exception as e:
        print(f"Error in get_project_updates: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/api/projects/<project_id>/updates', methods=['POST'])
@jwt_required()
def add_project_update(project_id):
    try:
        data = request.json
        update_text = data.get('update')
        
        if not update_text:
            return jsonify({"error": "El texto de la actualización es requerido"}), 400

        response = supabase.table('progress_updates').insert({
            "project_id": project_id,
            "update": update_text,
            "created_at": datetime.datetime.utcnow().isoformat()
        }).execute()

        if not response.data:
            return jsonify({"error": "Error al crear la actualización"}), 500

        return jsonify(response.data[0]), 201
    except Exception as e:
        print(f"Error in add_project_update: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/api/projects/<project_id>/messages', methods=['GET'])
@jwt_required()
def get_project_messages(project_id):
    try:
        response = supabase.table('messages').select('*').eq('project_id', project_id).order('created_at', desc=True).execute()
        
        if not response.data:
            return jsonify([])
            
        return jsonify(response.data)
    except Exception as e:
        print(f"Error in get_project_messages: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500



@app.route('/api/projects/<project_id>', methods=['GET'])
@jwt_required()
def get_project_details(project_id):
    current_user = get_jwt_identity()

    print(current_user['role'])
    try:
        if current_user['role'] == 'client':
            # Clients can only see their own projects
            response = supabase.table('projects').select('*').eq('id', project_id).eq('user_id', current_user['id']).execute()
        else:
            # Providers can see all projects
            response = supabase.table('projects').select('*').eq('id', project_id).execute()
        
        if not response.data:
            return jsonify({"error": "Proyecto no encontrado"}), 404
            
        return jsonify(response.data[0])
    except Exception as e:
        print(f"Error in get_project_details: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
@app.route('/api/projects/<string:project_id>/status', methods=['PUT'])
@jwt_required()
def update_project_status(project_id):
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'provider':
            return jsonify({"error": "Unauthorized"}), 403
            
        data = request.json
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({"error": "Status is required"}), 400
            
        response = supabase.table('projects').update({
            'status': new_status
        }).eq('id', project_id).execute()
        
        return jsonify({"message": "Status updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/projects/<string:project_id>/updates', methods=['GET', 'POST'])
@jwt_required()
def project_updates(project_id):
    try:
        if request.method == 'GET':
            response = supabase.table('progress_updates').select('*').eq('project_id', project_id).execute()
            return jsonify(response.data)
            
        elif request.method == 'POST':
            current_user = get_jwt_identity()
            if current_user['role'] != 'provider':
                return jsonify({"error": "Unauthorized"}), 403
                
            data = request.json
            update_text = data.get('update')
            
            if not update_text:
                return jsonify({"error": "Update text is required"}), 400
                
            response = supabase.table('progress_updates').insert({
                'project_id': project_id,
                'update': update_text,
                'created_at': datetime.datetime.utcnow().isoformat()
            }).execute()
            
            return jsonify(response.data[0]), 201
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<string:project_id>/documents', methods=['GET'])
@jwt_required()
def get_project_documents(project_id):
    if not is_valid_uuid(project_id):
        return jsonify({"error": "ID de proyecto inválido"}), 400

    try:
        current_user = get_jwt_identity()
        
        # Get project details to verify ownership
        project_response = supabase.table('projects').select('*').eq('id', project_id).execute()
        
        if not project_response.data:
            return jsonify({"error": "Proyecto no encontrado"}), 404

        # Get contract documents
        contract_response = supabase.table('contracts').select('*').eq('project_id', project_id).execute()
        
        return jsonify(contract_response.data), 200

    except Exception as e:
        print(f"Error getting project documents: {str(e)}")
        return jsonify({"error": str(e)}), 500


    
@app.route("/api/add-project", methods=["POST"])
@jwt_required()
def add_project():
    try:
        # Obtén la identidad del usuario desde el token
        jwt_identity = get_jwt_identity()

        # Extrae solo el 'id' del usuario
        user_id = jwt_identity["id"] if isinstance(jwt_identity, dict) else jwt_identity

        # Obtén los datos enviados en la solicitud
        data = request.json

        # Crea los datos para el proyecto
        project_data = {
            "name": data["name"],
            "description": data["description"],
            "status": "pending",  # Estado inicial
            "user_id": user_id,  # Asegúrate de que sea un entero
            "created_at": datetime.datetime.utcnow().isoformat(),
        }

        print("Datos del proyecto:", project_data)

        # Inserta el proyecto en la base de datos usando Supabase
        response = supabase.table("projects").insert(project_data).execute()
        print("Respuesta de Supabase:", response)

        # Verifica si hubo errores en la respuesta
        if not response.data:
            return jsonify({"error": response.error.message}), 400

        # Devuelve el primer elemento de los datos insertados
        return jsonify({"message": "Proyecto creado exitosamente", "project": response.data[0]}), 201
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/cancel-project/<string:project_id>", methods=["DELETE"])
@jwt_required()
def cancel_project(project_id):
    try:
        # Obtén la identidad del usuario desde el token
        jwt_identity = get_jwt_identity()

        # Extrae solo el 'id' del usuario
        user_id = jwt_identity["id"] if isinstance(jwt_identity, dict) else jwt_identity

        # Verifica si el proyecto pertenece al usuario y no tiene contrato ni comprobante de pago
        print(response.data)
        
        response = supabase.table("projects").select("contract_url, payment_proof_url, user_id").eq("id", project_id).execute()


        if not response.data:
            return jsonify({"error": "Proyecto no encontrado"}), 404

        project = response.data[0]

        # Verifica que el proyecto sea del usuario y que los campos sean NULL
        if project["user_id"] != user_id:
            return jsonify({"error": "No tienes permiso para cancelar este proyecto"}), 403

        if project["contract_url"] or project["payment_proof_url"]:
            return jsonify({"error": "El proyecto no puede ser cancelado porque ya tiene un contrato o comprobante de pago"}), 400

        # Elimina el proyecto de la base de datos
        delete_response = supabase.table("projects").delete().eq("id", project_id).execute()

        if not delete_response.data:
            return jsonify({"error": "No se pudo cancelar el proyecto"}), 400

        return jsonify({"message": "Proyecto cancelado exitosamente"}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.json
    email = data.get('email')
    reset_token = data.get('resetToken')
    
    if not email or not reset_token:
        return jsonify({"error": "Email y token son requeridos"}), 400

    try:
        # Check if user exists
        user_response = supabase.table('users').select('*').eq('email', email).execute()
        
        if not user_response.data:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Store reset token with expiration (24 hours)
        current_time = datetime.datetime.now()
        expiration = current_time + datetime.timedelta(hours=24)
        
        # Format the dates in ISO 8601 format
        expiration_iso = expiration.strftime('%Y-%m-%dT%H:%M:%S.%f+00:00')
        
        reset_data = {
            "user_id": user_response.data[0]["id"],
            "token": reset_token,
            "expires_at": expiration_iso,
            "used": False
        }
        
        supabase.table('password_resets').insert(reset_data).execute()
        
        return jsonify({"message": "Token de restablecimiento creado exitosamente"})

    except Exception as e:
        print("Error in request_password_reset:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/verify-reset-token', methods=['POST'])
def verify_reset_token():
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({"error": "Token es requerido"}), 400

    try:
        # Check if token exists and is valid
        reset_response = supabase.table('password_resets').select('*').eq('token', token).eq('used', False).execute()
        
        if not reset_response.data:
            return jsonify({"error": "Token inválido"}), 400

        reset_data = reset_response.data[0]
        # Parse the ISO format date string without timezone
        expires_at = datetime.datetime.strptime(reset_data['expires_at'], '%Y-%m-%dT%H:%M:%S.%f')
        
        if datetime.datetime.utcnow() > expires_at:
            return jsonify({"error": "Token expirado"}), 400

        return jsonify({"valid": True})

    except Exception as e:
        print("Error in verify_reset_token:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    token = data.get('token')
    new_password = data.get('newPassword')
    
    if not token or not new_password:
        return jsonify({"error": "Token y nueva contraseña son requeridos"}), 400

    try:
        # Verify token
        reset_response = supabase.table('password_resets').select('*').eq('token', token).eq('used', False).execute()
        
        if not reset_response.data:
            return jsonify({"error": "Token inválido"}), 400

        reset_data = reset_response.data[0]
        # Parse the ISO format date string
        expires_at = datetime.datetime.fromisoformat(reset_data['expires_at'])
        
        if datetime.datetime.now() > expires_at:
            return jsonify({"error": "Token expirado"}), 400

        # Update password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        supabase.table('users').update({"password": hashed_password}).eq('id', reset_data['user_id']).execute()
        
        # Mark token as used
        supabase.table('password_resets').update({"used": True}).eq('token', token).execute()
        
        return jsonify({"message": "Contraseña actualizada exitosamente"})

    except Exception as e:
        print("Error in reset_password:", str(e))
        return jsonify({"error": str(e)}), 500

# Ruta de verificación de token
@app.route('/api/verify-token', methods=['POST'])
@jwt_required()
def verify_token():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user}), 200






# Verificar si un token está en la blacklist
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    try:
        # Verificar si el jti está en la lista negra
        response = supabase.table("token_blacklist").select("*").eq("jti", jti).execute()
        return len(response.data) > 0
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({"error": "Autorización requerida"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return jsonify({"error": "Token inválido"}), 422

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
