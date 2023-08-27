const express = require('express');
const router = express.Router();
const station = require('../models/station');
const review = require('../models/reviews');
const {isLoggedIn} = require('../middleware');

const {reviewValidate} = require('../joivalidation');



router.post('/stations/:id',reviewValidate, isLoggedIn, async (req,res)=>{
    const sta = await station.findById(req.params.id)
    const rev = new review(req.body.review);
    rev.author = req.user._id
    sta.review.push(rev);
    await sta.save();
    await rev.save();
    res.redirect(`/stations/${sta.id}`)
})

router.delete('/stations/:staid/:revid', async (req,res)=>{
  const {staid,revid} = req.params;
  const rev = await review.findById(revid);
  if(!rev.author.equals(req.user._id)){
    req.flash('error','You dont have permission to delete this review')
    return res.redirect(`/stations/${staid}`)
  }
  await review.findByIdAndDelete(revid);
  await station.findByIdAndUpdate(staid,{$pull:{review:revid}})
  req.flash('success' , 'deleted a review')

  res.redirect(`/stations/${staid}`);
})

module.exports = router;