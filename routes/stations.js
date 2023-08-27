const express = require('express');
const router = express.Router();
const station = require('../models/station');
const {isLoggedIn} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})
const {stationValidate} = require('../joivalidation');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken:mapBoxToken})
const {cloudinary} = require("../cloudinary")

router.get('/view' , async (req,res)=>{
    const stations = await station.find({});
    res.render('viewstations',{stations})
})

router.get('/add', isLoggedIn ,(req,res)=>{
  res.render('add')
})

router.post('/addnew',upload.array('image'),stationValidate,isLoggedIn,async (req,res)=>{
  
    const geoData = await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send()
    const sta = new station(req.body);
    sta.geometry = geoData.body.features[0].geometry
    sta.images = req.files.map( f=>({url:f.path,filename:f.filename}) )
    sta.author = req.user._id
    await sta.save();
    req.flash('success' , 'Added a station')
    res.redirect('/stations/view');
    
    

})

router.get('/:id', isLoggedIn ,async (req,res,next)=>{
  
    const sta = await station.findById(req.params.id).populate({path:'review',populate:{path:'author'}}).populate('author')
    res.render('details',{sta});
})
  
  
  
router.get('/:id/edit' ,async (req,res)=>{
  const sta = await station.findById(req.params.id)
  if(!sta.author.equals(req.user._id)){
    req.flash('error','You dont have permission to do that')
    return res.redirect(`/stations/${sta._id}`)
  }
  res.render('edit',{sta})
})

router.delete('/:id/delete',isLoggedIn,async (req,res)=>{
    const sta = await station.findById(req.params.id)

    if(!sta.author.equals(req.user._id)){
      req.flash('error','You dont have permission to do that')
      return res.redirect(`/stations/${sta._id}`)
    } 
    await station.findByIdAndDelete(req.params.id);
    req.flash('success' , 'deleted a station')
    res.redirect('/stations/view');
})

router.put('/:id' ,upload.array('image'),stationValidate,async (req,res)=>{

    const sta = await station.findById(req.params.id)
    if(!sta.author.equals(req.user._id)){
      req.flash('error','You dont have permission to do that')
      return res.redirect('/stations/view')
    }

    await station.findByIdAndUpdate(req.params.id , {...req.body})
    
    const images = req.files.map( f => ({url:f.path,filename:f.filename}))
    sta.images.push(...images)

    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
      }
      await sta.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }

    await sta.save();
    req.flash('success' , 'updated a station')

    res.redirect(`/stations/${sta._id}`);
})





module.exports = router;
  
    
    

    
   
      