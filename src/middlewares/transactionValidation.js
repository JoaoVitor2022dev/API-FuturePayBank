const { body } = require("express-validator"); 

const transitionAmountValidation = () => {
   return [
      body("cpfreceiver")
      .isString()
      .withMessage("O CPF do destinatário é obrigatório."),
      body("amount") 
      .isNumeric()
      .withMessage("O valor da transferência é obrigatório.")
   ]; 
}; 

module.exports = {
    transitionAmountValidation,
}