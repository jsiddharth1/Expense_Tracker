# Expense Tracker

A full-stack web application designed to help users track and manage their personal expenses efficiently. This project provides a complete solution with a robust backend API and a dynamic, responsive frontend dashboard.

## 🚀 Tech Stack

### Frontend
- **React (v19)**: Component-based UI library for building the user interface.
- **React Router DOM (v7)**: Handles client-side routing for seamless navigation between pages.
- **Axios**: Promise-based HTTP client for making REST API requests to the backend.
- **Chart.js & React-Chartjs-2**: Used for rendering interactive data visualizations (e.g., doughnut charts) on the dashboard to visualize spending habits.
- **React Icons**: For incorporating scalable vector icons throughout the application.
- **Custom CSS**: Styling with a focus on modern, responsive design and smooth animations (including toast notifications and interactive UI elements).

### Backend
- **Java 17**: The core programming language for the backend service.
- **Spring Boot (v3.4)**: Framework for rapidly building the RESTful API and backend logic.
- **Spring Web**: Handles HTTP requests and builds the REST API endpoints.
- **Spring Data JPA & Hibernate**: ORM (Object-Relational Mapping) used for managing database interactions and entity mapping without writing complex SQL.
- **Spring Security**: Secures the application endpoints and handles user authentication and authorization.
- **Lombok**: Reduces boilerplate code (such as getters, setters, and constructors) in Java entity and DTO classes.
- **Jackson**: Handles JSON serialization and deserialization for API requests and responses.
- **Global Exception Handler**: Centralized error handling using `@ControllerAdvice` to provide consistent and user-friendly HTTP error responses.

### Database
- **MySQL / PostgreSQL**: The application supports relational databases, utilizing MySQL for local development and PostgreSQL for cloud deployments. Environment variables are used to securely inject connection properties.

### Architecture & Design Patterns
- **RESTful API**: Clean client-server separation with structured endpoints for CRUD (Create, Read, Update, Delete) operations.
- **Service Layer Pattern**: Business logic is abstracted into Service classes (like `ExpenseService`), ensuring Controllers remain thin and focused purely on HTTP routing.
- **Context API (React)**: Global state management for handling user authentication status (`AuthContext`) across the frontend application.
- **Environment-Based Configuration**: Uses `.env` and `application.properties` to manage environment-specific variables securely.

## ✨ Key Features
- **User Authentication**: Secure login and registration system.
- **Dashboard Visualization**: Real-time charts to visualize expenses by category.
- **Expense Management**: Add, update, view, and delete expenses with immediate UI updates.
- **Modern UI/UX**: Includes features like custom toast notifications for immediate user feedback and responsive layouts for various screen sizes.

## 🛠️ Local Development

### Prerequisites
- Node.js & npm
- Java 17
- MySQL or PostgreSQL

### Setup Instructions

1. **Database Configuration**
   - Create a local database.
   - Configure the database credentials via environment variables or directly in `expense-tracker/src/main/resources/application.properties`.

2. **Backend Setup**
   - Navigate to the `expense-tracker` directory.
   - Run the Spring Boot application (default port is `8081`):
     ```bash
     ./mvnw spring-boot:run
     ```

3. **Frontend Setup**
   - Navigate to the `expense-tracker-frontend` directory.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```
