const router = require("express").Router()
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const User = require('../models/User')
const { v2 : cloudinary } = require ("cloudinary");

// const upload = require('../config/multer')
/* const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/"); // Store the files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    },
  });

const upload = multer({ storage}) */

router.post("/register", async(req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body
        const { profileImage } = req.files;
        if(!firstName || !lastName || !email || !password || !profileImage) 
            return res.status(400).send('All Fields are Required')

        // const profileImagePath = profileImage.path
        console.log({firstName, lastName, email, password})
        console.log(profileImage.name)
        const userExist = await User.findOne({ email }).exec()
        if(userExist) return res.status(409).json({message : 'Duplicate User, User already exist'})
    
        const hashedPassword = await bcrypt.hash(password, 10)
        /* respect the same format as you create the user model */
        /* Home_Rentals_Images */
        let profileImagePath = ''
        try {
          // Upload new image
          const result = await cloudinary.uploader.upload(profileImage.tempFilePath, {
              folder: 'Home_Rentals_Images' // Optional: organize images in folders
          });

          if (!result.secure_url) {
              return res.status(400).json({ message: "Failed to upload image" });
          }

         profileImagePath = result.secure_url;

        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
        }

        const user = new User({ firstName, lastName, email, password: hashedPassword, profileImage: profileImagePath})
        console.log(user)

        const newUser = await User.create(user)
        if(newUser) res.status(200).send({message: "User registered successfully", user: newUser})
        else res.status(400).json({message: "Unable to register the user"})
    
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body
  
      const user = await User.findOne({ email }).lean()
      if (!user) {
        return res.status(409).json({ message: "User doesn't exist!" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials!"})
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "1d"})
      /* we need an object to delete the user's password
      we already the user we get to an object using lean() or we use user.toObject(); */
      delete user.password
      /* the result format: "token": token, "user": user */
      res.status(200).json({ token, user })

  
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message })
    }
  })

module.exports = router