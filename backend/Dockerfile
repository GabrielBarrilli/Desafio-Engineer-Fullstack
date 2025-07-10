FROM openjdk:21
VOLUME /tmp

ARG JAR_FILE=build/libs/catalogo-livros.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
