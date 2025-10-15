const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyname: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    parking: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId,ref :"Broker",required:true},
    rent: { type: Number, required: true,},
    isrent: {type: Boolean, default: false, },
    images :{type:[String] , required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true, },},
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
