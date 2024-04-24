//Bring necessary libraries
const mongoose = require('mongoose'); 

//Model description
const dataSchema = new mongoose.Schema({
    name:{
        required: true,
        type: String
    },
    atomic:{
        required: true,
        type: Number,
        unique: true
    },
    chem:{
        required: true,
        type: String
    },
    weight:{
        required: true,
        type: Number
    },
    notes:{
        required: false,
        type: String
    }
});

module.exports = mongoose.model('ptable', dataSchema);