const mongoose = require('mongoose');
const station = require('../models/station')
const reviews = require('../models/reviews')
const {name,description,fastcharge,geo} = require('./seedhelper');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/Ev-station')
  .then(()=>{
    console.log("Mongo connected")
  })
  .catch(err =>{
    console.log("Error")
  })

const seed = async () =>{
    await station.deleteMany({});
    await reviews.deleteMany({});
    for(let i=0;i<100;i++){
       let x = geo[[Math.floor(Math.random() * 50)]]
        const sta = new station({
            author:'640df302a4626651bf6ce37a',
            name:`${name[Math.floor(Math.random() * 100)]}`,
            description:`${description[Math.floor(Math.random() * 9)]}`,
            location:x.city,
            fastcharging:`${fastcharge[Math.floor(Math.random() * 1)]}`,
            geometry: {
               type: 'Point', 
               coordinates: [ 
                  x.longitude,
                  x.latitude
              ] 
              
            },
            images: [
              {
                url: 'https://res.cloudinary.com/dngiii3ow/image/upload/v1679203509/EVGrounds/vv2kwf9gi8ljppjcl6yo.jpg',
                filename: 'EVGrounds/vv2kwf9gi8ljppjcl6yo',
                
              },
              {
                url: 'https://res.cloudinary.com/dngiii3ow/image/upload/v1679203512/EVGrounds/om9fcpfnqzj9jcfi6pzi.jpg',
                filename: 'EVGrounds/om9fcpfnqzj9jcfi6pzi',
                
              }
            ],
        
            price:`${Math.floor(Math.random()*500-100+1)+100}`
        })
        await sta.save();
    }
}


seed()
  .then(()=>{
    console.log("Data Seeded");
    mongoose.connection.close();
  })
  .catch(err=>{
    console.log(err);
  })