const Joi = require("joi")

module.exports.stationValidate = function(req,res,next){
    const stationschema = Joi.object({
        name : Joi.string(), 
        price: Joi.number().min(0),
        description : Joi.string(), 
        location : Joi.string(), 
        fastcharging : Joi.boolean(),
        deleteImages : Joi.array()
    }).required()
    const {error} = stationschema.validate(req.body)
    if(error){
        const msg = error.details.map(x=>x.message).join(',')
        req.flash('error', msg)
        res.redirect('/stations/add')
    }
    else{
        next();
    }
}

module.exports.reviewValidate = function (req,res,next){
    const reviewschema =  Joi.object({
        
            comment : Joi.string().required(),
            rating : Joi.number().min(1)
        
    }).required()
    const rev = req.body.review
    const {error} = reviewschema.validate(rev)
    if(error){
        console.log(error)
        const msg = error.details.map(x=>x.message).join(',')
        req.flash('error', msg)
        res.redirect(`/stations/${req.params.id}`)
    }
    else{
        next();
    }

}
