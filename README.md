Vitrine
=======

Vitrine es una plataforma que permite a los clientes contratar servicios especializados ofrecidos por la empresa **Noubeau** en áreas como desarrollo web, desarrollo móvil, implementación de IA, e IoT. A través de Vitrine, los clientes pueden:

-   Contratar y gestionar servicios ofrecidos por **Noubeau**.
-   Realizar seguimiento de los proyectos, viendo actualizaciones y progreso.
-   Comunicarse con los proveedores de servicios.
-   Adjuntar y compartir archivos necesarios para completar el trabajo.
-   Recibir notificaciones de requerimientos y avances.

El sistema está desarrollado con **Rust** en el backend para garantizar un rendimiento eficiente y escalable, y **React** con **TypeScript** en el frontend para una experiencia de usuario dinámica y moderna.

* * * * *

Tecnologías Utilizadas
----------------------

-   **Rust**: Lenguaje de programación utilizado en el backend para gestionar la lógica del sistema y la conexión con la base de datos.
-   **React**: Framework de JavaScript utilizado en el frontend para crear una interfaz de usuario interactiva.
-   **TypeScript**: Extensión de JavaScript que permite tipado estático, utilizado en el frontend para mejorar la calidad del código.
-   **SQL (MySQL)**: Base de datos utilizada para almacenar y gestionar la información de los usuarios, servicios, proyectos, archivos y actualizaciones.
-   **Tailwind CSS**: Framework de CSS para estilizar de manera eficiente los componentes de React.

* * * * *

Estructura del Proyecto
-----------------------

### Backend (Rust)

-   **db/**: Contiene las configuraciones de conexión a la base de datos y los modelos de datos (Usuarios, Proyectos, Servicios, etc.).
-   **routes/**: Define las rutas y endpoints de la API para interactuar con los recursos de la base de datos.
-   **services/**: Implementa la lógica de negocio para gestionar la información de usuarios, proyectos y archivos.

### Frontend (React + TypeScript)

-   **src/components/**: Contiene los componentes reutilizables de la interfaz.
-   **src/pages/**: Define las páginas principales de la aplicación (Inicio de sesión, Dashboard, Seguimiento de Proyectos, etc.).
-   **src/services/**: Incluye funciones para realizar solicitudes HTTP al backend.
-   **src/styles/**: Archivos de configuración de Tailwind CSS y estilos personalizados.

* * * * *

Instalación
-----------

### Prerrequisitos

-   **Rust** (versión estable más reciente)
-   **Node.js** y **npm** (para gestionar dependencias de React)
-   **MySQL** (para la base de datos)

### Configuración

1.  **Clona el repositorio**:

    bash

    Copiar código

    `git clone https://github.com/johernandezvaz/vitrine.git
    cd vitrine`

2.  **Instala las dependencias del frontend**:

    bash

    Copiar código

    `cd client
    npm install`

3.  **Configura la base de datos**:

    -   Crea una base de datos en MySQL para el proyecto.
    -   Configura las tablas y relaciones necesarias (consulta el archivo `db/schema.sql`).
4.  **Configura las variables de entorno**:

    -   Crea un archivo `.env` en la raíz del backend y agrega los detalles de conexión a la base de datos:

        bash

        Copiar código

        `DATABASE_URL=mysql://usuario:contraseña@localhost:3306/vitrine`

5.  **Instala las dependencias del backend**:

    bash

    Copiar código

    `cargo build`

6.  **Ejecuta el servidor backend**:

    bash

    Copiar código

    `cargo run`

7.  **Ejecuta el frontend**:

    bash

    Copiar código

    `cd client
    npm start`

* * * * *

Uso
---

Una vez que la aplicación esté en ejecución, puedes acceder a ella a través de `http://localhost:3000`. Desde la interfaz de usuario, los clientes pueden:

-   Navegar por los servicios disponibles y contratarlos.
-   Visualizar el estado de los proyectos en curso.
-   Adjuntar y descargar archivos relacionados con el proyecto.
-   Comunicarse con el proveedor de servicios y recibir actualizaciones.

Objetivos y Alcance
-------------------

Vitrine tiene como objetivo facilitar la colaboración entre **Noubeau** y sus clientes al centralizar la información y comunicación de cada proyecto. Con funcionalidades como la gestión de archivos, seguimiento de tareas, y notificaciones en tiempo real, **Vitrine** optimiza el proceso de desarrollo de proyectos, brindando una experiencia transparente y eficiente tanto para el cliente como para el proveedor.
