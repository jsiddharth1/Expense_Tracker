# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY expense-tracker-frontend/package*.json ./
RUN npm install
COPY expense-tracker-frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM maven:3.8.5-openjdk-17 AS backend-build
WORKDIR /app/backend
COPY expense-tracker/pom.xml ./
RUN mvn dependency:go-offline
COPY expense-tracker/src ./src
COPY expense-tracker/mvnw ./
COPY expense-tracker/.mvn ./.mvn

# Copy React build from Stage 1 to backend static folder
COPY --from=frontend-build /app/frontend/build /app/backend/src/main/resources/static

RUN mvn clean package -DskipTests

# --- Stage 3: Final Runtime Image ---
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
