# JobFlow — Job Application Tracker

A full-stack MERN application to manage your job search pipeline with a beautiful UI.

![Stack](https://img.shields.io/badge/Stack-MERN-informational)
![Auth](https://img.shields.io/badge/Auth-JWT-green)
![UI](https://img.shields.io/badge/UI-Tailwind%20v3-blue)

## ✨ Features

- 🔐 **JWT Auth** — Register/login with access + refresh token rotation
- 📋 **Applications CRUD** — Add, edit, delete with full metadata
- 🗂️ **Kanban Board** — Drag & drop cards across status columns
- 📊 **Dashboard** — Stats cards, bar chart, donut chart, reminders widget
- 🔍 **Filters & Search** — Filter by status/source, debounced search, column sort
- ☑️ **Bulk Actions** — Select multiple and bulk delete
- 🔔 **Reminders** — Follow-up due today + overdue sections
- 🌙 **Dark Mode** — System preference + manual toggle
- 📱 **Responsive** — Mobile-friendly layout

## 🛠 Tech Stack

| Layer      | Tech                                        |
|------------|---------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3, Zustand    |
| Routing    | React Router v6                             |
| Charts     | Recharts                                    |
| Drag & Drop| @hello-pangea/dnd                           |
| HTTP       | Axios (with interceptors + auto refresh)    |
| Backend    | Express.js, Node.js                         |
| Database   | MongoDB + Mongoose                          |
| Auth       | JWT (access 15m + refresh 7d, httpOnly cookie)|
| Toasts     | react-hot-toast                             |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone & Install

```bash
git clone <repo-url>
cd job-tracker

# Install all deps at once
npm install
npm run install:all
```

### 2. Configure Environment

```bash
# Server
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Development Servers

```bash
# Run both simultaneously
npm run dev

# Or separately
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:5173
```

## 📁 Project Structure

```
job-tracker/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── application.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── Application.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── application.routes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── ApiHelpers.js
│   └── server.js
│
└── client/
    └── src/
        ├── components/
        │   ├── applications/   # Card, Row, Modal
        │   ├── layout/         # Sidebar, ProtectedLayout
        │   └── ui/             # Badge, Modal
        ├── hooks/              # useDebounce
        ├── pages/              # Dashboard, Board, Applications, Reminders, Login, Register
        ├── services/           # axiosInstance, api.service
        ├── store/              # authStore, applicationStore (Zustand)
        └── utils/              # statusColors, dateHelpers
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint                | Description        |
|--------|-------------------------|--------------------|
| POST   | /api/auth/register      | Register user      |
| POST   | /api/auth/login         | Login + set cookie |
| POST   | /api/auth/logout        | Clear cookie       |
| POST   | /api/auth/refresh-token | New access token   |
| GET    | /api/auth/me            | Get current user   |

### Applications (all protected)
| Method | Endpoint                        | Description           |
|--------|---------------------------------|-----------------------|
| GET    | /api/applications               | List (filter/sort)    |
| POST   | /api/applications               | Create                |
| GET    | /api/applications/:id           | Get one               |
| PUT    | /api/applications/:id           | Update                |
| DELETE | /api/applications/:id           | Delete                |
| PATCH  | /api/applications/:id/status    | Update status only    |
| GET    | /api/applications/stats         | Dashboard stats       |
| GET    | /api/applications/reminders     | Due/overdue items     |

## 🚢 Deploying to AWS

### Backend (EC2 or Elastic Beanstalk)
1. Set `NODE_ENV=production` in env vars
2. Use MongoDB Atlas for database
3. Set `CLIENT_URL` to your frontend domain

### Frontend (S3 + CloudFront or Amplify)
```bash
cd client
npm run build
# Upload dist/ to S3 or use Amplify
```

Update `client/.env` for production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```
