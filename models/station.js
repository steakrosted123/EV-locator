const mongoose = require('mongoose');
const Review  = require('./reviews');


const opts = {toJSON : {virtuals:true}};
const Schema = mongoose.Schema;

const Imageschema = new Schema({
    url : String,
    filename : String
})

Imageschema.virtual('thumbnail').get(function() { 
    return this.url.replace('upload','/upload/w_100')
})

const station = new Schema({
    name:String,
        
    description:String,
    images:[Imageschema],
    geometry :{
        type: {
            type : String,
            enum : ['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    location:String,
    fastcharging:Boolean,
    author: {type:mongoose.Schema.Types.ObjectId , ref:'User'},
        
    review:[
        {type:mongoose.Schema.Types.ObjectId , ref:'Review'}
    ]
},opts);

station.virtual('properties.popUpMarkup').get(function (){
    return `<strong><a href="/stations/${this._id}">${this.name}</a></strong>`
})

station.post('findOneAndDelete',async function (doc) {
    if (doc){
        await Review.deleteMany({
            _id : {
                $in : doc.review
            }
        })
    }
})


module.exports = mongoose.model('Station',station)


