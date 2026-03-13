const mongoose=require("mongoose")
async function connectDb() {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('connected to database');
    } catch (error) {
        console.log("database connection error"); 
    }
}

module.exports=connectDb;