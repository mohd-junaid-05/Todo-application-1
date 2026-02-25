import jwt from 'jsonwebtoken'

function authMiddleWare (req,res,next) {
    const token = req.headers['authorization']


    if(!token){
        return res.status(401).json({message : "the TOKEN is not PROVIDED"})}


    jwt.verify(token,process.env.JWT_SECRET_KEY, (err,decoded) =>{
        if(err) {return res.status(401).json({message : "Invalid Token"})}
        req.userId = decoded.id
        next()
    })
}
export default authMiddleWare;
