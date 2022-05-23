# Proyecto Tolerancia a Fallas

Aplicación web con arquitectura de microservicios en la que se realiza una encuesta y una vez realizado el voto dependiendo de la versión en la que se haya votado se tendrá la opción de poder jugar un minijuego (versión 2). Además de obtener los resultados de la encuesta.

## Autores 🧸

* **Castillo Rebolledo Diana Fernanda** 
* **García Gonzalez Diego** 
* **Gutiérrez Villalobos Dayal** 

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en un entorno Sandbox de Red Hat Openshift para propósitos de desarrollo y pruebas._

### Pre-requisitos 📋

#### OpenShift
_Para poder desplegar la aplicación será necesario tener una cuenta en Red hat (o [crear una](https://sso.redhat.com/auth/realms/redhat-external/login-actions/registration?client_id=https%3A%2F%2Fwww.redhat.com%2Fwapps%2Fugc-oidc&tab_id=d4m5wQc_HtY) en caso de no tenerla) así como haber iniciado un [Developer Sandbox for Red Hat OpenShift](https://developers.redhat.com/developer-sandbox/get-started) y tener acceso al mismo._

## Despliegue 📦

_A continuación se mostrarán los pasos para desplegar la aplicación en la plataforma de Openshift:_

El primer paso es crear la base de datos, OpenShift proporciona una imagen de contenedor para ejecutar PostgreSQL. En la terminal de Openshift se debe ejecutar el siguiente comando, el cual crea un nuevo pod de base de datos con PostgreSQL ejecutándose en un contenedor:

```
$ oc new-app 
    -e POSTGRESQL_USER=<username> 
    -e POSTGRESQL_PASSWORD=<password> 
    -e POSTGRESQL_DATABASE=<database_name> 
    postgresql:latest
```
_Puedes consultar el siguiente [enlace](https://docs.openshift.com/online/pro/using_images/db_images/postgresql.html) para acceder a la base de datos y crear la tabla en la que se van a almacenar los votos._

Dentro de la base de datos se debe aplicar la siguiente instrucción para crear la tabla:

```
CREATE TABLE votos(
    voter_id VARCHAR(50) NOT NULL PRIMARY KEY,
    vote VARCHAR(1) NOT NULL );
```
Una vez que está lista la base de datos, el siguiente paso es desplegar el mini juego en JavaScript al que se puede acceder en la versión 2 de la encuesta, para ello se debe ejecutar el siguiente comando en la terminal:

```
$ oc new-app -f https://raw.githubusercontent.com/diana-castillo/Proy-ft/main/openshift/game.json
```

En seguida, ya se pueden desplegar la versión 1 y 2 de la encuesta en python, las cuales tendrán el [tráfico](https://docs.openshift.com/container-platform/4.6/serverless/develop/serverless-traffic-management.html) dividido 50% y 50% entre sí, esto se logra con los siguientes comandos:

```
$ kubectl apply -f https://raw.githubusercontent.com/diana-castillo/Proy-ft/main/openshift/python-v1.yaml

$ kubectl apply -f https://raw.githubusercontent.com/diana-castillo/Proy-ft/main/openshift/python-v2.yaml

$ kubectl apply -f https://raw.githubusercontent.com/diana-castillo/Proy-ft/main/openshift/split.yaml
```
Finalmente, para desplegar la aplicación en Node.js de los resultados de la encuesta, se debe aplicar el siguiente comando:

```
$ kubectl apply -f https://raw.githubusercontent.com/diana-castillo/Proy-ft/main/openshift/result.yaml
```

Cuando se hayan aplicado todos los comandos anteriores, ya estarán listos los cinco microservicios que necesita la aplicación para funcionar, y se accederá a ellos con los enlaces que proporciona Openshift cuando se despliega cada microservicio.

## Construido con 🛠️

_Herramientas y lenguajes utilizados para el desarrollo de todo el proyecto:_

* [PostreSQL](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v6.8/windows/) - Base de datos utilizada
* [Flask](https://flask.palletsprojects.com/en/2.1.x/) - Microframework para el desarrollo web
* [Nodejs](https://nodejs.org/es/) - Entorno para la API del back-end
* [Html](https://developer.mozilla.org/en-US/docs/Web/HTML) y [Javascript](https://www.javascript.com/) - Lenguajes para desarrollo web
* [Openshift Sandbox](https://developers.redhat.com/developer-sandbox/get-started) - Ambiente para construcción de la aplicación

## Arquitectura 🧭

![Modelo proyecto, tolerante fallas drawio](https://user-images.githubusercontent.com/70995583/168410329-ffe68f6b-becd-46c2-b2d5-8e55b55c961b.png)


