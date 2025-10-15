const mongoose =require ("mongoose");


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,});
      console.log("✅MongoDb Connected successfully")
    }
    catch(err){
     console.error("❌ MongoDB connection failed", err);
    process.exit(1);
    }
}
module.exports= connectDB;