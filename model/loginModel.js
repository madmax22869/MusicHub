//Bring necessary libraries
const mongoose = require('mongoose'); 

//Login storage
const loginSchema = new mongoose.Schema({
    login:{
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    }
});

module.exports = mongoose.model('LoginTable',loginSchema);