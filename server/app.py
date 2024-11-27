from flask import Flask, request, jsonify, redirect, url_for
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import supabase

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# Ruta de registro
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # 'user' solamente, ya que 'admin' se crea localmente.

    if not (name and email and password and role):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    if role != 'user':  # Evitar que se creen administradores desde la API.
        return jsonify({"error": "No puedes registrarte como administrador"}), 403

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        response = supabase.table('users').insert({
            "email": email,
            "password": hashed_password,
            "role": role
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
        # Buscar el usuario en la base de datos
        response = supabase.table('users').select('id, password').eq('email', email).execute()
        if response.data:
            user = response.data[0]
            if bcrypt.check_password_hash(user['password'], password):
                return redirect(url_for('dashboard'))
        return jsonify({"error": "Credenciales inválidas"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta del dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    return jsonify({"message": "Bienvenido al Dashboard"}), 200

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

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
