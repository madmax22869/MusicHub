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


//Login
router.post('/login', async (req,res)=>{
    const userName = req.body.login;
    const password = req.body.password;
    try {
        const data = await LoginModel.findOne({login:userName});
        if(password == data.password){
                const token = jwt.sign({username:userName},process.env.ACCESS_TOKEN_SECRET);
                res.status(200).json({token:token});
            }else{
                res.status(401).json("Username or password incorrect.")
            }
            
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//Get all users
router.get('/getAllUsers', authenticateToken, async (req,res)=>{
    try {
        const data = await LoginModel.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get user by name(user)
router.get('/getUserByName/:user', authenticateToken, async (req,res)=>{
    try {
        const user = req.params.user;
        const data = await LoginModel.findOne({user:user});
        if(data == null)         
            res.status(404).json({message: "Not found"});
        else
            res.json(data);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

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

//Update User by id
router.patch('/updateUserBylogin/:login', authenticateToken, async (req,res)=>{
try {
    const login = req.params.login;
    const updateData = req.body;
    const options = {new: true};
    const data = await LoginModel.findOneAndUpdate({login:login}, updateData, options);
    if(data == null)         
        res.status(404).json({message: "Not found"});
    else
        res.send(data);
} catch (error) {
    res.status(400).json({message: error.message});
}
});

//Delete user by id(login)
router.delete('/deleteUserByLogin/:login', authenticateToken, async (req,res)=>{
    try {
        const login = req.params.login;
        const data = await LoginModel.findOneAndDelete({login:login});
        if(data == null)         
            res.status(404).json({message: "Not found"});
        else
            res.send(`User with ${data.login} has been deleted.`);
    } catch (error) {
        res.status(400).json({message: error.message});
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

//Get song by name
router.get('/getSongsByName/:name', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const data = await likedSongs.find({name:name});
        res.json(data);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    });


//update song
router.patch('/updateSongByName/:name/:user', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const user = req.params.user;
        const updateData = req.body;
        const options = {new: true};
        const data = await likedSongs.findOneAndUpdate({name:name,user:user}, updateData, options);
        if(data == null)         
            res.status(404).json({message: "Not found"});
        else
            res.send(data);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    });

// delete song by name

router.delete('/deleteSongByName/:name/:user', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const user = req.params.user;
        const data = await likedSongs.findOneAndDelete({name:name,user:user});
        if(data == null)         
            res.status(404).json({message: "Not found"});
        else
            res.send(`Document with ${data.name} for ${data.user} has been deleted.`);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    });

module.exports = router;