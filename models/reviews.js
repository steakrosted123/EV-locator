const mongoose = require('mongoose');

const review = new mongoose.Schema({
   
       comment:String,
       rating:Number,
       author:{type:mongoose.Schema.Types.ObjectId , ref:'User'}
    

    
})

module.exports = mongoose.model('Review',review);