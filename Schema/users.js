const mongoose=require("mongoose");
const tasks = require("./tasks");
const {Schema}=mongoose;

const userSchema=new Schema({
    userName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tasks:[{
        type:Schema.Types.ObjectId,
        ref:"Tasks"

    }]
})

const user=mongoose.model("user",userSchema);
// user.createIndexes();
module.exports=user;