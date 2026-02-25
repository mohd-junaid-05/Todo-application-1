import express from 'express'
import db from '../db.js'

const router = express.Router()


//to get the todo
router.get('/' , async (req,res) =>{


    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?;`)
    const todos = getTodos.all(req.userId)
    res.json(todos);


})

//to create the todo

router.post('/' , async (req,res) =>{
    const {task} = req.body;
    try{
        const insertTodo = db.prepare(`INSERT INTO todos(user_id , task) VALUES ( ?,?)`)
    insertTodo.run(req.userId, task);

    res.json({id : insertTodo.lastID, task , completed : 0}).status(200)


    }catch(e){
        console.log(`this is the error ${e}`);

    }

    });







//to update the todo
router.put('/:id' , async (req,res) =>{

    const {completed} = req.body
    const {id} = req.params 
    const {page} = req.query 


    const updateTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?;`) 
    updateTodo.run(completed,id);

    res.json({ Message : "the todo is updated"})





})
//to delete the todo
router.delete('/:id' , async (req,res) =>{
    const {id} = req.params 
    const {page} = req.query 
    

    
    const updateTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?;`) 
    updateTodo.run(id, req.userId);

    res.json({ Message : "the todo is Deleted"})
})


export default router