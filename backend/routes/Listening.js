const router = require("express").Router()
const Listening = require("../models/Listening")
const User = require("../models/User")
// const upload = require("../config/multer")
const { v2 : cloudinary } = require ("cloudinary");

router.post("/create-listening", async(req, res) => {
    try {
            /* Take the information from the form */
    const { userId, category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount,
            bedCount, bathroomCount, amenities, title, description, highlight, highlightDesc, price} = req.body;
  
      const {listeningPhotos} = req.files
      if (!listeningPhotos) return res.status(400).send("No files uploaded.")
      let listingPhotoPaths = []
      try {
        await Promise.all(listeningPhotos.map(async (file) => {
          try {
            // Upload new image
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
              folder: 'Home_Rentals_Images' // Optional: organize images in folders
            });
            if (!result.secure_url) {
              return res.status(400).json({ message: "Failed to upload image" });
            }
            listingPhotoPaths.push(result.secure_url);
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
          }
        }));
      } catch (error) {
        console.error('Error uploading photos:', error);
        return res.status(500).json({ message: "Error uploading photos", error: error.message });
      }
      
      const user = await User.findById(userId).lean()
      if(!user) return res.status(400).send('invalid user')

      const newListing = new Listening({
            creator: userId, category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount,
            bedCount, bathroomCount, amenities, listingPhotoPaths, title, description, highlight, highlightDesc, price
      })
  
      const createListening = await Listening.create(newListing)
      if(createListening) return res.status(200).json({createListening})
      else res.status(400).json({message : "unable to create the listening"})
      
    } catch (error) {
        console.error(error)
    }
})

/* GET lISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
    const {category} = req.query
  
    try {
      let listings
      if (category) {
        /* replace the creator field in Listening document with the full User document
        based on ObjectId */
        listings = await Listening.find({ category }).populate("creator")
      } else {
        listings = await Listening.find().populate("creator")
      }
  
      res.status(200).json({listings})
    } catch (err) {
      res.status(404).json({ message: "Fail to fetch listings", error: err.message })
      console.log(err)
    }
})

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listening.find().populate("creator")
    } else {
      listings = await Listening.find({
        $or: [
          /* applying a regular expression case-insensitive search */
          { category: {$regex: search, $options: "i" } },
          { title: {$regex: search, $options: "i" } },
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listening.findById(listingId).populate("creator")
    res.status(200).json(listing)
  } catch (err) {
    res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
})
module.exports = router