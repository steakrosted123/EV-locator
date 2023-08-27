
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate')
const AppError = require('./error');
const methodOverride = require('method-override');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
const EVstation = require('./routes/stations');
const EVreview = require('./routes/review');
const EVuser = require('./routes/user');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash');
const User = require('./models/user')
const Joi = require('joi')


const session = require('express-session');
const { merge } = require('./routes/stations');
const sessionConfig = {
  secret : 'x',
  resave : false,
  saveUninitialized : true,
  cookie : {
    maxAge : 1000 * 60 * 60 * 24 * 7 
  }
}
app.use(session(sessionConfig))

app.use(flash())

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/Ev-station')
.then(()=>{
  console.log("Mongo connected")
})
.catch(err =>{
  console.log("Error")
})
app.engine('ejs',ejsmate); 
app.set('view engine','ejs');
app.listen('3000' , ()=>console.log('listening on port 3000'));

app.use(passport.session())
app.use(passport.initialize())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




app.use((req,res,next)=>{
  
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})
app.use('/reviews',EVreview)
app.use('/stations',EVstation)
app.use('/user',EVuser)
app.use(express.static('public'))
  
 
app.get('/' ,(req,res)=>{
    res.render('home')
})

app.use((err,req,res,next)=>{
  const {status = 404,message='Error'}  = err;
  res.status(status).render('errordis',{err});
})