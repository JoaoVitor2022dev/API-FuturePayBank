const User = require("../models/User");

// controller configuration 
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

// security variable
const jwtSecret = process.env.JWT_SECRET; 

// create token 
const geretorToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: "7d"}); 
};

const register = async (req, res) => {
 
    const { name, email, password } = req.body; 

    // check if the user email already exists in the database
    const user = await User.findOne({email}); 
 
    if (user) {
        res.status(401).json({ errors: ["O usuario já existe!"]});
        return
    }

    // Gerenate password hash 
    const salt =  await bcryptjs.genSalt(); 
    const passwordHash = await bcryptjs.hash(password, salt);
    
    // create user
   const newUser = await User.create({ 
       name,
       email,
       password: passwordHash
   })
 
   // check if you had any problems in the whole operation 
    if (!newUser) {
        res.status(422).json({ errors: ["Houve um error, por favor tente mais tarde."]}); 
        return 
    }

   // response to front end with generated id and token
   res.status(201).json({ _id: newUser._id, token: geretorToken(newUser._id)}); 
}

// Sing user login

const login = async (req, res) => {
    
    const { email, password } = req.body 

    // check email exist 
    const user = await User.findOne({email: email}) 

    if (!user) {
        res.status(422).json({ errors: ["O email que voce colocou nao existe"] })
    }

    console.log(user);
    
    if (!(await bcryptjs.compare(password, user.password))) {
        res.status(422).json({ errors: [`${user.name} sua senha esta incorreta.`]});
        return;
   }
    // return user with token 
    res.status(201).json({ _id: user._id, token: geretorToken(user._id)}); 
}

//  get user a token 
const getUserCurrent = async (req, res) => {
    const user = req.user; 

    res.status(201).json(user); 
}; 


// Editing user data
const updateDataUser = async (req, res) => {
    
    const { name, password, email } = req.body; 

    // get user req
    const reqUser = req.user

    const user = await User.findById(reqUser._id.toString()).select("-password");

    if (name) {
        user.name = name;
    }

    const existingEmail = User.findOne({ email: email });

    if (user.email !== email && existingEmail) {
        res.status(401).json({ errors: ["Por favor, use outro email!"]});
        return;    
    }

    if (email) {
        user.email = email; 
    }

    // password
    if (password) {
        // gerate password
        const salt = await bcryptjs.genSalt(); 
        const passwordHash = await bcryptjs.hash(password,salt); 
        
        user.password = passwordHash;
    }

    await user.save();

    res.status(200).json(user); 
}; 


// get user by id 

const getUserById = async (req, res) => { 
    
    const { id } = req.params;

    try {    
        const user = await User.findById(id.toString()).select("-password"); 

        // check user
        if (!user) {
           res.status(422).json({ errors:["Usuário não foi encontrado."]});
        }

        res.status(201).json(user); 

     } catch (error) {
        res.status(404).json({ errors:["Usuário não existe."]});
     } 
}

module.exports = { 
    register,
    login,
    getUserCurrent,
    updateDataUser,
    getUserById
}


