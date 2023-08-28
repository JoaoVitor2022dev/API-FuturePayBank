const Account = require("../models/Account");
const User = require("../models/User");
const mongoose = require("mongoose"); 
const bcryptjs = require("bcryptjs");


// Create an account 
const createAccount =  async (req, res) => {
    
    const { accountname, cpf, accountpassword } =  req.body; 
    
    const reqUser = req.user; 
    
    const user = await User.findById(reqUser._id); 
 
    // check if the user has an account
    const account = await Account.findOne({ userId: reqUser._id });

    if (account) {
        res.status(401).json({ errors: ["Você já tem conta"] }); 
        return
    }

    // Generate password hash 
    const salt = await bcryptjs.genSalt(); 
    const passwordHash = await bcryptjs.hash(accountpassword, salt);
    
    const newAccount = await Account.create({
        accountname,
        accountBalance: 0,
        cpf,
        accountpassword: passwordHash,
        userId: user._id, 
        userName: user.name
    })

    if (!newAccount) {
        res.status(422).json({errors:["Houve um problema, por favor tente novamente mais tarde."]});
        return; 
    }    
    res.status(201).json({ _id: newAccount._id });
};

const checkAccountBalance = async (req, res) => {
    const reqUser = req.user

    const account = await Account.findOne({ userId: reqUser._id }).select("-accountpassword");

    if (!account) {
       res.status(401).json({ errors: ["Opa! você ainda não tem conta digital"]}); 
    }

    res.status(201).json(account);  
}; 


const depositAccount = async (req, res) => {
    
    const { cpf, accountpassword, amount } = req.body

    const account = await Account.findOne({ cpf: cpf });  

    if (!account) {
        res.status(401).json({ errors: ["A conta nao existe!"] }); 
        return; 
    }

    if (account.cpf !== cpf) {
        res.status(401).json({ errors: ["O Cpf não cadastrado!"]});    
        return 
    }

    if (!(await bcryptjs.compare(accountpassword, account.accountpassword))) {
        res.status(401).json({ errors: ["A senha esta incorreta!"] }); 
        return;
    }
    
    if (amount) {
        account.accountBalance =  account.accountBalance  + amount; 
    } 
    
    await account.save();
  
    res.status(201).json({ errors: [`Deposito concluido com sucesso, foi depositado o valor de ${amount} reias`]});
}


const withdrawValueAccount =  async (req, res) => {
 
    const { cpf, accountpassword, amount } = req.body

    const account = await Account.findOne({ cpf: cpf });  

    if (!account) {
        res.status(401).json({ errors: ["A conta nao existe!"] }); 
        return; 
    }

    if (account.cpf !== cpf) {
        res.status(401).json({ errors: ["O Cpf não cadastrado!"]});    
        return 
    }

    if (!(await bcryptjs.compare(accountpassword, account.accountpassword))) {
        res.status(401).json({ errors: ["A senha esta incorreta!"] }); 
        return;
    }

    if (amount > account.accountBalance) {
        res.status(401).json({  errors: ["Nao há essa quantidade de dinheiro no seu saldo"] }); 
        return; 
    }
      
    if (amount) {
        account.accountBalance =  account.accountBalance - amount; 
    } 

    await account.save();
  
    res.status(201).json({ errors: [`Saque concluido com sucesso, foi sacado da sua conta o valor de ${amount} reias`]});
};


module.exports = { 
    createAccount,
    checkAccountBalance,
    depositAccount,
    withdrawValueAccount
}








