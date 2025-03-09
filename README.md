# AI-Powered Web Application

## Overview

This project is a one-page web application that allows users to input parameters and retrieve AI-generated results. The application supports multiple functionalities:

- **Calorie Information**
- **Text Translation**
- **PDF Summarization**

Additionally, the app includes bonus features such as:
- A floating chatbot interface
- Dark/Light mode toggle
- Session timeout for improved security
- Text-to-speech for AI responses
- Persistent storage of query history in a MySQL database

---

## Key Features

### Backend
- **MVC Architecture:**  
  Organized using controllers (e.g., `authController.js`), models (e.g., `User.js`, `Query.js`), routes (e.g., `auth.js`, `ai.js`, `queries.js`), and middleware (e.g., `authMiddleware.js`).
- **AI Integration:**  
  Processes data and generates results using a large language AI model.
- **Data Persistence:**  
  User queries are stored in a MySQL database. The `queries` table stores the user ID, query text, option type, and timestamps.
- **User Authentication:**  
  Uses JWT-based authentication with token generation upon login.

### Frontend
- **Single-Page Application (SPA):**  
  Built using React with a clean, responsive, and user-friendly interface.
- **Reusable Components:**  
  Includes components such as `Button`, `FeatureCard`, `QueryHistory`, and `AIResponse` for modularity and maintainability.
- **Additional Enhancements:**  
  - Dark/Light mode toggle  
  - Floating chatbot  
  - Text-to-speech for AI responses  
  - Session timeout for automatic logout after inactivity  
  - Carousel for instructions and feature highlights

---

## Folder Structure

### Backend
```plaintext
ai-web-app-backend/
├── config/
│   └── database.js         # MySQL connection using Sequelize
├── controllers/
│   └── authController.js   # Authentication logic (login/register)
├── middleware/
│   └── authMiddleware.js   # JWT authentication middleware
├── models/
│   ├── User.js             # User model definition
│   └── Query.js            # Query model definition
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── ai.js               # AI-related routes
│   └── queries.js          # Routes for saving and fetching queries
├── .env                    # Environment variables (not committed)
├── server.js               # Express server entry point
└── package.json


ai-web-app-frontend/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── QueryHistory.jsx
│   │   └── AiResponse.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   ├── api.js           # API calls to backend and AI model
│   │   └── chatbot.jsx      # Chatbot component
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env                    # Environment variables for frontend if needed
└── package.json
