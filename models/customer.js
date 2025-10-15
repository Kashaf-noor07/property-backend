const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema(
    {
        customer : {
             name: {type : String , required: true},
       email: {type : String , required: true},
        phonenumber: {type : Number , required: true},
        address: {type : String , required: true},
        },
         
        contract:{
            startDate:{type: Date , required: true},
            endDate:{type: Date , required: true},
        },
        property:{
            type : mongoose.Schema.Types.ObjectId , ref : "Property" , required: true
        },
        rent: {type: Number , required:true},
        gallery:{type: String},
        paymentStatus :{type: String , enum:["pending" , "paid" , "failed" ] , default:"pending"},
        paymentId : {type:String},
        createdby: {type: mongoose.Schema.ObjectId , ref : "User" , required: true}
    },

      { timestamps: true }
);
module.exports = mongoose.model("Customer", customerSchema);