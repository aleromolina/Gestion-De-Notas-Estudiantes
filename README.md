# Sistema de Gestión de Estudiantes

Aplicación web desarrollada para gestionar estudiantes, cursos y notas, utilizando Node.js, Express y MySQL.

## Tecnologías utilizadas

- Node.js
- Express
- MySQL
- HTML5
- CSS3
- JavaScript
- Fetch API

## Funcionalidades

- Listar estudiantes, cursos y notas.
- Registrar nuevos estudiantes.
- Registrar notas.
- Consultar las notas de un estudiante.
- Actualizar y eliminar notas.
- Visualizar estudiantes con notas aprobadas.

## Estructura del proyecto

```text
gestion-estudiantes/
├── backend/
│   ├── index.js
│   └── conexion.js
├── frontend/
│   ├── index.html
│   ├── main.js
│   └── style.css
├── database/
│   └── estructura.sql
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación

1. Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

2. Instalar las dependencias:

```bash
npm install
```

3. Configurar las credenciales de MySQL en el archivo `.env`.

4. Importar la estructura de la base de datos.

5. Iniciar el servidor:

```bash
npm run dev
```

6. Abrir en el navegador:

```text
http://localhost:3000
```

## Objetivo

Proyecto desarrollado como práctica para fortalecer conocimientos en JavaScript, desarrollo backend, consumo de API REST y bases de datos relacionales.
