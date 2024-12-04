# Vitrine - Plataforma para proveedores de servicios y clientes

Vitrine es una moderna plataforma web que conecta a los proveedores de servicios con los clientes, facilitando la gestión de proyectos, el intercambio de documentos y la comunicación en un entorno seguro e intuitivo.

## Características

- **Autenticación de usuarios**
- Sistema de registro e inicio de sesión seguro
- Acceso basado en roles (cliente/proveedor)
- Autenticación basada en JWT

- **Gestión de proyectos**
- Crear y gestionar proyectos
- Actualizaciones de estado en tiempo real
- Carga y verificación de documentos
- Seguimiento del progreso

- **Comunicación**
- Mensajería directa entre clientes y proveedores
- Actualizaciones y notificaciones de proyectos
- Capacidades para compartir documentos

- **Panel de control**
- Integración de calendario personalizado
- Estadísticas y análisis de proyectos
- Seguimiento de actividades recientes
- Acceso rápido a funciones importantes

## Pila tecnológica

### Interfaz de usuario
- React con TypeScript
- Tailwind CSS para el estilo
- Lucide React para íconos
- React Router para navegación
- Zustand para la gestión de estados
- Axios para solicitudes de API

### Backend
- Flask (Python)
- Flask-JWT-Extended para autenticación
- Flask-CORS para solicitudes de origen cruzado
- Supabase para base de datos y almacenamiento

## Obtención Iniciado

### Requisitos previos
- Node.js (v14 o superior)
- Python 3.8 o superior
- pip (administrador de paquetes de Python)

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/yourusername/vitrine.git
cd vitrine
```

2. Instalar las dependencias del frontend:
```bash
npm install
```

3. Configurar el entorno virtual de Python:
```bash
python -m venv server/venv
source server/venv/bin/activate # En Windows: server\venv\Scripts\activate
cd server
pip install -r requirements.txt
```

4. Crear un archivo `.env` en el directorio del servidor con su Supabase credenciales:
```env
SECRET_KEY=your_secret_key
SUPABASE_URL=your_subabase_url
SUPABASE_KEY=your_subabase_key
JWT_SECRET_KEY=your_jwt_secret
```

### Ejecución de la aplicación

1. Inicie el servidor backend:
```bash
cd server
python app.py
```

2. En una nueva terminal, inicie el servidor de desarrollo frontend:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del proyecto

```
vitrine/
├── src/
│ ├── api/ # Integración de API
│ ├── componentes/ # Componentes reutilizables
│ ├── contexto/ # Contexto de React
│ ├── hooks/ # Hooks personalizados
│ ├── pages/ # Componentes de página
│ ├── types/ # Tipos de TypeScript
│ └── utils/ # Funciones de utilidad
├── server/
│ ├── app.py # Aplicación Flask
│ ├── config.py # Configuración del servidor
│ └── requirements.txt
└── README.md
```

## Contribuir

1. Bifurcar el repositorio
2. Crear la rama de funciones (`git checkout -b feature/AmazingFeature`)
3. Confirmar los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Enviar a la rama (`git push origin feature/AmazingFeature`)
5. Abrir una solicitud de incorporación de cambios

## Licencia

Este proyecto tiene licencia MIT: consulte el archivo [LICENSE](LICENSE) para obtener más detalles.

## Agradecimientos

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Supabase](https://supa
