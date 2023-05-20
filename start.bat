start "" /B mongod --dbpath .\Backend\db
start "" /B node .\Backend\socketserver.js
start "" /B cd .\listen2gether-client\src && ng serve