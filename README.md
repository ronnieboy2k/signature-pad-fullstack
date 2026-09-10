# Signature Pad Fullstack

A full-stack digital signature application built with **Django REST Framework** and **React + TypeScript**.

The application allows users to enter their name and create a digital signature using a browser-based signature pad. The signature is submitted to a Django REST API, stored as an image file, and recorded in a SQLite database. Generated signatures can also be viewed through the Django Admin interface.

## Features

* Digital signature pad using HTML5 Canvas and JavaScript
* React + TypeScript frontend
* Django REST Framework API
* Signer and signature database records
* Base64 signature image processing
* Automatic signature image filename generation
* Date-based signature image storage
* Automatic filename uniqueness based on existing database records
* Django Admin interface
* Signature image preview in Django Admin
* Django and React automated tests
* Production React build served by Django

## Tech Stack

### Backend

* Python
* Django 5.0.14
* Django REST Framework 3.15.2
* SQLite

### Frontend

* React
* TypeScript
* Vite
* HTML5 Canvas
* CSS

### Development

* Git
* GitHub
* Vitest
* React Testing Library
* Black

## Architecture

The frontend and backend are separated by responsibility.

```text
React + TypeScript
        │
        │ HTTP / REST API
        ▼
Django REST Framework
        │
        ├── SQLite Database
        │
        └── Media Storage
              │
              └── Signature Images

Django Admin
        │
        └── View Signers and Signature Images
```

React owns the user interface and signature form, while Django handles the API, database, signature image storage, media files, and administration.

In production, the React application is built with Vite and the generated frontend is served by Django.

## Project Structure

```text
signature-pad-fullstack/
│
├── .github/
│   └── workflows/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── signature_pad/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── signatures/
│   ├── services/
│   │   └── signature.py
│   ├── admin.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   └── tests.py
│
├── media/
│   └── signatures/
│       └── YYYY/
│           └── MM/
│               └── DD/
│
├── manage.py
├── db.sqlite3
├── requirements.txt
└── README.md
```

## Database

This project uses **SQLite**.

SQLite was chosen to keep the project simple to set up and easy to run locally without requiring a separate database server.

The main database models are:

### Signer

Stores the signer's name and creation date.

### Signature

Stores the signature record, including:

* Associated signer
* Signature image path
* Creation date

The relationship is:

```text
Signer
  │
  └── Signature
```

## Signature Image Storage

Signature images are stored under the project's `media` directory using a date-based directory structure.

Example:

```text
media/
└── signatures/
    └── 2026/
        └── 09/
            └── 10/
                └── john-doe.png
```

The database stores the relative media path:

```text
media/signatures/2026/09/10/john-doe.png
```

The physical file is stored inside the project's `media` directory.

Signature filenames are generated from the signer's name.

For example:

```text
John Doe
```

becomes:

```text
john-doe.png
```

If the same filename already exists in the database, a numeric suffix is automatically generated:

```text
john-doe.png
john-doe-1.png
john-doe-2.png
```

The filesystem itself is not used to determine filename uniqueness. Existing `Signature.image` database records are used for this purpose.

## API

### Create Signature

```text
POST /api/signatures/
```

Example request:

```json
{
    "name": "John Doe",
    "signature": "data:image/png;base64,..."
}
```

The API creates:

1. A `Signer` record
2. A signature image file
3. A `Signature` record associated with the signer

Example response:

```json
{
    "id": 1,
    "name": "John Doe",
    "signature": "data:image/png;base64,...",
    "date": "2026-09-10T..."
}
```

## Running the Project

### Requirements

Make sure the following are installed:

* Python 3.12 or later
* Node.js
* npm

### Clone the Repository

```bash
git clone https://github.com/ronnieboy2k/signature-pad-fullstack.git
cd signature-pad-fullstack
```

### Create a Python Virtual Environment

Windows:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

### Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### Run Django

```powershell
python manage.py runserver
```

Django will run at:

```text
http://127.0.0.1:8000/
```

## Frontend Development

The React frontend is located in the `frontend` directory.

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite will start the React development server.

The development frontend is available at:

```text
http://localhost:5173/
```

The Vite development server proxies API requests to Django.

## Production Frontend Build

To build the React frontend:

```powershell
cd frontend
npm run build
```

The generated files are placed in:

```text
frontend/dist/
```

Django serves the built React application at:

```text
http://127.0.0.1:8000/signature/
```

## Running Tests

### Django Tests

From the project root:

```powershell
python manage.py test
```

The Django test suite covers:

* React frontend serving
* Signature API
* Signer and signature creation
* Signature filename generation
* Date-based signature directories
* Unique signature filenames
* Signature directory creation
* Signature image saving

### React Tests

From the `frontend` directory:

```powershell
npm test -- --run
```

The React tests cover the signature form and its interaction with the signature pad and Django API.

## Django Admin

The project includes Django Admin for viewing demo signer records and their generated signature images.

Admin URL:

```text
http://127.0.0.1:8000/admin/
```

### Demo Credentials

These credentials are for demonstration purposes only.

```text
Username: demo_admin
Password: demopasspass
```

The database included in this repository contains demo data so the Admin interface can be explored immediately after starting Django.

**Do not reuse the demo password for any personal or production account.**

## Development Workflow

The project was developed using a feature-oriented Git workflow.

Typical workflow:

```text
Implement feature
      ↓
Run tests
      ↓
Build React if frontend changed
      ↓
Review changes
      ↓
Git commit
      ↓
Push to GitHub
```

The commit history reflects the progression from the initial Django application to the REST API, React frontend, frontend/backend integration, testing, media handling, and Django Admin.

## Testing Philosophy

The project uses automated tests to verify important application behavior without unnecessarily testing implementation details.

Backend tests focus on:

* API behavior
* Database records
* Signature image handling
* Filename generation
* File storage behavior

Frontend tests focus on:

* Signature pad interaction
* Form submission
* API interaction
* Success and error states

## AI-Assisted Development

AI tools were used as part of the development process for:

* Exploring implementation approaches
* Reviewing code structure
* Generating and refining test cases
* Troubleshooting development issues
* Improving documentation

All generated code was reviewed, tested, and adapted as necessary before being incorporated into the project.

## Related Project

The signature pad functionality used in this project was developed as a separate JavaScript project:

```text
signature-pad-js
```

The full-stack project demonstrates how the signature pad can be integrated into a modern React + TypeScript frontend and connected to a Django REST backend.

## License

This project is intended as a portfolio and demonstration project.
