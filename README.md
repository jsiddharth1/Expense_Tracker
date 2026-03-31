# Expense Tracker - Unified Application

A comprehensive expense tracking application built with **Spring Boot** (Backend) and **React** (Frontend).

## Project Structure
- `expense-tracker/`: Spring Boot backend service.
- `expense-tracker-frontend/`: React frontend application.
- `.github/workflows/`: CI/CD automation.

## Local Development
### Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server

### Running the App
1.  **Database**: Create a MySQL database named `expense_db`.
2.  **Backend**: `cd expense-tracker && ./mvnw spring-boot:run`
3.  **Frontend**: `cd expense-tracker-frontend && npm install && npm start`

## Deployment & Production Build
This project is configured for a **unified deployment**, where the frontend is served by the backend.

### 1. Build and Package
To create a production-ready JAR:
1.  **Build Frontend**: 
    ```bash
    cd expense-tracker-frontend
    npm run build
    ```
    *This automatically copies the assets to the backend's static resources.*
2.  **Build Backend**:
    ```bash
    cd ../expense-tracker
    ./mvnw clean package -DskipTests
    ```

### 2. Run in Production Mode
```bash
java -jar expense-tracker/target/expense-tracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## CI/CD
This project uses **GitHub Actions** to automate the build process. Every push to the `main` branch will trigger a build, and the final JAR will be available as an artifact in the **Actions** tab of your GitHub repository.
