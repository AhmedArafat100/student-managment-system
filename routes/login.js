const router = require("express").Router();
const conn = require("../DB/dbConnection");
const {body,validationResult} = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const appError=require("../middleware/appError");

// LOGIN
router.post(
    "",
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
    async (req, res,next) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error=new appError("there is Error !!",404);
          return next(error);
        }
  
        // 2- CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const user = await query("select * from users where email = ?", [
          req.body.email,
        ]);
        if (user.length == 0) {
          const error=new appError("email is Not Exist",404);
          return next(error);
        }
  
        // 3- COMPARE HASHED PASSWORD
        const checkPassword = await bcrypt.compare(
          req.body.password,
          user[0].password
        );
        if (checkPassword) {
          delete user[0].password;
          res.status(200).json(user[0]);
        } else {
          const error=new appError("email or password is Not Exist!!",404);
          return next(error);
        }
      } catch (err) {
        const error=new appError("there is error",500);
        return next(error);
      }
    }
  );

  
  module.exports = router;