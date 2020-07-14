const express =require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex =require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db=knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'mypostgre',
    database : 'smartbrain'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// })	

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req,res)=> {res.send('It is working')})
app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)})
app.post('/register',(req,res) =>{register.handleRegister(req,res,db,bcrypt)})
app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req,res,db)})
app.put('/facerecognition', (req,res) => {image.handleImageRecognition(req,res,db)})
app.post('/imageUrl', (req,res) => {image.handleApiCall(req,res,db)})

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})