
const Broker = require('../models/broker')

exports.addBrokers = async(req,res)=>{
    try{
      // console.log("Saving broker with:", req.body, "createdBy:", req.user , "address:" , req.body );

        const broker = new Broker({
        broker: req.body.broker,
        // propertyname  : req.body.propertyname,
        // address : req.body.address,
        createdBy: req.user ? req.user.id : null,
    });
    const savedBroker = await broker.save();
     res.status(201).json(savedBroker);
    }
    catch(err){

  console.error("Error in addBroker:", err); 
  res.status(500).json({ error: err.message });
    }
}

// Get all brokers
exports.getBrokers = async (req, res) => {
  try {
    const brokers = await Broker.find().populate("createdBy", "email");
    res.status(200).json(brokers);
  } catch (err) {
    console.error("Error in getBrokers:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteBrokers =async(req,res)=>{
  try{
    const broker = await Broker.findByIdAndDelete(req.params.id)
    if(!broker){
      return res.status(404).json("No Broker found");
    }
    
    res.status(200).json("Brokers deleted successfully")
  }
  catch(err){
    console.error("Error in deleting brokers:", err);
    res.status(500).json({ error: err.message });
  }
}


//to update the broker
exports.updateBrokers = async(req ,res)=>{
  try {
    const {broker} = req.body ; 

    //find and update broker
    const updateBroker = await Broker.findByIdAndUpdate(req.params.id , {broker} , { new: true, runValidators: true })
    if (!updateBroker){
      return res.status(404).json("No broker found to update")
    };
    if (broker.createdBy && req.user && req.user.id && updateBroker.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this broker" });}

    res.status(200).json(updateBroker);
    
  } catch (err) {
    console.error("Error in updating broker", err);
    res.status(500).json({error : err.message})
  }
}
// to get brokers to the the update form
exports.getBroker  = async (req, res) =>{
  try{
    const broker =await Broker.findById(req.params.id);
    if(!broker){
       return res.status(404).json("No Broker found");
    }
    res.status(200).json({broker : broker.broker})
  }
  catch (err){
    console.error("Error in fetching broker to update form", err)
    res.status(500).json({error :  err.message})
  }

}

// on off brokers
exports.toggleBrokerStatus= async(req,res)=>{
try {
  const broker = await Broker.findById(req.params.id);
  if(!broker){
    return res.status(404).json("No broker found");
  }
  broker.isActive = !broker.isActive
  await broker.save();
  res.json({success: true,broker})
  
} catch (err) {
  console.error("Error in toggleBrokerStatus" , err)
  res.status(500).json({error : err.message})
}
}


// to get the active broker name to the property form
exports.getActiveBrokers= async(req,res)=>{
  try {
    const brokers = await Broker.find({isActive:true}).select("broker")
res.json(brokers)
  } catch (err) {
    console.error("Errorn in getActive brokers" , err)
    res.status(500).json({error : err.message})
  }
}