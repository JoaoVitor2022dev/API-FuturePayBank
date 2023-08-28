const { body } = require("express-validator");

const accountCreateValidation = () => {
    return [
       body("accountname")
       .isString()
       .withMessage("O nome para a conta é obrigatorio")
       .isLength({ min : 3 })
       .withMessage("O nome da conta deve ter mais de 3 caracteres"),
        body("cpf")
       .isString()
       .withMessage("O CPF é obrigatorio para criar a conta!")
       .isLength({ min: 11 })
       .withMessage("CPF inválido!"),
       body("accountpassword")
       .isString()
       .withMessage("A senha é obrigatorio da sua conta!")
       .isLength({ min: 4 })
       .withMessage("A senha deve ter mais de 4 digito")
    ]; 
}; 

const depositAccountValidation = () => {
   return [
    body("cpf")
     .isString()
     .withMessage("O cpf é obrigatório"), 
    body("accountpassword")
     .isString()
     .withMessage("A senha é obrigatória")
     .isLength()
     .withMessage("A senha deve ter 4 dígtos"),
    body("amount")
    .isNumeric()
    .withMessage("O valor tem do deposito é obrigatorio!")  
   ] 
};

module.exports = { 
    accountCreateValidation,
    depositAccountValidation
}
