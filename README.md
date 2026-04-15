<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="#"><img src="https://img.shields.io/badge/Laravel-13.x-FF2D20.svg?style=flat&logo=laravel" alt="Laravel Version"></a>
<a href="#"><img src="https://img.shields.io/badge/PHP-8.2+-777BB4.svg?style=flat&logo=php" alt="PHP Version"></a>
<a href="#"><img src="https://img.shields.io/badge/Database-MySQL-4479A1.svg?style=flat&logo=mysql" alt="MySQL"></a>
<a href="#"><img src="https://img.shields.io/badge/License-MIT-success.svg?style=flat" alt="License"></a>
</p>

## About This Project

This repository contains the core Backend API for a **Real-time Collaborative Note-taking Application** (Final Term Project).

Built with **Laravel 13**, this RESTful API handles robust user authentication, secure data storage, media management, and queued background tasks. It is designed following a microservices-oriented architecture, acting as the main "Source of Truth" while working alongside a separate Node.js server (CRDT Engine) to facilitate real-time collaboration.

### ✨ Key Features

- **Robust Authentication:** Secure login, registration, and password reset flows using JWT/Sanctum.
- **Collaborative Document Management:** Specifically designed schema to handle multiple users editing notes.
- **Cloud Media Storage:** Direct integration with **Cloudinary** for highly optimized, off-server image uploads and resizing.
- **Asynchronous Communications:** Background email processing (Account Verification, Password Recovery) utilizing Laravel Queues and **Mailtrap**.
- **Microservice Ready:** Prepared endpoints and webhooks to synchronize final document states with the Node.js WebSocket service.

---

## 🛠 Tech Stack

- **Framework:** Laravel 13 (PHP)
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **Media Storage:** Cloudinary PHP SDK
- **Mailing:** Mailtrap
- **Real-time Engine (External):** Node.js, WebSockets, Yjs (CRDT)

---

## 🚀 Installation & Setup

To get this API running on your local machine, follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/ShikiHTM/notes-app-api.git
cd notes-app-api
```
**2. install dependencies**

Install the necessary PHP packages:
```bash
composer install
```

**3. Setup environment variables**
Create your local environment configuration files:
```bash
cp .env.example .env
```

**4. Generate Application Key**
```bash
php artisan key:generate
```

**5. Configure Database & External Services**

Open the `.env` file and update the following credentials:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (Your local MySQL setup)
- `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` (Your MailTrap credentials)
- `CLOUDINARY_URL` (Your Cloudinary API key)

**6. Run Migrations**

Create the necessary tables in your database:
```bash
php artisan migrate
```

**7. Start the local server**
```bash
php artisan serve
```

The API will now be accessible at `http://127.0.0.1:8000` (or your custom local domain).

## 📚 API Documentation
## 📄 License

This project is open-sourced software licensed under the MIT license.
