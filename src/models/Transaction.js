const mongoose = require("mongoose");
const { Schema } = mongoose; 

const TransactionSchema = new Schema({
    userId: mongoose.ObjectId,
    cpfTransaction: String,
    userName: String,
    cpfReceiver: String, 
    amount: Number,
},
{
   timestamps: true,
}
);

Transaction = mongoose.model("transaction", TransactionSchema); 

module.exports = Transaction;






