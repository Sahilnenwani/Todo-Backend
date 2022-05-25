const mongoose=require("mongoose");

const mongooseURI="mongodb://localhost:27017/Todos";


const connectToMongo=()=>{
    mongoose.connect(mongooseURI,()=>{
     console.log("connected with the data base")   
    })
}

module.exports=connectToMongo;