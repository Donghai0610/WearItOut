FROM openjdk:17-jdk-alpine
LABEL authors="donghai"
ARG JAR_FILE=target/*.jar
COPY ./target/WearItOut-Application.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]