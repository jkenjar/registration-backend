const express = require("express");
const app = express();
const db = require("sqlite3").verbose();

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
let dbase = new db.Database("./registration.db");

app.use("/add_major", (request, response) => {
  const searchQuery =
    "select * from Major where Major.description = '" +
    request.body.description +
    "'";
  dbase.all(searchQuery, [], (err, rows) => {
    if (rows == undefined || rows.length == 0) {
      const sql = `INSERT INTO 
			  			   Major(description, type)
						   VALUES (?, ?)`;
      const major = [request.body.description, request.body.type];
      if (sql && major !== undefined && major !== []) {
        dbase.run(sql, major);
        response.send(major);
      } else {
        response.send("Adding major failed! Make sure no data is missing");
      }
    } else {
      response.send("Major already exists");
    }
  });
});

app.use("/add_student", (req, res) => {
  // const searchQuery = 'select * from major where student.description = ' + request.description;

  const sql = `INSERT INTO 
  			   students(first_name;, last_name, dob, year, date_started, graduation_date, email, phone)
			   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const student = [
    req.body.firstName,
    req.body.lastName,
    req.body.dob,
    req.body.year,
    req.body.dateStarted,
    req.body.graduationDate,
    req.body.email,
    req.body.phone
  ];
  if (sql && student !== undefined && student !== []) {
    dbase.run(sql, student);
  } else {
    res.send("Adding student failed! Make sure no data is missing.");
  }
});

app.use("/add_instructor", (req, res) => {
  dbase.all(
    "select department_id from department where department.description ='" +
      req.body.description +
      "'",
    [],
    (err, rows) => {
      if (typeof rows[0].department_id == "number" && rows[0].department_id) {
        const sql = `INSERT INTO 
			  			 instructor(first_name, last_name, dob, email, phone, position_type, date_hired, department_id)
						 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const instructor = [
          req.body.firstName,
          req.body.lastName,
          req.body.dob,
          req.body.email,
          req.body.phone,
          req.body.positionType,
          req.body.dateHired,
          rows[0].department_id
        ];
        if (sql && instructor !== undefined && instructor !== []) {
          dbase.run(sql, instructor);
          res.send({
            message: "Instructor added."
          });
        } else {
          res.send("Adding instructor failed! Make sure no data is missing.");
        }
      }
    }
  );
});

app.listen(3000);
