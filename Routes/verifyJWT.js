const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const JWT_Secret = "mysecretvalue";
const JWT_Secret_Refresh = "refrehtokenmysecretvalue";

const verifyJWT = (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) return res.sendStatus(401);
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;


    // let isExpiredToken = false;
    // let dateNow = new Date();
    // if (accessToken.exp < dateNow.getTime()) {
    //     isExpiredToken = true;
    // }

    // if (isExpiredToken) {
    //     console.log("current token is expired");        
    // }



    console.log("auth header ",accessToken);
    // const token = authHeader.split('')[0];
    // console.log("token it self",token)
    
    jwt.verify(
        accessToken,
        JWT_Secret,
        (err, decodedtoken) => {
            console.log(err)
            if (err =="TokenExpiredError") {
                jwt.verify(
                    refreshToken,
                    JWT_Secret_Refresh,
                    (err, decoded) => {
                        if (err) return res.sendStatus(403); 
                            const accessToken = jwt.sign(
                            {
                                id: decodedtoken.id,
                                username: decodedtoken.username,
                            },
                            JWT_Secret,
                            { expiresIn: '10s' }
                        );
                        console.log("not renewing the token")
                        next();
                
                    }
                );
            }
            else if(!err.TokenExpiredError && err){
                 return res.sendStatus(403);
            }
            next();
        }
    )

    
}


module.exports = verifyJWT;