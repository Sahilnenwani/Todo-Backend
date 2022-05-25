const express=require("express");
const router=express.Router();
const tasks=require("../Schema/tasks");

// let tasks=[
// {
//     id:1,
//     title:"demy data1",
//     content:"xyz"
// },{
//     id:2,
//     title:"demy data2",
//     content:"xyz"
// }
// ];


router.get("/",(req,res)=>{
  let tasksData=tasks.find({},(err,data)=>{
      if (err) {
          console.log(err);
      }
      else{
          res.json(data);
      }
  })
})


router.post("/cTask",async (req,res)=>{
    if(!req.body.content){
        return res.status(400).send({
            message: "Note userName can not be empty"
        });
    }

    const taskData={
        title:req.body.title,
        content:req.body.content,
    }
    const todoTasks=new tasks(taskData);
    const saveTasks=await todoTasks.save();
    
    res.json(saveTasks);
})


router.delete("/dTask/:taskid",async(req,res)=>{
    
    let afDeleteData=await tasks.findByIdAndDelete(req.params.taskid);
    res.json({"sucess":"successfuly deleted"});


    // tasks=tasks.filter((task)=>{
    //     console.log("task id arr",task.id)   
    //    return task.id != req.params.taskid
    // })
    // console.log("task id",req.params.taskid)

//    console.log(tasks)
// console.log(req.title)

//     tasks=tasks.filter((task)=>{
//        return task.title !== req.title;
//     })
//    console.log(tasks)

    
})


module.exports=router;
