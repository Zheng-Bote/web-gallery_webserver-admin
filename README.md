<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [CrowGallery - Web Frontend](#crowgallery---web-frontend)
  - [🚀 Features](#-features)
    - [🔐 Authentication & Security](#-authentication--security)
    - [📸 Gallery & Dashboard](#-gallery--dashboard)
    - [🛠️ Administration](#-administration)
  - [🏗️ Architecture](#-architecture)
    - [High-Level Overview](#high-level-overview)
- [Key Architectural Conceptsignal-Driven State:](#key-architectural-conceptsignal-driven-state)
        - [Still in progress](#still-in-progress)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# CrowGallery - Web Frontend

![Angular](https://img.shields.io/badge/Angular-v21-dd0031.svg?style=flat&logo=angular)
![Material](https://img.shields.io/badge/Material-v21-3f51b5.svg?style=flat&logo=angular)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**CrowGallery Frontend** is a modern, responsive single-page application (SPA) built to manage and view photo collections. It serves as the user interface for the high-performance C++ [CrowQtServer] backend.

Built with the latest **Angular v21**, it leverages **Standalone Components**, **Signals** for reactive state management, and **Angular Material** for a polished UI.

---

## 🚀 Features

### 🔐 Authentication & Security

- **JWT Authentication:** Secure login with Access and Refresh Token handling.
- **Role-Based Access Control:** Distinct views and capabilities for `User` and `Admin`.
- **Security Guards:** Route protection via `AuthGuard` and `PasswordResetGuard`.
- **Forced Password Rotation:** Enforces password changes for new users or expired credentials.
- **HTTP Interceptor:** Automatically attaches Bearer tokens to outgoing requests.

### 📸 Gallery & Dashboard

- **Responsive Dashboard:** Adaptive grid layout for various screen sizes.
- **Private & Public Views:** Users can manage their own uploads (planned).
- **Modern UI:** Clean aesthetic using Material Design 3.

### 🛠️ Administration

- **User Management:** Admins can Create, Delete, and Deactivate users.
- **Status Monitoring:** Visual indicators for user status (Active/Locked).
- **Password Resets:** Admin-triggered password resets via a dedicated Dialog UI.

---

## 🏗️ Architecture

This project follows a **Feature-Based Architecture** using **Angular Standalone Components**. It moves away from `NgModules` to reduce boilerplate and improve tree-shaking.

### High-Level Overview

```mermaid
graph TD
    User[User / Browser] -->|Interaction| View[Component Template]
    View -->|Event Binding| Component[Standalone Component]

    subgraph "State Management (Signals)"
        Component -->|Read| Signal[AuthService Signals]
        Signal -->|Update UI| View
    end

    subgraph "Data Layer"
        Component -->|Call| Service[Admin/Auth Service]
        Service -->|HTTP Request| HttpClient
        HttpClient -->|Intercept| Interceptor[AuthInterceptor]
        Interceptor -->|Add Token| API[Backend API]
    end
```
# Key Architectural Conceptsignal-Driven State:

We utilize Angular Signals (e.g., currentUser, passwordChangeRequired) instead of complex RxJS streams for synchronous state management.

This ensures "Zoneless" compatibility and fine-grained UI updates.

Standalone Components:

Components (e.g., UserManagementComponent, NavbarComponent) directly import their dependencies.

This makes the codebase easier to refactor and test.

Security Layer:

Interceptor: The authInterceptor centrally manages the Authorization header.

Guards: Functional guards (CanActivateFn) handle redirect logic (e.g., forcing a user to change their password before accessing the dashboard).

🛠️ Tech Stack
Framework: Angular v21

Language: TypeScript 5.x

UI Library: Angular Material v21 & CDK

Styling: SCSS / CSS3 (Grid & Flexbox)

Icons: Material Icons

Build Tool: Angular CLI

⚙️ Installation & Setup
Prerequisites
Node.js (v18 or higher)

npm

Running instance of the CrowQtServer backend.

1. Clone the repository

git clone [https://github.com/yourusername/web-gallery-frontend.git](https://github.com/yourusername/web-gallery-frontend.git)
cd web-gallery-frontend

2. Install Dependencies
Bash

npm install

3. Configure Environment
Check src/environments/environment.ts. Ensure apiUrl points to your C++ backend.

TypeScript

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // Adjust port if necessary
};
4. Run Development Server
Bash

ng serve
Navigate to http://localhost:4200/.

📂 Project Structure

```
src
├── app/
│   ├── components/      # Shared UI (Navbar, etc.)
│   ├── dialogs/         # Modal Dialogs (Password Reset)
│   ├── guards/          # Route protection logic
│   ├── interceptors/    # HTTP Request modification
│   ├── models/          # TypeScript Interfaces
│   ├── pages/           # Views (Dashboard, Login, Admin)
│   ├── service/         # API communication & State
│   ├── app.component.ts # Root layout
│   ├── app.config.ts    # Global provider config
│   └── app.routes.ts    # Routing definitions
└── environments/        # API configuration```
```

##### Still in progress


<!-- readme-tree start -->
```
.
├── .github
│   ├── actions
│   │   └── doctoc
│   │       ├── README.md
│   │       ├── action.yml
│   │       └── dist
│   │           ├── index.js
│   │           ├── index.js.map
│   │           ├── licenses.txt
│   │           └── sourcemap-register.js
│   └── workflows
│       ├── ghp-call_Readme.yml
│       ├── ghp-create_doctoc.yml
│       ├── ghp-markdown_index.yml
│       ├── repo-actions_docu.yml
│       ├── repo-call_Readme.yml
│       ├── repo-create_doctoc.yml_
│       ├── repo-create_doctoc_md.yml
│       └── repo-create_tree_readme.yml
├── .gitignore
├── LICENSE
├── README.md
├── angular.json
├── package-lock.json
├── package.json
├── proxy.conf.json
├── public
│   └── favicon.ico
├── src
│   ├── app
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.spec.ts
│   │   ├── app.ts
│   │   ├── components
│   │   │   ├── dashboard
│   │   │   │   ├── dashboard.component.css
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.spec.ts
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── home
│   │   │   │   ├── home.component.css
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.spec.ts
│   │   │   │   └── home.component.ts
│   │   │   ├── login
│   │   │   │   ├── login.component.css
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.spec.ts
│   │   │   │   └── login.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.component.css
│   │   │   │   ├── navbar.component.component.html
│   │   │   │   ├── navbar.component.component.spec.ts
│   │   │   │   └── navbar.component.component.ts
│   │   │   ├── user
│   │   │   │   └── change-password
│   │   │   │       ├── change-password.component.css
│   │   │   │       ├── change-password.component.html
│   │   │   │       ├── change-password.component.spec.ts
│   │   │   │       └── change-password.component.ts
│   │   │   └── user-management
│   │   │       ├── user-management.component.css
│   │   │       ├── user-management.component.html
│   │   │       ├── user-management.component.spec.ts
│   │   │       └── user-management.component.ts
│   │   ├── dialogs
│   │   │   └── password-reset-dialog.component.ts
│   │   ├── guards
│   │   │   └── password-reset.guard.ts
│   │   ├── interceptors
│   │   │   ├── auth.interceptor.spec.ts
│   │   │   └── auth.interceptor.ts
│   │   ├── models
│   │   │   ├── auth.model.ts
│   │   │   └── photo.model.ts
│   │   └── service
│   │       ├── admin.service.ts
│   │       ├── auth.guard.ts
│   │       ├── auth.service.spec.ts
│   │       ├── auth.service.ts
│   │       └── notification.service.ts
│   ├── custom-theme.scss
│   ├── environments
│   │   └── environment.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── tree.bak
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json

23 directories, 72 files
```
<!-- readme-tree end -->
