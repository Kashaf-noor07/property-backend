const mongoose = require("mongoose")

const brokerSchema = new mongoose.Schema(
    {
         broker: { type: String, required: true, trim: true },
      //    propertyname: {type:mongoose.Schema.Types.ObjectId , ref :"Property", require: true},
      //    address : {type: mongoose.Schema.Types.ObjectId, ref: "Property", require:true},
         isActive : {type: Boolean, default:true},
          createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true, },

    },
      { timestamps: true }
);
module.exports = mongoose.model("Broker", brokerSchema);