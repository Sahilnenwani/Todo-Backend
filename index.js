const connectToMongo=require("./db")
const express= require("express");
const app= express();
const cookie_parser=require('cookie-parser')
const Port=5000 || process.env.Port

connectToMongo();
app.use(express.json());
app.use(cookie_parser())
app.get("/",(req,res)=>{
        res.send("Express working");
})


app.use("/user", require("./Routes/user"));
app.use("/tasks", require("./Routes/tasks"));
app.use("/token",require("./Routes/refreshtokenRoute"))

app.listen(Port,()=>{
    console.log("server is started");
});