const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index= async( req , res) =>{
const allListings= await Listing.find({});
        res.render("listings/index.ejs",{allListings})
    };
module.exports.renderNewForm=async (req,res) =>{
     res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res) =>{
   const {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:
        {path: "author"}})
        .populate("owner");
    if(!listing){
       req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    };
   
   res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res, next) => {
   let response = await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1
    })
    .send();

   
    let url= req.file.path;
    let filename= req.file.filename;
    console.log(url,"..",filename);
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id; 
       newlisting.image={url,filename};
       newlisting.geometry = response.body.features[0].geometry;
       let savedListing= await newlisting.save();
        console.log("Saved Listing:", savedListing);
        req.flash("success", "Successfully added a new listing!");
        res.redirect("/listings");
    };

    module.exports.editListing = async (req,res) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
           req.flash("error", "Listing not found!");a
            return res.redirect("/listings");
        };
        res.render("listings/edit.ejs",{listing});
    };
   
    module.exports.renderEditForm = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload/", '/upload/w_300,h_200,c_fill/');
        console.log("Original Image URL:", originalImageUrl);
        res.render("listings/edit.ejs", { listing, originalImageUrl });
        };

    module.exports.updateListing =  async (req, res) => {
    const { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
     if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }
    if (!req.body.listing.image?.url) {
        req.body.listing.image = listing.image;
    }
    await Listing.findByIdAndUpdate(id, req.body.listing);
     req.flash("success", "Listing updated successfully!");
    return res.redirect(`/listings/${id}`);
};

    module.exports.destroyListing = async(req,res) =>{
        let {id} = req.params;
        let deletedListing=await Listing.findByIdAndDelete(id);
        console.log("Deleted Listing:", deletedListing);
         req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    };