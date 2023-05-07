const router = require("express").Router();
const conn = require("../DB/DbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const appError=require("../middleware/appError");
const admin=require("../middleware/Admin");
const crypto = require("crypto"); 


router.post(
    "/create",
    // admin,
    body("name")
      .isString()
      .withMessage("please enter a valid user name")
      .isLength({ min: 10 })
      .withMessage("user name should be at lease 10 characters"),
     
      body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
      
      body("email").isEmail().withMessage("please enter a valid email!"),
      body("role").isNumeric().withMessage("role must be 0 or 1"),

    async (req, res,next) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error=new appError("there is error!!",404);
          return next(error);
        }
        const query = util.promisify(conn.query).bind(conn);
        const checkEmailExists = await query("select * from users where email = ?", [
          req.body.email,
        ]);
        if (checkEmailExists.length>0) {
          const error=new appError("email already exist!!",404);
          return next(error);
        }
  
        // 3- PREPARE User OBJECT
        const UserObj = {
          name: req.body.name,
          password: await bcrypt.hash(req.body.password, 10),
          email: req.body.email,
          token: crypto.randomBytes(16).toString("hex"),
          role:req.body.role
        };
  
        // 4 - INSERT user INTO DB
        await query("insert into users set ? ", UserObj);
        res.status(200).json({
          msg: "user created successfully !",
        });
      } catch (err) {
        console.log(err);
        const error=new appError("there is error",500);
        return next(error);
      }
    }
  );




router.delete(
    "/:id",
    admin, // params
    async (req, res,next) => {
      try {
        // 1- CHECK IF MOVIE EXISTS OR NOT
        const query = util.promisify(conn.query).bind(conn);
        const user = await query("select * from users where id = ?", [
          req.params.id,
        ]);
        if (!user[0]) {
          const error=new appError("User Not Found!!",404);
          return next(error);
        }
        await query("delete from users where id = ?", [req.params.id]);
        res.status(200).json({
          msg: "user deleted successfully!!",
        });
      } catch (err) {
        const error= new appError("there is error",500);
        return next(error);
      }
    }
  );

router.get("",admin, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const user = await query("select * from users where id = ?", [
      req.params.id,
    ]);
    if (!user[0]) {
      const error=new appError("User Not Found!!",404);
      return next(error);
    }
    res.status(200).json(movie[0]);
  });

module.exports=router;


