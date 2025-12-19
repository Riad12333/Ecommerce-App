const jwt = require('jsonwebtoken')

async function authToken(req,res,next){
    try{
        const token = req.cookies?.token

        console.log("token",token)
        if(!token){
            return res.status(200).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            console.log(err)
            console.log("decoded",decoded)
            
            if(err){
                console.log("error auth", err)
                return res.status(401).json({
                    message: "Token invalide ou expiré. Veuillez vous reconnecter.",
                    error: true,
                    success: false
                })
            }

            if(!decoded?._id){
                return res.status(401).json({
                    message: "Token invalide - ID utilisateur manquant",
                    error: true,
                    success: false
                })
            }

            req.userId = decoded._id
            next()
        });


    }catch(err){
        res.status(400).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


module.exports = authToken