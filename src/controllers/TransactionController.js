const Transaction = require("../models/Transaction");
const user = require("../models/User");
const Account = require("../models/Account");

const transitionAmount = async (req, res) => {
    
    const reqUser = req.user; 

    const { cpfreceiver, amount } = req.body; 
  
    try {
        
    const accountUser = await Account.findOne({ userId: reqUser._id });

    const accountAddressee = await Account.findOne({ cpf:cpfreceiver}); 

    if (!accountAddressee) {
        res.status(401).json({ errors: ["O destinatário nao tem conta no nosso banco!"] }); 
        return
    }

    if (cpfreceiver === accountUser._id) {
        res.status(401).json({ errors: ["Voce nao pode trasnferir para sua propria conta."]})
        return
    }

    if ( amount > accountUser.accountBalance ) {
        res.status(401).json({ errors: ["O valor nao existe em sua conta"] }); 
        return
    }

    accountUser.accountBalance =  accountUser.accountBalance - amount ;

    accountAddressee.accountBalance = amount + accountAddressee.accountBalance; 

    accountUser.save(); 
    accountAddressee.save(); 

    res.status(201).json({ 
        accountUser: accountUser, accountAddressee: accountAddressee,  message: ["Transferencia concluida com sucesso!"]
    });
    } catch (error) {
        res.status(401).json({ 
             errors: ["Ocorreru um problema com nosso servidor", error]
        });
    }

}; 

module.exports = {
    transitionAmount
}