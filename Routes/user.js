const express = require("express");
const router = express.Router();
// const path=require("path");
const bcrypt = require('bcryptjs')
const user = require("../Schema/users");
const jwt = require('jsonwebtoken');
const JWT_Secret="mysecretvalue";
const JWT_Secret_Refresh="refrehtokenmysecretvalue";
const verifyJWT =require('./verifyJWT')
// let arr=[
// {
//     userName:"Sahil Nenwani",
//     Email:"sn@gmail.com",
//     password:12345678
// },
// {
//     userName:"Hassan Noor",
//     Email:"hassan@gmail.com",
//     password:12345678
// }
// ];


router.get("/", verifyJWT,(req, res) => {
    let userssData = user.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(data);
        }
    })
})

router.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    const User = await user.findOne({ userName }).lean();

    if (!user) {
        return res.json({ status: "error", error: "invalid username/password" });
    }

    if (await bcrypt.compare(password, User.password)) {

        const token = jwt.sign({ id: User._id, username: User.userName, },JWT_Secret,{expiresIn: '60s'})
        const refreshToken=jwt.sign({ id: User._id, username: User.userName },JWT_Secret_Refresh,{expiresIn: '1d'})
        res.cookie('jwt',refreshToken,{httpOnly:true, maxAge:24*60*60*1000 })
        res.json({ status: 'ok', accessToken: token })
    }
})

router.post("/register", async (req, res) => {
    const { userName, Email, password } = req.body;

    if (!req.body.userName && !req.body.password) {
        return res.status(400).send({
            message: "Note userName can not be empty"
        });
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const userData = {
        userName,
        Email,
        password: passwordHash
    }
    try {
        const responce = await user.create(userData);
        res.json(responce);
    } catch (error) {
        console.log(error);
    }
    // const userFromDatabase=new user(userData);
    // const saveUsers=await userFromDatabase.save();

})


router.delete("/dUser/:userId", async (req, res) => {

    let afDeleteData = await user.findByIdAndDelete(req.params.userId);
    res.json({ "sucess": "successfuly deleted" });


    // arr=arr.filter((user)=>{

    //    return user.userName != req.body.userName;
    // })
    // res.send("user deleted successfuly");
    // res.send(req.userName);
})
module.exports = router;
