const {Schema, model} = require("mongoose")

const userSchame = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    tripList: {
        /* In JavaScript, you don't need to specify the type of array elements when defining an array. */
        type: Array,
        default: []
    },
    wishList: {
        type: Array,
        default: []
    },
    reservationList: {
        type: Array,
        default: []
    },
    propertyList: {
        type: Array,
        default: []
    }
}, {timestamps: true})

const User = model('User', userSchame)
module.exports = User