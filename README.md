# 🎓 Colegio Once México - Sistema de Registro de Visitas y Estadísticas

Este proyecto es una aplicación web para gestionar el registro de visitantes y visualizar estadísticas en el Colegio Once México. Incluye un backend con autenticación segura y un frontend con formularios y visualización gráfica.

---

## 🛠️ Tecnologías Utilizadas

**Backend**

- **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.
- **Express:** Framework de Node.js para construir aplicaciones web y APIs.
- **MySQL:** Sistema de gestión de bases de datos relacional.
- **Bcrypt:** Biblioteca para el hashing seguro de contraseñas.
- **JSON Web Token (JWT):** Estándar para la autenticación y autorización de usuarios.
- **Dotenv:** Módulo para cargar variables de entorno desde un archivo `.env`.
- **Cors:** Middleware para habilitar Cross-Origin Resource Sharing.

**Frontend**

- **HTML:** Lenguaje de marcado para la estructura de la página web.
- **CSS:** Lenguaje de estilos para la presentación de la página web.
- **JavaScript:** Lenguaje de programación para la lógica del frontend.
- **Bootstrap 5:** Framework de CSS para diseño responsivo.
- **Chart.js:** Biblioteca para la creación de gráficos.

---

## 📁 Estructura del Proyecto

```
Colegio
│
src/
│
├── api/                     # Backend (Node.js + Express)
│   ├── config/              # Configuración de base de datos
│   │   └── database.js
│   ├── controllers/         # Lógica para manejar solicitudes
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── registroController.js
│   │   └── estadisticasController.js
│   ├── middleware/          # Middleware personalizado
│   │   └── authMiddleware.js
│   ├── routes/              # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── registroRoutes.js
│   │   └── estadisticasRoutes.js
│   ├── services/            # Lógica de negocio y conexión a BD
│   │   ├── authService.js
│   │   ├── registroService.js
│   │   └── estadisticasService.js
│   ├── server.js            # Entrada del servidor Express
│   ├── .env                 # Variables de entorno (configuración sensible)
│   ├── package.json         # Dependencias y scripts del backend
│   └── package-lock.json    # Registro exacto de dependencias instaladas
│
├── public/                  # Frontend (HTML + CSS + JS)
│   ├── index.html           # Página principal (login)
│   ├── css/                 # Estilos personalizados
│   ├── js/                  # Lógica frontend
│   ├── assets/              # Imágenes y recursos estáticos
│   └── pages/               # Subpáginas del frontend
│       ├── panel.html       # Panel de opciones tras login
│       ├── formulario.html  # Formulario de registro
│       └── estadisticas.html # Visualización de gráficas
│
├── .gitignore
└── README.md

```

---

## 🚀 Instrucciones de Ejecución

### 🖥 Backend

1. Clona el repositorio:

   ```bash
   git clone https://github.com/josecervera20/Colegio.git
   ```

2. Instala las dependencias:

   ```bash
   cd src/api
   npm install
   ```

   #### 📦 Dependencias del Backend

   Estas son las dependencias necesarias para el backend:

   ```json
   "dependencies": {
     "bcrypt": "^5.1.1",
     "cors": "^2.8.5",
     "dotenv": "^16.4.7",
     "express": "^5.1.0",
     "jsonwebtoken": "^9.0.2",
     "mysql2": "^3.14.0"
   }
   ```

3. Crea un archivo `.env` con los datos de conexión:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_DATABASE=colegio
   DB_CONNECTION_LIMIT=10
   JWT_SECRET_KEY=clave_super_secreta
   ```

4. Ejecuta el servidor:
   ```bash
   node server.js
   ```

El servidor correrá en `http://localhost:3000`.

---

### 💻 Frontend

Abre el archivo `src/public/index.html` con Live Server (VSCode) o tu navegador preferido.

> Más adelante, se podrá servir desde Express directamente.

---

## 📌 Funcionalidades del Backend (API)

### 🔐 Autenticación (`/api/auth`)

| Método | Ruta      | Descripción                    |
| ------ | --------- | ------------------------------ |
| POST   | /login    | Iniciar sesión y obtener token |
| POST   | /register | Crear nuevo usuario            |

### 👤 Usuarios (`/api/usuarios`)

| Método | Ruta      | Descripción                         |
| ------ | --------- | ----------------------------------- |
| GET    | /usuarios | Listado de todos los usuarios       |
| GET    | /panel    | Ruta protegida para mostrar mensaje |

### 📝 Registro de Visitas (`/api/registrar-entrada`)

| Método | Ruta               | Descripción                       |
| ------ | ------------------ | --------------------------------- |
| POST   | /registrar-entrada | Registrar entrada de un visitante |

**Campos requeridos:**

- `fecha`, `hora`, `nombre`, `tipoVisita`, `motivoVisita`, `visitaA`, `departamento`, `compania`

### 📊 Estadísticas (`/api/estadisticas`)

| Método | Ruta                     | Descripción                         |
| ------ | ------------------------ | ----------------------------------- |
| GET    | /entradas-por-dia        | Total de entradas agrupadas por día |
| GET    | /tipos-visitante         | Total por tipo de visitante         |
| GET    | /departamentos-visitados | Departamentos más visitados         |

---

## 💡 Interfaz de Usuario (Frontend)

- **Login (index.html):** Ingreso mediante usuario y contraseña.
- **Panel (panel.html):** Acceso a secciones del sistema tras autenticación.
- **Formulario de Registro (formulario.html):** Permite registrar la entrada de un visitante.
- **Estadísticas (estadisticas.html):** Muestra gráficas con datos dinámicos.

---

## 🧪 Validaciones

- Validación de campos obligatorios en backend.
- Autenticación con tokens JWT.
- Prevención de inyecciones SQL mediante consultas parametrizadas.

---

## 📂 .gitignore actualizado

```gitignore
# Node modules
node_modules/
src/api/node_modules/

# Archivos de entorno
.env
src/api/.env

# Configuración del editor
.vscode/

# Archivos temporales
.DS_Store
Thumbs.db
*.log
*.tmp
*.swp

# Builds
dist/
build/
```

---

## 🛠 Futuras mejoras

- Servir frontend desde el backend con Express.
- Modularizar más el frontend con JavaScript moderno (ESModules).
- Agregar pruebas automatizadas (unitarias e integración).
- Añadir paginación y exportación de estadísticas.

---

## 👨‍💻 Autor

Desarrollado por José Luis Justiniano Cervera.
