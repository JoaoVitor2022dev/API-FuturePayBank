const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => { 
 
    const authHeader = req.headers['authorization']; 
    
    const token = authHeader && authHeader.split(" ")[1];
   
    // check header token 
    if (!token) return res.status(422).json({ errors: ["Acesso negado!"] }) 
 
    // check if token 
    try {

     const verified = jwt.verify(token, jwtSecret); 
     
     req.user = await User.findById(verified.id).select("-password"); 
        
     next();
    } catch (error) {
        res.status(422).json({ errors: ["Token invalido"] })
    } 
}

module.exports = authGuard 

