const router = require("express").Router();
const conn = require("../DB/DbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const appError=require("../middleware/appError");
const student=require("../middleware/Student")


//Update User
router.put(
    "/:id",
    student, // params
    body("name")
      .isString()
      .withMessage("please enter a valid movie name")
      .isLength({ min: 10 })
      .withMessage("user name should be at lease 10 characters"),
     
      body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
      
      body("email").isEmail().withMessage("please enter a valid email!"),
    async (req, res,next) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error=new appError("there is Error !!",404);
          return next(error);
        }
  
        // 2- CHECK IF user EXISTS OR NOT
        const user = await query("select * from users where id = ?", [
          req.params.id,
        ]);
        if (!user[0]) {
          const error=new appError("User Not Found!!",404);
          return next(error);
        }
  
        // 3- PREPARE user OBJECT
        const UserObj = {
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 10),
            email: req.body.email
          };
        
        // 4- UPDATE User
        await query("update users set ? where id = ?", [UserObj, req.params.id]);
  
        res.status(200).json({
          msg: "User updated successfully",
        });
      } catch (err) {
        const error= new appError("there is error",500);
        return next(error);
      }
    }
);


router.post(
    "/:id",
    student,
    async (req, res,next) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error=new appError("there is Error !!",404);
          return next(error);
        }
      const query = util.promisify(conn.query).bind(conn);
       const course = await query("select * from courses where id =?",[req.params.id])
  
        // 3- PREPARE Student OBJECT
        const StudentObj = {
          course_name: course[0].coursename,
          student_id:res.locals.user.Id,
          course_id:req.params.id,
          student_name:res.locals.user.name
        };
  
        // 4 - INSERT Student INTO DB
        await query("insert into student_courses set ? ", StudentObj);
        res.status(200).json({
          msg: "registered successfully !",
        });
      } catch (err) {
        const error=new appError("there is error",500);
        return next(error);
      }
    }
);




module.exports=router;