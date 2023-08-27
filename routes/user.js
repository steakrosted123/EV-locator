const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user')

router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.post('/signup',async (req,res)=>{
    try{

        const {email,username,password} =req.body;
        const user = new User({email,username})
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err) return next(err)
            req.flash('success','registered and logged in')
            res.redirect('/stations/view')
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/user/signup')
    }
        
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true , failureRedirect:'/user/login'}),(req,res)=>{
    req.flash('success','Logged in')
    
    res.redirect('/stations/view')
} )

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Logged out')
    
      res.redirect('/stations/view')
      
    });
});

module.exports = router;