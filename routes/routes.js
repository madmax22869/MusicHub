//Bring necessary libraries
const express = require('express');
const Model = require('../model/model');

//Initialise
const router = express.Router();

//API endpoints
//Post
router.post('/post', async (req,res)=>{
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
router.get('/getAll', async (req,res)=>{
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get by id
router.get('/getById/:id', async (req,res)=>{
    try {
        const data = await Model.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

//Get by name
router.get('/getByName/:name', async (req,res)=>{
    try {
        const name = req.params.name;
        const data = await Model.findOne({name});
        res.json(data);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})

//Update by id
router.patch('/updateById/:id', async (req,res)=>{
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
router.delete('/deleteById/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);
        res.send(`Document with ${data.name} has been deleted.`);
    } catch (error) {
        res.status(400).json({message: error});
    }
    });

module.exports = router;