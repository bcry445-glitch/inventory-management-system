# Enterprise Inventory & Order Management System

**Developer:** Muhammad Fazeel Khan  
**Version:** 1.0.0

## Live Deployment URLs

- **Frontend Application (Vercel):** https://inventory-management-system-blond-seven.vercel.app
- **Backend API Docs (Render/Swagger):** https://inventory-management-system-bin9.onrender.com/api-docs

## 📖 Project Overview

A scalable, enterprise-grade MERN stack web application designed to manage multi-branch inventory, supplier data, and customer orders. Features include real-time stock deductions, JWT role-based authentication, and a data-driven metrics dashboard.

## 🏗️ Folder Structure Diagram

```text
inventory-management-system/
│
├── client/                 # React.js Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Layout, Modals)
│   │   ├── pages/          # Dashboard, Inventory, Orders, Login
│   │   └── App.jsx         # Routing configuration
│   └── Dockerfile          # Frontend container config
│
├── server/                 # Node.js/Express Backend
│   ├── controllers/        # Business logic (Orders, Products, Auth)
│   ├── middleware/         # JWT Authentication protection
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API endpoints
│   ├── swagger.json        # OpenAPI documentation specs
│   ├── server.js           # Main application entry point
│   └── Dockerfile          # Backend container config
│
├── .github/workflows/      # GitHub Actions CI/CD Pipeline
├── docker-compose.yml      # Multi-container orchestration
└── README.md               # Deployment and Installation guide
```
