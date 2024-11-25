from flask import Flask, request, jsonify, redirect, url_for
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Importar configuración
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

bcrypt = Bcrypt(app)
CORS(app)

mysql = MySQL(app)

# Ruta de registro
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # 'client' o 'provider'

    if not (name and email and password and role):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            INSERT INTO users (name, email, password, role)
            VALUES (%s, %s, %s, %s)
        """, (name, email, hashed_password, role))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Usuario registrado correctamente"}), 201
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

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, password FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user and bcrypt.check_password_hash(user[1], password):
        return redirect(url_for('dashboard'))
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401

# Ruta del dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    return jsonify({"message": "Bienvenido al Dashboard"}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
