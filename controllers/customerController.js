const customer = require("../models/customer");
const Customer = require("../models/customer");
const Property = require("../models/property");


exports.addRentCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phonenumber,
      address,
      startDate,
      endDate,
      selectedProperty,
      rent,
      gallery,
       paymentStatus,
      paymentId,
    } = req.body;

    
    const property = await Property.findById(selectedProperty);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (property.isrent) {
      return res.status(400).json({ message: "Property already rented" });
    }
   
    const newRent = new Customer({
      customer: { name, email, phonenumber, address }, 
      contract: { startDate, endDate },
      property: property._id,
      rent,
      gallery,
      paymentStatus,
      paymentId,
      createdby: req.user ? req.user.id : null, 
    });

    await newRent.save();
    property.isrent = true;
    await property.save();

    res.status(200).json({ success: true, rent: newRent });
   
  } catch (err) {
   console.error("error renting property:", err.response?.data || err);

    res.status(500).json({ error: err.message });
  }
};


exports.getAvailableProperties = async (req, res) => {
  try {
    const today = new Date();
today.setHours(0 , 0, 0, 0); 

const activeRents = await Customer.find({
  "contract.endDate": { $gte: today } 
}).select("property");


    const rentedPropertyIds = activeRents.map(r => r.property);

   
    await Property.updateMany(
      { _id: { $nin: rentedPropertyIds } },
      { $set: { isrent: true } }
    );
    await Property.updateMany(
      { _id: { $nin: rentedPropertyIds } },
      { $set: { isrent: false } }
    );
    const availableProperties = await Property.find();
    res.json(availableProperties);
  } catch (err) {
    console.error("Error in fetching available properties:", err);
    res.status(500).json({ error: err.message });
  }
};

// exports.getRentedProperties = async (req, res) => {
//   try {
//     const today = new Date();
    
//     today.setHours(0, 0, 0, 0);

//     const rentedList = await Customer.find()
//      .populate("property", "propertyname rent")
//    
//       .sort({ createdAt: -1 });

//     const result = rentedList.map((item) => {
 
//       const endDate = item.contract?.endDate ? new Date(item.contract.endDate) : null;
//       let contractStatus = "active";

//       if (endDate) {
      
//         endDate.setHours(0, 0, 0, 0);

//         // Only mark as ended if today is strictly after the end date
//         if (today > endDate) {
//           contractStatus = "ended";
//         }
//       }

//       return {
//         ...item.toObject(),
//         contractStatus,
//       };
//     });

//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error in fetching rented properties", err);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getRentedProperties = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userId = req.user.id; 
    const userRole = req.user.role;

    let filter = {};
    if (userRole === "user") {
      filter = { createdby : userId }; 
    }

    const rentedList = await Customer.find(filter)
      .populate("property", "propertyname rent")
      .sort({ createdAt: -1 });

    const result = rentedList.map((item) => {
      const endDate = item.contract?.endDate ? new Date(item.contract.endDate) : null;
      let contractStatus = "active";
      if (endDate) {
        endDate.setHours(0, 0, 0, 0);
        if (today > endDate) contractStatus = "ended";
      }

      return {
        _id: item._id,
        property: item.property,
        rent: item.rent,
        customer: item.customer,
        contract: item.contract,
        paymentStatus: item.paymentStatus,
        contractStatus,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in fetching rented properties", err);
    res.status(500).json({ error: err.message });
  }
};




