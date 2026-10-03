# ==========================================
# Build Stage
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code
COPY src ./src

# Build JAR package (skipping tests for container image build)
RUN mvn clean package -DskipTests

# ==========================================
# Production Runtime Stage
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-privileged system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set file ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (Render or local Docker)
EXPOSE 8080

# Configure JVM options optimized for container environment
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Start the application using dynamic PORT environment variable (Render sets PORT dynamically)
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
