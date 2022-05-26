const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const JWT_Secret = "mysecretvalue";
const JWT_Secret_Refresh = "refrehtokenmysecretvalue";
const express = require("express");
const { route } = require('./tasks');
const router = express.Router();

router.get("/refreshToken",(req,res)=>{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        JWT_Secret_Refresh,
        (err,decoded)=>{
            if (err) return res.sendStatus(403);

            const accessToken=jwt.sign(
                {id: decoded.id, username: decoded.username},JWT_Secret,{expiresIn:'10m'}
            );
            res.json({accessToken})
        }
    )
})

module.exports=router;