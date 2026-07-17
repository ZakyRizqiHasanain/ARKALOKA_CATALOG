const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req,res)=>{
res.json({
    message:"Product Store API Running"
});
});

app.listen(PORT,()=>{
    console.log(
    `Server running on port ${PORT}`
    );

});

const pool=require("./config/database");

pool.connect()
.then(()=>console.log(
    "Database connected"
))

.catch(err=>console.log(err));