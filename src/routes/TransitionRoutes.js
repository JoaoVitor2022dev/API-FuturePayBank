const express = require("express");
const router = express.Router();

// controllers
const { transitionAmount } = require("../controllers/TransactionController");

// validantion 
const { transitionAmountValidation } = require("../middlewares/transactionValidation"); 

// for error checking, and validate next action 
const  validate  = require("../middlewares/handleValidation");

// auth 
const authGuard = require("../middlewares/authGuard");

// router 
router.post("/transitionAmount", authGuard, transitionAmountValidation(), validate, transitionAmount);

module.exports = router; 



