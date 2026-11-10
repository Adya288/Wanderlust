if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
   
}
const express = require('express');
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync");
const ExpressError= require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");
const{isLoggedIn,isOwner} = require("../middleware");
const LocalStrategy = require("passport-local");
const listingController =require("../controllers/listings.js");

const multer = require("multer");
const {storage}= require("../cloudConfig");
const upload = multer({ storage });
// listing validation middleware
const validateListing =(req,res,next)=>{
let { error} =listingSchema.validate (req.body);

if (error){
    let errMsg= error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);

}else{
    next();
}};

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'), wrapAsync(listingController.createListing));

//New route
router.get("/new", isLoggedIn,wrapAsync(listingController.renderNewForm));

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

router.route("/:id")
.get( wrapAsync(listingController.showListings))
.put( 
    isLoggedIn,
    upload.single('listing[image]'), 
    validateListing,
     wrapAsync(listingController.updateListing)
    )
.delete( isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

//edit route
 router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.editListing));

module.exports = router;