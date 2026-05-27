# Escuela de Equitación — Web App

Aplicación web completa para gestión de una escuela de equitación.

## Requisitos previos

- **Node.js v18+** — Descarga en https://nodejs.org/en/download (versión LTS)
- npm (viene incluido con Node.js)

---

## Instalación y arranque

### 1. Instalar dependencias

Abre dos terminales. En la primera:

```bash
cd equestrian-school/backend
npm install
```

En la segunda:

```bash
cd equestrian-school/frontend
npm install
```

### 2. Configurar la base de datos

En la terminal del **backend**:

```bash
npx prisma db push
node src/seed.js
```

Esto crea la base de datos SQLite y un usuario administrador:
- Email: `admin@escuela.com`
- Contraseña: `admin123`

### 3. Arrancar los servidores

**Backend** (terminal 1):
```bash
npm run dev
```
→ Corre en http://localhost:3001

**Frontend** (terminal 2):
```bash
npm run dev
```
→ Corre en http://localhost:5173

---

## Uso

| URL | Descripción |
|-----|-------------|
| http://localhost:5173 | Landing page |
| http://localhost:5173/register | Registro de estudiantes |
| http://localhost:5173/login | Inicio de sesión |
| http://localhost:5173/dashboard | Portal del estudiante |
| http://localhost:5173/admin | Panel de administración |

**Admin por defecto:**
- Email: `admin@escuela.com`
- Contraseña: `admin123`

---

## Funcionalidades

### Portal Estudiante
- Registro e inicio de sesión
- Dashboard con resumen de clases y pagos
- Edición de perfil (nivel, teléfono, contacto de emergencia)
- Subida de comprobantes de pago (JPG, PNG, PDF hasta 5MB)
- Calendario de clases con reserva/cancelación
- Solicitud de cabalgatas (fecha + número de personas)

### Panel Administrador
- Dashboard con estadísticas generales
- Listado de estudiantes con detalle completo
- Gestión de pagos: aprobar/rechazar con nota
- Calendario de clases: crear y eliminar slots
- Cabalgatas: confirmar o cancelar solicitudes

---

## Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | React 18 + Vite + TailwindCSS + FullCalendar |
| Backend | Node.js + Express |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Uploads | Multer |
