from flask import Flask, request, jsonify, redirect, url_for
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import jwt
from config import supabase
import datetime

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})


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
                # Generar un token de acceso
                payload = {
                    "user_id": user["id"],
                    "role": user["role"],
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                }
                access_token = jwt.encode(payload, "your-secret-key", algorithm="HS256")
                return jsonify({"access_token": access_token, "user": {"id": user["id"], "role": user["role"]}})
        return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Ruta del dashboard
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    # Obtener los datos del usuario del token
    current_user = get_jwt_identity()
    return jsonify({"message": f"Bienvenido, usuario {current_user['id']} con rol {current_user['role']}"})

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

@app.route('/api/verify-token', methods=['POST'])
@jwt_required()
def verify_token():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
