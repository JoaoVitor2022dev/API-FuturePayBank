const mongoose = require("mongoose"); 
const dbUser = process.env.DB_USER; 
const dbPassword = process.env.DB_PASSWORD; 

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@futurepaybankcluster.k7rmjcw.mongodb.net/`
   ); 
    console.log("Conectou ao MongoDB Atlas");

   return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn; 