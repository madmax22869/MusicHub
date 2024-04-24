//Bring necessary libraries
const express = require('express');
const Model = require('../model/model');
const LoginModel = require('../model/loginModel');
const likedSongs = require('../model/likedSong');
const jwt = require("jsonwebtoken");


//Initialise
const router = express.Router();

//check token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401); // if there isn't any token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  }

//API endpoints


//add new user
router.post('/addNewUser', authenticateToken, async (req,res)=>{
    const data = new LoginModel({
        login: req.body.login,
        user: req.body.user,
        password: req.body.password
    });
    try {
        const storeData = await data.save();
        res.status(200).json(storeData);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

//Login
router.post('/login', async (req,res)=>{
    const userName = req.body.login;
    const password = req.body.password;
    try {
        const data = await LoginModel.findOne({login:userName,password:password});
        if(password == data.password){
                const token = jwt.sign({username:userName},process.env.ACCESS_TOKEN_SECRET);
                res.status(200).json({token:token});
            }else{
                res.status(401).json("Username or password incorrect.")
            }
            
    } catch (error) {
        res.status(500).json({error: error});
    }
});

//Get all users
router.get('/getAll', authenticateToken, async (req,res)=>{
    try {
        const data = await LoginModel.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get User by Login
// router.get('/getUserByLogin/:login', authenticateToken, async (req,res)=>{
//     try {
//         const data = await LoginModel.findById(req.params.login);
//         res.json(data);
//     } catch (error) {
//         res.status(404).json({message: error.message});
//     }
// });

//Get user by name(user)
router.get('/getByName/:user', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const data = await LoginModel.findOne({user});
        res.json(data);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

//Update User by id
router.patch('/updateUserBylogin/:login', authenticateToken, async (req,res)=>{
try {
    const id = req.params.login;
    const updateData = req.body;
    const options = {new: true};
    const result = await LoginModel.findByIdAndUpdate(id, updateData, options);
    res.send(result);
} catch (error) {
    res.status(400).json({message: error});
}
});

//Delete user by id(login)
router.delete('/deleteUserByLogin/:login', authenticateToken, async (req,res)=>{
    try {
        const id = req.params.login;
        const data = await LoginModel.findByIdAndDelete(login);
        res.send(`User with ${data.login} has been deleted.`);
    } catch (error) {
        res.status(400).json({message: error});
    }
    });

// add new liked song
router.post('/addNewSong', authenticateToken, async (req,res)=>{
    const songData = new likedSongs({
        name: req.body.name,
        user: req.body.user
    });
    try {
        const storeData = await songData.save();
        res.status(200).json(storeData);
    } catch{
        res.status(400).json({message: error.message});
    }
})

// Get all songs
router.get('/getAllSongs', authenticateToken, async (req,res)=>{
    try {
        const data = await likedSongs.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//update song
router.patch('/updateSongByName/:name', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const updateData = req.body;
        const options = {new: true};
        const result = await likedSongs.findByIdAndUpdate(id, updateData, options);
        res.send(result);
    } catch (error) {
        res.status(400).json({message: error});
    }
    });

// delete song by name

router.delete('/deleteSongByName/:name', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const data = await likedSongs.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted.`);
    } catch (error) {
        res.status(400).json({message: error});
    }
    });

module.exports = router;