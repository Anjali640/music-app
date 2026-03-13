const app= require("./src/app")
require('dotenv').config()
const connectDb=require("./src/db/db")

connectDb()
app.listen(2000,()=>{
    console.log("server is running on port 2000");
})