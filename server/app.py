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
        projects_response = supabase.table("projects").select("*").execute()
        
        # Si no hay proyectos, devolver un mensaje claro
        if not projects_response.data:
            return jsonify({"message": "No hay proyectos disponibles"}), 200

        print("Proyectos:", projects_response.data)

        # Obtener los usuarios relacionados
        user_ids = list(set(project["user_id"] for project in projects_response.data if project["user_id"]))
        users_response = supabase.table("users").select("id, name, email").in_("id", user_ids).execute()

        if not users_response.data:
            print("Error al obtener usuarios:", users_response.error)
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

        print("Respuesta generada:", projects_with_users)
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
    

@app.route('/api/messages', methods=['GET'])
@jwt_required()
def get_messages():
    try:
        current_user = get_jwt_identity()
        user_id = current_user.get('id')

        # Get all projects for the user
        projects_response = supabase.table('projects').select('id, name').eq('user_id', user_id).execute()
        
        if not projects_response.data:
            return jsonify([]), 200

        project_ids = [project['id'] for project in projects_response.data]
        projects_dict = {project['id']: project['name'] for project in projects_response.data}

        # Get all contracts for these projects
        contracts_response = supabase.table('contracts').select('*').in_('project_id', project_ids).execute()

        # Get all progress updates for these projects
        updates_response = supabase.table('progress_updates').select('*').in_('project_id', project_ids).execute()

        messages = []

        # Process contracts into messages
        for contract in contracts_response.data:
            messages.append({
                'id': contract['id'],
                'project_id': contract['project_id'],
                'type': 'contract',
                'content': 'Se han subido los documentos del proyecto.',
                'created_at': contract['created_at'],
                'project': {'name': projects_dict[contract['project_id']]},
                'urls': {
                    'contract_url': contract['contract_url'],
                    'payment_url': contract['payment_url']
                }
            })

        # Process updates into messages
        for update in updates_response.data:
            messages.append({
                'id': update['id'],
                'project_id': update['project_id'],
                'type': 'update',
                'content': update['update'],
                'created_at': update['created_at'],
                'project': {'name': projects_dict[update['project_id']]}
            })

        # Sort messages by created_at in descending order
        messages.sort(key=lambda x: x['created_at'], reverse=True)

        return jsonify(messages), 200

    except Exception as e:
        print(f"Error getting messages: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/projects/<string:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    if not is_valid_uuid(project_id):
        return jsonify({"error": "ID de proyecto inválido"}), 400

    try:
        current_user = get_jwt_identity()
        
        # Get project details
        project_response = supabase.table('projects').select('*').eq('id', project_id).execute()
        
        if not project_response.data:
            return jsonify({"error": "Proyecto no encontrado"}), 404

        return jsonify(project_response.data[0]), 200

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
