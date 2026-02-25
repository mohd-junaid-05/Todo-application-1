import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import db from '../db.js'





const router = express.Router();

//registration API 
router.post('/register', async (req,res) =>{
    const {username , password} = req.body    

    const hashedPassword = await bcrypt.hash(password,8);
    

    try{

        const getUser = db.prepare(`SELECT * FROM user WHERE username = ?;`);
    const user =   getUser.get(username)
    
    if(user){
        return res.status(404).send({message : "User already exists"})

        
    }else{
         const insertUser = db.prepare(`INSERT INTO user(username,password) VALUES (? , ?);`);
    const result =  insertUser.run(username,hashedPassword);
    
    const defaultTodo = `Hello :) add you first TODO`;
    const insertTodo = db.prepare(`INSERT INTO todos(user_id,task) VALUES(? , ?);`)
    insertTodo.run(result.lastInsertRowid,defaultTodo);
     // making jwt token 
    const token = jwt.sign({id : result.lastInsertRowid},process.env.JWT_SECRET_KEY,{expiresIn : '24h'})
    res.json({token}).status(201)



    }
        

   


    }catch(e){
        console.log(`this is the error in register ${e}`);
        res.sendStatus(503);
    }


   
})


// login API

router.post('/login' , async (req,res) => {

   const  { username , password } = req.body
try{

    const getUser = db.prepare(`SELECT * FROM user WHERE username = ?;`);
    const user =   getUser.get(username)
    
    if(!user){
        return res.status(404).send({message : "User is not found"})
    }

    const passwordIsVaild = await bcrypt.compare(password,user.password);

    if(!passwordIsVaild){
        return res.status(401).send({message : "Invaild Password"})
    }
        const token = jwt.sign({id : user.id},process.env.JWT_SECRET_KEY,{expiresIn : '24h'})
    res.json({token}).status(201)

    

    


}catch(e){
    console.log(`this is the error from login ${e}`)
    res.sendStatus(503);
}

})

export default router