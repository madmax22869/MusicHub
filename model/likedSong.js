//Bring necessary libraries
const mongoose = require('mongoose'); 

// song storage

const likedSongs = new mongoose.Schema({
    name:{
        required: true,
        type: String
    },
    user:{
        required: true,
        type: String
    }
});

module.exports = mongoose.model('likedSongs',likedSongs);