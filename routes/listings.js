const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js")

const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


const listingController = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.route("/")
.get(wrapAsync(listingController.index))          //index route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))  //create route

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
.get( wrapAsync(listingController.showListing))    //show route
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))  //update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));   //delete route

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;



















// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
// const Listing = require("../models/listing.js");
// const {isLoggedIn} = require("../middleware.js")

// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// router.get("/", wrapAsync(async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }));

// //New Route
// router.get("/new",isLoggedIn,(req,res) => {
//   console.log((req.user))
//   if(!req.isAuthenticated()){
//     req.flash("error" , "you must be logged in to create listing");
//     return res.redirect("/login")
//   }
// })
// router.get("/new", (req, res) => {
//   res.render("listings/new.ejs");        // no async, no wrapAsync needed
// });

// //Show Route
// // router.get("/:id", wrapAsync(async (req, res) => {
// //   let { id } = req.params;
// //   const listing = await Listing.findById(id).populate("reviews");
// //   if(!listing){
// //     req.flash("error", "Listing you requested for does not exist!");
// //     res.redirect("/listings")
// //   }
// //   res.render("listings/show.ejs", { listing });
// // }));

// // Show Route
// router.get("/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;

//     const listing = await Listing.findById(id).populate("reviews");

//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         return res.redirect("/listings");
//     }

//     res.render("listings/show.ejs", { listing });
// }));
// //Create Route
// router.post("/",isLoggedIn,validateListing ,wrapAsync(async (req, res, next) => {
 
//   let result = listingSchema.validate(req.body); //joi

//   if(result.error){
//     throw new ExpressError(400,result.error)
//   }
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   req.flash("success", "New Listing Created!")
//   res.redirect("/listings");
// }));

// //Edit Route
// router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", { listing });
// }));

// //Update Route
// router.put("/:id",isLoggedIn,validateListing, wrapAsync(async (req, res) => {
  
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   req.flash("success", "Listing Updated" )
//   res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
//   req.flash("success", "Listing Deleted!")
//   res.redirect("/listings");
// }));

// module.exports = router;
