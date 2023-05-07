const router = require("express").Router();
const conn = require("../DB/DbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const appError=require("../middleware/appError");
const admin=require("../middleware/Admin");



router.post(
    "/create",
     admin,
    body("name")
      .isString()
      .withMessage("please enter a valid Course name")
      .isLength({ min: 10 })
      .withMessage("user name should be at lease 10 characters"),
     
      
      body("duration")
      .isString()
      .withMessage("please enter a valid duration")
      .isLength({ min: 4 })
      .withMessage("duration should be at lease 4 characters"),

    async (req, res,next) => {
      try {
        // 1- VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error=new appError("there is Error !!",404);
          return next(error);
        }
  
        // 3- PREPARE course OBJECT
        const CourseObj = {
            coursename: req.body.name,
            duration:req.body.duration
        };
  
        // 4 - INSERT course INTO DB
        const query = util.promisify(conn.query).bind(conn);
        await query("insert into courses set ? ", CourseObj);
        res.status(200).json({
          msg: "Course created successfully !",
        });
      } catch (err) {
        const error=new appError("there is error",500);
        return next(error);
      }
    }
  );

  router.put(
    "/update",
     admin,
    body("name")
      .isString()
      .withMessage("please enter a valid Course name")
      .isLength({ min: 10 })
      .withMessage("user name should be at lease 10 characters"),
     
      
      body("duration")
      .isString()
      .withMessage("please enter a valid duration")
      .isLength({ min: 4 })
      .withMessage("duration should be at lease 4 characters"),

    async (req, res,next) => {
        try {
            // 1- VALIDATION REQUEST [manual, express validation]
            const query = util.promisify(conn.query).bind(conn);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              const error=new appError("there is Error !!",404);
              return next(error);
            }
      
            // 2- CHECK IF course EXISTS OR NOT
            const course = await query("select * from courses where id = ?", [
              req.params.id,
            ]);
            if (!course[0]) {
              const error=new appError("course Not Found!!",404);
              return next(error);
            }
      
            // 3- PREPARE course OBJECT
            const CourseObj = {
                name: req.body.name,
                duration:req.body.duration
              };
            
            // 4- UPDATE course
            await query("update courses set ? where id = ?", [CourseObj, req.params.id]);
      
            res.status(200).json({
              msg: "course updated successfully",
            });
          } catch (err) {
            const error= new appError("there is error",500);
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
        const course = await query("select * from courses where id = ?", [
          req.params.id,
        ]);
        if (!course[0]) {
          const error=new appError("course Not Found!!",404);
          return next(error);
        }
        await query("delete from courses where id = ?", [req.params.id]);
        res.status(200).json({
          msg: "course deleted successfully!!",
        });
      } catch (err) {
        const error= new appError("there is error",500);
        return next(error);
      }
    }
  );

router.get("",admin, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const course = await query("select * from courses where id = ?", [
      req.params.id,
    ]);
    if (!course[0]) {
      const error=new appError("course Not Found!!",404);
      return next(error);
    }
    res.status(200).json(movie[0]);
  });

module.exports=router;