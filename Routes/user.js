const express = require("express");
const router = express.Router();
// const path=require("path");
const bcrypt = require('bcryptjs')
const user = require("../Schema/users");
const jwt = require('jsonwebtoken');
const JWT_Secret="mysecretvalue";
const JWT_Secret_Refresh="refrehtokenmysecretvalue";
const verifyJWT =require('../Middlewares/verifyJWT');
const session = require("../Schema/session");
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


router.get("/:userID", verifyJWT,async (req, res) => {
    let userssData = await user.findById(req.params.userID).populate("tasks");
    res.json(userssData);
})

router.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    const User = await user.findOne({ userName }).lean();
    
    if (!User) {
        return res.json({ status: "error", error: "invalid username/password" });
    }

    if (await bcrypt.compare(password, User.password)) {
        const token = jwt.sign({ id: User._id, username: User.userName, },JWT_Secret,{expiresIn: '10s'})
        const refreshToken=jwt.sign({ id: User._id, username: User.userName },JWT_Secret_Refresh,{expiresIn: '1d'})
        res.cookie('jwt',refreshToken,{httpOnly:true, maxAge:24*60*60*1000 })
        res.json({ status: 'ok', accessToken: token })
    }
})

router.post("/logout", async (req,res)=>{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const accessToken = req.headers.authorization;
    if (!accessToken) return res.sendStatus(401);
    console.log(accessToken)
    const tokenData={
        refreshToken,
        accessToken
    }
    const responce = await session.create(tokenData);
    res.status(200).json({
        "message":"logout success"
    })
   
   
   
    // let userLogout= await user.findById(req.params.userId);
    // let refreshtoken = {refreshToken:refreshTokenFromCookie};
    // const data= await user.findByIdAndUpdate(req.params.userId,userLogout,refreshtoken,()=>{
    //     if (err) {
    //         return res.sendStatus(500)
    //     }
    //         return res.sendStatus(200)
    // });
    // user.fin

} )


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
        password: passwordHash,
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
