//Single Responsibility Principle
const express = require("express");
const app = express();



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("upload"));
const cors =require("cors");
app.use(cors());


const login = require("./routes/login")
const admin= require("./routes/AdminCrud")
const student =require("./routes/StudentCrud")
const admincourse=require("./routes/Courses")

app.listen(5000,"localhost",()=>{
    console.log("Server is Running");
})

app.use("/login",login)
app.use("/admin",admin)
app.use("/student",student)
app.use("/admincourse",admincourse)