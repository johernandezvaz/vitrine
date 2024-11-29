from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt, get_jwt_identity
from flask_cors import CORS
from config import supabase
import datetime
import os
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

        if users_response.error:
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




# Ruta para obtener proyectos
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        response = supabase.table('projects').select('*').execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para crear un proyecto
@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    user_id = data.get('user_id')

    if not (name and description and user_id):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    try:
        response = supabase.table('projects').insert({
            "name": name,
            "description": description,
            "status": "pending",
            "user_id": user_id
        }).execute()
        return jsonify({"message": "Proyecto creado exitosamente", "project": response.data}), 201
    except Exception as e:
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
