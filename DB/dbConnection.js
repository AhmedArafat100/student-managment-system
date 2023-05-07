// //Single Responsibilty

const mysql=require("mysql");

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"students",
    port:"3306"
});

connection.connect((err)=>{
    if(err) throw err
    console.log("Db Connected");

})

module.exports=connection;