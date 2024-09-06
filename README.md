# Fundflow Crowdfunding Platform

## Introduction

Welcome to Fundflow! Developed by Team Dots for the BRB FinTech Hackcelerator, this platform provides a robust solution for managing and participating in crowdfunding campaigns. With a focus on security, scalability, and user engagement, Fundflow is designed to handle everything from campaign creation to investment management with ease.

## Key Features

- **Secure Authentication** with JWT for safe user interactions.
- **Dynamic Campaign Management** with a rich WYSIWYG editor for campaign pitches.
- **AI-Powered Recommendations** for founders to optimize campaign strategies.
- **Investor Dashboard** with real-time analytics and investment tracking.
- **Robust Admin Controls** for managing the platform and monitoring activities.
- **Integrated Payment Processing** with Multicard for secure transactions.

## Technologies

- **Frontend**: React
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **Security**: HTTPS, JWT Authentication

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL

### Clone the Project

```bash
git clone <https://github.com/Dots-Uzbekistan/BRB-crowdfunding-project.git>
cd BRB-crowdfunding-project
```

### Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # For Windows use `venv\\Scripts\\activate`
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Detailed API endpoints are available at our [API documentation](http://161.35.19.77:8001/api/docs/#/).

## License
This software and its source code are made available under the terms of the Fundflow Proprietary License. Usage, modification, and distribution are subject to the restrictions outlined in the [LICENSE](LICENSE.md) file located in the root directory of this repository.
