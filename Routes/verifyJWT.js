const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const JWT_Secret="mysecretvalue";
const JWT_Secret_Refresh="refrehtokenmysecretvalue";

const verifyJWT=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;


    let isExpiredToken=false;
    let dateNow = new Date();
    if (authHeader.exp<dateNow.getTime()) {
        isExpiredToken=true;
    }
    console.log(authHeader);
    const token=authHeader.split(' ')[1];
    jwt.verify(
        token,
        JWT_Secret,
        (err,decoded)=>{
           
            next(); 
        }
    )
    
    if (isExpiredToken) {
         jwt.verify(
        refreshToken,
       JWT_Secret_Refresh,
        (err, decoded) => {
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({ accessToken })
        }
    );
    }


}


module.exports=verifyJWT;