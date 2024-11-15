const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const auth = require("./routes/auth")
const listening = require("./routes/Listening")
const bookingRoutes = require("./routes/Booking")
const userRoutes = require("./routes/user")
const path = require("path")
const upload = require("express-fileupload");

const { v2 : cloudinary } = require ("cloudinary");

require("dotenv").config()

app.use(cors({
    origin: process.env.FRONTEND_URL
}))
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Enable this for https
})
// this configuration is important when using cloudinary
app.use(upload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

/* This will serve files from the 'public/uploads' directory when requested at the '/uploads' URL path. */
// connect to mongo db
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("Monog DB Running")
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
})
.catch((err) => console.log("Error occured when connecting to mongoDB : "+err))

app.use('/public', express.static('public'))  
app.use('/auth', auth)  
app.use('/listening', listening)
app.use("/booking", bookingRoutes)
app.use("/users", userRoutes)

// Serve static files from the React/Vite app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))});