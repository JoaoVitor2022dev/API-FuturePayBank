const { validationResult } = require("express-validator");

const validate = (req, res, next ) => {
 
    // errors that come from the request can be through uservalidation
    const errors = validationResult(req);  

    // check erros in validationResult 
    if (errors.isEmpty()) {
        return next()
    }; 

    // erros`s array
    const extratedErros = []; 

    // error array creation
    errors.array().map((err) => extratedErros.push(err.msg));

    // return erros in json 
    return res.status(422).json({ errors: extratedErros}); 
}

module.exports = validate;