const mongoose=require("mongoose");
const {Schema}=mongoose;

const tasksSchema=new Schema({
  
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})

const tasks=mongoose.model("Tasks",tasksSchema);
tasks.createIndexes();
module.exports=tasks;