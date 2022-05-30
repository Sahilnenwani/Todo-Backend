const express = require("express");
const router = express.Router();
const taskSchema = require("../Schema/tasks");
const user = require("../Schema/users");

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

router.get("/", (req, res) => {
  let tasksData = taskSchema.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

router.post("/cTask/:userID", async (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note userName can not be empty",
    });
  }

  const taskData = {
    title: req.body.title,
    content: req.body.content,
  };
  const todoTasks = new taskSchema(taskData);
  const saveTasks = await todoTasks.save();

  const usersData = await user.findById(req.params.userID);

  // const tasks = [
  //   ...usersData.tasks,
  //   {
  //     taskid: saveTasks._id,
  //   },
  // ];

  const updateuser =  user.findByIdAndUpdate(
    req.params.userID,
    {
      tasks: [
        ...usersData.tasks,
        saveTasks._id,
]},
    (err) => {
      if (err) return res.sendStatus(500);
    }
  );

  // console.log(usersData);
  // console.log(saveTasks._id);

  res.json(saveTasks);
});

router.delete("/dTask/:taskid", async (req, res) => {
  let afDeleteData = await taskSchema.findByIdAndDelete(req.params.taskid);
  res.json({ sucess: "successfuly deleted" });

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
});

module.exports = router;
