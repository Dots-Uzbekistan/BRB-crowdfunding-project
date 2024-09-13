# Fundflow Crowdfunding Platform

## Introduction

Welcome to **Fundflow**, a comprehensive crowdfunding platform developed by **Team Dots** for the **BRB FinTech Hackcelerator**. Fundflow empowers founders, investors, and administrators with tools to manage campaigns, investments, and collaborations seamlessly. Featuring advanced AI-powered services, a secure admin dashboard, and real-time analytics, Fundflow is designed to scale effortlessly while ensuring high levels of security and usability.

## Key Features

- **Secure Authentication** using JWT for safe and authenticated user interactions.
- **Dynamic Campaign Management** with a rich WYSIWYG editor for creating and editing campaign pitches.
- **AI-Powered Recommendations**:
  - **Tag and Category Generation**: Automatically generate relevant tags and categories for campaigns.
  - **Campaign Moderation**: Automatically review and moderate campaign content using AI for inappropriate or unsafe changes.
  - **Collaboration Suggestions**: Recommend potential campaign collaborations based on campaign similarities and goals.
- **Collaboration Requests**: Founders can request and manage collaborations with other campaigns, helping projects grow together.
- **Investor Dashboard** with real-time analytics, including investment tracking and campaign performance metrics.
- **Advanced Admin Controls**:
  - Role-based access for administrators.
  - Moderation logs for AI actions such as accepting, blocking, or flagging campaign changes for review.
  - Honeypot protection on admin login for enhanced security.
- **Integrated Payment Processing** with **Multicard** for secure and efficient transactions.
- **Real-Time Notifications**: Users receive notifications for key events such as campaign updates, investment confirmations, and collaboration requests.

## Technologies

- **Frontend**: React, MUI, Recharts
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL
- **AI Services**: Langchain-powered LLM agents for recommendations, collaboration suggestions, and content moderation.
- **Security**: HTTPS, JWT Authentication, Django Honeypot for enhanced admin security.
- **Task Management**: Automated database backups using Django-dbbackup.

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

## AI-Powered Services

Fundflow incorporates AI to assist founders with the following:
- **Tag Generation**: Helps founders generate relevant tags for campaigns automatically.
- **Category Recommendations**: Based on campaign details, the AI suggests the most suitable category for better visibility.
- **Moderation**: AI reviews all campaign changes, flagging inappropriate content and providing a reason for moderation decisions.
- **Collaboration Recommendations**: Suggests potential collaboration opportunities between campaigns.

## Security

- **HTTPS Encryption**: All communication between the client and server is secured via HTTPS.
- **JWT Authentication**: Secure token-based authentication for API interactions.
- **Django Honeypot**: A honeypot mechanism to trap unauthorized admin access attempts.
- **Role-Based Admin Control**: Access control for different admin roles such as Super Admin, Moderators, and Financial Officers.

## Notifications

Real-time notifications are sent to users via email and the dashboard for key events, such as:
- Campaign updates for investors.
- Collaboration requests for founders.
- Investment confirmations for campaign creators.

## API Documentation

Detailed API endpoints, including AI-powered services and collaboration features, are available at our [API documentation](http://161.35.19.77:8001/api/docs/#/).

## License

This software and its source code are made available under the terms of the **Fundflow Proprietary License**. Usage, modification, and distribution are subject to the restrictions outlined in the [LICENSE](LICENSE.md) file located in the root directory of this repository.
