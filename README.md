# ecommerce-app

This project is a full-stack e-commerce application with a Vue 3 + Vite frontend and a Node.js/Express + MongoDB backend.

---

## Table of Contents
- [Frontend](#frontend)
- [Backend](#backend)
- [Project Structure](#project-structure)

---

## Frontend

The frontend is built with Vue 3 and Vite.

### Recommended IDE Setup
- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Type Support for `.vue` Imports in TS
TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Customize configuration
See [Vite Configuration Reference](https://vite.dev/config/).

### Project Setup (Frontend)
Navigate to the `frontend` directory before running frontend commands:

```sh
cd frontend
npm install
```

#### Compile and Hot-Reload for Development
```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production
```sh
npm run build
```

---

## Backend

The backend is built with Node.js, Express, and MongoDB.

### Project Setup (Backend)
Navigate to the `backend` directory before running backend commands:

```sh
cd backend
npm install
```

#### Start the Development Server
```sh
npm run dev
```
Or, to start the server normally:
```sh
npm start
```

#### Environment Variables
Create a `.env` file in the `backend` directory and add your environment variables (e.g., MongoDB URI, JWT secret, etc.).

#### Database
This project uses MongoDB. Make sure you have a MongoDB instance running and update your `.env` file accordingly.

#### Useful Scripts
- `npm run dev` — Start the server with nodemon for development
- `npm start` — Start the server normally


#### API Endpoints
See the `backend/routes/` directory for available API endpoints.

---

## Project Structure

```
ecommerce-app/
  backend/    # Node.js/Express/MongoDB backend
  frontend/   # Vue 3 + Vite frontend
```
