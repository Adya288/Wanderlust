const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync");
const ExpressError= require("../utils/ExpressError");
const { reviewSchema} = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");
const{isLoggedIn,isReviewAuthor} = require("../middleware");
const reviewController= require ("../controllers/review.js");


//validate review
const validateReview =(req,res,next)=>{
let { error} =reviewSchema.validate (req.body);

if (error){
    let errMsg= error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);

}else{
    next();
}};



//review post route
router.post("/",isLoggedIn
    ,validateReview ,
    isLoggedIn,
    wrapAsync(reviewController.postReview)
);

//delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;
