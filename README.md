# Movies-Library - Project Version

**Author Name**: Abdallah Toughoj

## WRRC
![WRRC lab11 Image](WRRC.jpg)

## Overview
For lab 11 I will set up the server for the movie app and create the basic structures

## Getting Started
1. npm init -y
2. create (server.js) file
3. npm install express
## Project Features
The server has three routes with their handler :
1. home page : when the client request "/" the callback will return the provided JSON data in the file"data.json" with a new structure that the constructor provide.
2. favorite page : when the client request "/favorite" the callback will return "Welcome to Favorite Page".
3. status 404 : when the client request any route except "/" and "/favorite" the callback will return "page not found error" and the status will be 404.