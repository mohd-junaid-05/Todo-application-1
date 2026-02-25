console.log(`
    -the output is starting from here-

`);

import dotenv from "dotenv";
dotenv.config();

import express from "express"
import path , {dirname} from "path"
import { fileURLToPath } from "url";
import authRoutes from './Routes/authRoutes.js'
import todoRoutes from './Routes/todoRoutes.js'
import authMiddleWare from "./middleware/authMiddleware.js";
import db from "./db.js";

const app = express();



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.static(path.join(__dirname,'../public')));
app.use(express.json());    



app.use('/auth', authRoutes);
app.use('/todos',authMiddleWare, todoRoutes);

//checking users in the db 
app.get('/user', (req, res) => {
    try {
        const data = db.prepare("SELECT * FROM user").all();
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});





const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/' , async(req,res) =>{
    res.sendFile(path.join(__dirname,'public' , 'index.html'));
})


