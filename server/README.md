# Vitrine - Backend Server

## Descripción
Backend del sistema Vitrine implementado con Flask y Supabase, proporcionando una API RESTful para la gestión de proyectos, usuarios, documentos y comunicaciones.

## Tecnologías Utilizadas

### Core
- Python 3.8+
- Flask
- Supabase (Base de datos y almacenamiento)
- JWT para autenticación

### Dependencias Principales
- Flask-CORS
- Flask-JWT-Extended
- Flask-Bcrypt
- python-dotenv
- supabase-py

## Estructura de la Base de Datos

### Tablas
```sql
-- Usuarios
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password VARCHAR,
  role VARCHAR,
  created_at TIMESTAMP,
  name VARCHAR
)

-- Proyectos
projects (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  status VARCHAR,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP
)

-- Contratos
contracts (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  contract_url VARCHAR,
  payment_url VARCHAR,
  created_at TIMESTAMP
)

-- Actualizaciones de Progreso
progress_updated (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  update TEXT,
  created_at TIMESTAMP
)

-- Lista Negra de Tokens
token_blacklist (
  id UUID PRIMARY KEY,
  jti VARCHAR,
  created_at TIMESTAMP
)
```

## Endpoints de la API

### Autenticación
- `POST /api/register` - Registro de usuarios
- `POST /api/login` - Inicio de sesión
- `POST /api/logout` - Cierre de sesión
- `GET /api/verify-token` - Verificación de token

### Proyectos
- `GET /api/projects` - Obtener todos los proyectos
- `GET /api/projects/<id>` - Obtener proyecto específico
- `POST /api/projects` - Crear nuevo proyecto
- `PUT /api/projects/<id>` - Actualizar proyecto
- `DELETE /api/projects/<id>` - Eliminar proyecto
- `GET /api/projects/user` - Obtener proyectos del usuario actual

### Documentos
- `POST /api/projects/<id>/upload-documents` - Subir documentos
- `GET /api/projects/<id>/documents` - Obtener documentos
- `PUT /api/projects/<id>/status` - Actualizar estado del proyecto

### Actualizaciones
- `POST /api/projects/<id>/updates` - Agregar actualización
- `GET /api/projects/<id>/updates` - Obtener actualizaciones

## Configuración del Entorno

1. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno (.env):
```env
SECRET_KEY=your_secret_key
SUPABASE_URL=your_supabase_url
JWT_SECRET_KEY=your_jwt_secret
SUPABASE_KEY=your_supabase_key
```

## Ejecución del Servidor

```bash
python app.py
```

El servidor se ejecutará en `http://localhost:5000`

## Seguridad

### Autenticación
- Implementación de JWT para autenticación de usuarios
- Tokens con tiempo de expiración
- Lista negra de tokens para logout seguro

### Almacenamiento
- Contraseñas hasheadas con bcrypt
- Documentos almacenados en Supabase Storage
- URLs firmadas para acceso a documentos

### CORS
- Configuración de CORS para permitir solicitudes del frontend
- Headers de seguridad configurados

## Manejo de Errores
- Respuestas HTTP estandarizadas
- Mensajes de error descriptivos
- Logging de errores para debugging

## Mantenimiento

### Logs
- Registro de errores en archivo
- Monitoreo de solicitudes
- Tracking de rendimiento

### Backups
- Backup automático de base de datos
- Respaldo de archivos almacenados
- Plan de recuperación de desastres

## Desarrollo

### Convenciones de Código
- PEP 8 para estilo de código Python
- Docstrings para documentación
- Type hints para mejor mantenibilidad

### Testing
- Tests unitarios con pytest
- Tests de integración
- Cobertura de código

## Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Crear Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
