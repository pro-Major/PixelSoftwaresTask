const express = require('express');
const app = express();
const models = require('./models')
const sequelize = models.sequelize;
const cors = require('cors');


app.use(express.json());
app.use(cors());
app.options('*',cors());

app.get('/api/transactions/', async (req,res) =>{
    try {
        const data = await models.transactionDetails.findAll({
            order : [['id','desc']]
        })
        return res.status(200).json(data);
    } catch (error) {   
        return res.status(400).json({messgae : 'Error Fetching transaction',error: error})        
    }
})

app.post('/api/transactions/',async (req,res) =>{
    try {
        const {senderAddress,receiverAddress,amount,hash} = req.body;
        let transactionDetails;
        await sequelize.transaction(async (t)=>{
        transactionDetails = await models.transactionDetails.create({senderAddress,receiverAddress,amount,hash}),{transaction :t}
        })
        return res.status(201).json({messgae : 'Transaction saved successfully',transactionDetails : transactionDetails})

    } catch (error) {
        return res.status(400).json({messgae : 'Error creating transaction',error: error})
        
    }
})



module.exports = app;
