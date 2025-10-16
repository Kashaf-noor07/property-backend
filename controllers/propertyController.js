
const Property = require("../models/property");
const path = require("path");
const fs = require("fs");


exports.addProperty = async (req, res) => {
  try {
    const images = req.uploadedImageUrls || [];

    const property = new Property({
      propertyname: req.body.propertyname,
      broker: req.body.broker,
      bathrooms: req.body.bathrooms,
      bedrooms: req.body.bedrooms,
      parking: req.body.parking,
      rent: req.body.rent,
      address: req.body.address,
      images,
      createdBy: req.user ? req.user.id : null,
    });

    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    console.error("Error in addProperty:", err);
    res.status(500).json({ error: err.message });
  }
};


// to get property to table
exports.getProperties=async(req,res)=>{
  try {
    const properties = await Property.find().populate("broker" , "broker");
    res.json(properties);
    
  } catch (err) {
    res.status(500).json({error : err.message});
  }
}

exports.deleteProperty = async (req, res) => {
  try {
    const {id}=req.params
    const property = await Property.findByIdAndDelete(id);
    if(!property){
     return res.status(404).json({message: "property not found"})
    }

    // the following if for deleting image from the folder upload
    if(property.images && property.images.length > 0){
      property.images.forEach((filename)=>{
      const filePath = path.join(__dirname , ".." , "upload" , filename)
      if(fs.existsSync(filePath)){
       fs.unlink(filePath , (err)=> {
        if (err){
          console.error("Failed to delete the image:" , err.message)
        }
       })
    }
      })
    }
    res.json({message :"Property deleted successfully"})
  } catch (err) {
    console.error("error in delete property", err)
    res.status(500).json({ error: err.message });
  }
};

//to get the existing property to form
exports.getProperty = async (req, res) => {
  try {
     const {id}=req.params
    const property = await Property.findById(req.params.id);
    if(!property){
      return res.status(404).json({message :"property not found"})
    };
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//to update the property
exports.updateProperty = async (req, res) => {
  try {
     const {id}=req.params;

    const property = await Property.findById(id);
    if(!property){
      return res.status(404).json({message :"property not found"})
    };
    //  if (property.createdBy && req.user && req.user.id && property.createdBy.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized to edit this property" });
    // }

    const removedImages = req.body.removedImages ? JSON.parse(req.body.removedImages) : [];
    if(removedImages.length  > 0){
      removedImages.forEach((img)=> {
        const filename = path.basename(img)
        const filepath = path.join(__dirname , ".." , "upload" , filename);
        if (fs.existsSync(filepath)){
          fs.unlinkSync(filepath)
        }
        property.images = property.images.filter((i) => i !== filename)
      })
    }
   
    const updates = {
      propertyname: req.body.propertyname,
      broker: req.body.broker,
      bathrooms: req.body.bathrooms,
      bedrooms: req.body.bedrooms,
      parking: req.body.parking,
      rent: req.body.rent,
      address: req.body.address,
     
      // i can include is rent status hre if wanna edit it
    };
 if (req.uploadedImageUrls && req.uploadedImageUrls.length > 0) {
  updates.images = [...property.images, ...req.uploadedImageUrls];
} else {
  updates.images = property.images;
}
    const updated = await Property.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    console.error("Error in Update property")
    res.status(500).json({ error: err.message });
  }
};

//toggel property on off
exports.togglePropertyStatus= async(req,res) =>{
      try {
        const property = await Property.findById(req.params.id)
        if(!property){
          res.status(404).json({message: "no property found"})
        }
        property.isrent = !property.isrent;
        await property.save();
        res.json({success : true , property})
        
      } catch (err) {
        console.error("Error in toggeling property")
        res.status(500).json({error : err.message})
      }
};

//to get the active property
exports.getActiveProperty = async(req,res) =>{
  try {
    const property = await Property.find({isrent: false}).select("propertyname rent images");
    res.json(property);
  } catch (err) {
    console.error("Error to get active property" , err)
        res.status(500).json({error : err.message})
    
  }
}
  









