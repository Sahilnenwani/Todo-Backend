const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const JWT_Secret = "mysecretvalue";
const session=require("../Schema/session")


const verifyJWT = async (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) return res.sendStatus(401);
    // console.log(accessToken)

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    
    // let userData= await user.findById(req.params.userId);
    // console.log("user data",userData)

    const sessionData=await session.findOne({accessToken});
    // console.log(sessionData)

    if (!sessionData) {
        if (sessionData?.accessToken == accessToken  ) {
            res.json({
                "message":"you are logged out"
            })    
        }
        else{
            
            // const token = authHeader.split('')[0];
            // console.log("token it self",token)
            
            jwt.verify(
                accessToken,
                JWT_Secret,
                (err, decodedtoken) => {
                    if(err){
                         return res.sendStatus(403);
                    }
                    next();
                }
            )
                 
        }
        
    }
    else{
        res.json({
            "message":"you are logged out"
        })
    }
    
   



    

    
}


module.exports = verifyJWT;