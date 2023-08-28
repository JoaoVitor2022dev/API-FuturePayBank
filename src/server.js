// condig .env
require("dotenv").config(); 

// express 
const express = require('express'); 
const app = express(); 

const cors = require("cors"); 
const port = process.env.PORT

// config and json data reponse
app.use(express.json());
app.use(express.urlencoded({extended: false})); 

// api and veaw location setting and solve cors
app.use(cors({credentials: true, origin: "http://localhost:3000"})); 

// DB conection 
require("./config/db.js");

// router 
const router = require("./routes/Routes.js");

app.use(router);

app.listen(port,() => {
   console.log(`Servidor rodando na porta ${port}`);
});
