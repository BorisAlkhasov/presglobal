Instructions:

To test the application you can visit http://16.170.255.132/
Deployed on AWS

The app isn't responsive. So please test it on pc / laptop.

There're 2 folders 'server' and 'client'

Execute 'npm install' command in both of the folders

In server folder: 
    open .env file and change fields DB_HOST, DB_USER and DB_PASSWORD with your mySql server configuration
    run 'npm start'
Server will start on port 3030
On start, server will create database and tables automatically.

In client folder:
If server is running on different host or if you did change the port of the server, modify serverUrl property in client/src/utils/constants.js
    run 'npm run dev'
