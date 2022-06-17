const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const transactionDetails = sequelize.define('transactionDetails',{
        senderAddress : {
            type : DataTypes.STRING,
            field : 'sender_address',
            allowNull : false
        },
        amount : {
            type : DataTypes.INTEGER,
            field : 'amount',
            allowNull : false
        },
        receiverAddress : {
            type : DataTypes.STRING,
            field : 'receiver_address',
            allowNull : false
        },
        hash : {
            type : DataTypes.STRING,
            field : 'hash',
            allowNull : false,
        }


        
    },{ 
        freezeTableName : true,
        tableName : 'transactionDetails',
        paranoid : true,
    })
    return transactionDetails;
}
