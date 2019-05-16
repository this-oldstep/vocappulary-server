# vocappulary-server

server for language learning app Vocappulary

## Team

* Product Ownder: this.oldStep

* Scrum Master: Quinn McCourt

* Development Team Members: Patrick Ryan, Arnulfo Manriquez, and Steven Queyrouze

## Table of Contents

1. Usage
1. Requirements
    1. `npm` packages
    1. `env` variables
1. Setting Up Dependancies
1. Contributing

## Usage

* `npm start`: run nodemon in development
* PM2 for process mangagement in deployment

## Reqirements

### `npm` Packages

* `@google-cloud/speech: ^2.3.1`: Interprates speech and turns it into text
* `@google-cloud/text-to-speech: ^0.5.1`: Turns text to speech
* `aws-sdk: ^2.448.0`: Writes audio files to the AWS server
* `axios: ^0.18.0`: Promise based HTTP client for browser and node.js
* `body-parser: ^1.19.0`: Parses incoming body request
* `clarifai: ^2.9.0`: Image rocognization API
* `cloudinary: ^1.14.0`: Image Storing API
* `dotenv: ^7.0.0`: Loads env variables from a `.env` file for deveolpment
* `express: ^4.16.4`: Fast, unopinionated, minimalist web framework for node
* `express-fileupload: ^1.1.4`: Express middleware for uploading files
* `firebase-admin: ^7.3.0`: User management and confirmationapi_key software
* `jsonwebtoken: ^8.5.1`: Allows for the easy implimentation of JSON web tokens
* `pg: ^7.10.0`: mySQL database software
* `sequelize: ^5.8.3`: SQL database management software
* `socket.io: ^2.2.0`: real-time bidirectional event-based communication

### `env` Variables

* `GOOGLE_APPLICATION_CREDENTIALS`: File path
* `GOOGLE_SPEECH_TO_TEXT`: File path
* `GOOGLE_PROJECT`: Project name
* `GOOGLE_TRANS_API`: API key
* `CLOUD_SDK_REPO`: Google cloud SDK
* `CLOUD_NAME`: Google cloud name
* `CLARIFAI_KEY`: API key
* `API_KEY`: Cloudinary API key
* `API_SECRET`: Cloudinary API secret
* `DB_HOST`: Database host address
* `DB_PORT`: Database host port
* `DB_USER`: Database user
* `DB_PASSWORD`: Database user password
* `AWS_ACCESS_KEY`: AWS access key
* `AWS_SECRET_ACCESS_KEY`: AWS secret
* `FIREBASE`: File path

## Setting Up Dependancies

requires npm to run

use `npm install` to install dependancies