const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    // customer id who book the property
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // host id who own the property
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // property id
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listening",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema)
module.exports = Booking