# ---------- BUILD STAGE ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml ./

RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -T 1C dependency:go-offline
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -T 1C clean package -DskipTests


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jre-alpine AS runtime

# Install curl for healthchecks
RUN apk add --no-cache curl

WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8761

HEALTHCHECK --interval=10s --timeout=5s --retries=10 \
  CMD curl -f http://127.0.0.1:8761/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xms256m", "-Xmx512m", "-jar", "/app/app.jar"]