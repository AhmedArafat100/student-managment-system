const conn = require("../DB/dbConnection");
const util = require("util"); // helper

const Student = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const { token } = req.headers;
  const student = await query("select * from users where token = ?", [token]);
  if (student[0] && student[0].role == "0") {
    res.locals.user = student[0];
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = Student;
