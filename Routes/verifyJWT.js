const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const JWT_Secret="mysecretvalue";
const JWT_Secret_Refresh="refrehtokenmysecretvalue";

const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader);
    const token=authHeader.split(' ')[1];
    jwt.verify(
        token,
        JWT_Secret,
        (err,decoded)=>{
            if (err) return res.sendStatus(403);
            next(); 
        }
    )
}

module.export=verifyJWT;