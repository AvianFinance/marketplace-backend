const mongoose = require("mongoose");

const RentalSchema = mongoose.Schema({
    seller: {
        type:String,
        required:true
    },
    nftaddress:{
        type:String,
        required:true
    },
    price: {
        type:String,
        required:true
    },
    tokenId: {
        type:String,
        required:true
    },
    createdOn: {
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Rental", RentalSchema);

