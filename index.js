const express = require('express');
const aktorlerRouter = require("./routers/aktorlerRouter");
//const auth = require("./routers/auth");

const server = express();
server.use(express.json());
server.use("/actors", aktorlerRouter);
//server.use("/auth", auth);
//server.use(express.urlencoded({ extended: true })); // Form verilerini işlemek için

server.listen(5000, () => {
    console.log('server 5000 portunda calısıyor');
})