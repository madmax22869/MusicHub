require('dotenv').config();
const {error} = require('console');

const express = require('express');
const mongoose = require('mongoose');
const mongoStr = process.env.DATABASE_URL;
const routes = require('./routes/routes');

mongoose.connect(mongoStr);
const db = mongoose.connection;

db.on('error', (error) =>{
    console.log(error);
});

db.once('connected', ()=>{
    console.log('DB connected.')
});

const app = express();

app.use(express.json());

app.use('/api', routes);

app.listen(3000, ()=>{
    console.log('Server started')
});