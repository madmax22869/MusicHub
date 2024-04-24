//Bring necessary libraries
const express = require('express');
const Model = require('../model/model');
const LoginModel = require('../model/loginModel');
const jwt = require("jsonwebtoken");

//Initialise
const router = express.Router();

//Helpers
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
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
    const userName = req.body.username;
    const password = req.body.password;
    try {
        const data = await LoginModel.findOne({userName});
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


//Post
router.post('/post', authenticateToken, async (req,res)=>{
    const data = new Model({
        name: req.body.name,
        atomic: req.body.atomic,
        chem: req.body.chem,
        weight: req.body.weight,
        notes: req.body.notes
    });
    try {
        const storeData = await data.save();
        res.status(200).json(storeData);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

//Get all
router.get('/getAll', authenticateToken, async (req,res)=>{
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get by id
router.get('/getById/:id', authenticateToken, async (req,res)=>{
    try {
        const data = await Model.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//Get by name
router.get('/getByName/:name', authenticateToken, async (req,res)=>{
    try {
        const name = req.params.name;
        const data = await Model.findOne({name});
        res.json(data);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

//Update by id
router.patch('/updateById/:id', authenticateToken, async (req,res)=>{
try {
    const id = req.params.id;
    const updateData = req.body;
    const options = {new: true};
    const result = await Model.findByIdAndUpdate(id, updateData, options);
    res.send(result);
} catch (error) {
    res.status(400).json({message: error});
}
});

//Delete by id
router.delete('/deleteById/:id', authenticateToken, async (req,res)=>{
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted.`);
    } catch (error) {
        res.status(400).json({message: error});
    }
    });

module.exports = router;