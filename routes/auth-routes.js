import express from "express";
import pool from "../database.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

//user login 
router.post("/api/v1/auth/login", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);
    if (users.rows.length === 0)
      return res.status(401).json({ error: "Email is incorrect" });

    //passwordCheck
    const validPassword = await bcrypt.compare(
      req.body.password,
      users.rows[0].password
    );
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });
    //JWT
    let tokens = jwtTokens(users.rows[0]);
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//create new client
router.post("/api/v1/auth/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (role_id, role_name, first_name, last_name, gender, email, home_address, phone_number, password, created_by, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        req.body.role_id, 
        req.body.role_name, 
        req.body.first_name, 
        req.body.last_name,
        req.body.gender, 
        req.body.email, 
        req.body.home_address, 
        req.body.phone_number, 
        hashedPassword, 
        req.body.created_by, 
        req.body.created_on
      ], 
    );
    const user_id = newUser.rows[0].user_id;
    if(req.body.role_id == "2"){
      const newSchool = await pool.query(
        "INSERT INTO schools(user_id, school_name, email, school_address, phone_number) VALUES ($1, $2, $3, $4, $5)RETURNING *",
        [
          user_id,
          req.body.first_name, 
          req.body.email, 
          req.body.home_address,
          req.body.phone_number
        ]
      );
      // res.json({ newDriver: newDriver.rows[0]});                      
    } else if(req.body.role_id == "3"){
      const newDriver = await pool.query(
        "INSERT INTO drivers(user_id, first_name, last_name, email, mobile) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          user_id, 
          req.body.first_name, 
          req.body.last_name, 
          req.body.email, 
          req.body.phone_number
        ]
      );
      // res.json({ newDriver: newDriver.rows[0]});  
    }
    res.json({ newUser: newUser.rows[0]});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//change password
router.put("/api/v1/user/changePassword", authenticateToken, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const users = await pool.query("SELECT * FROM users WHERE users_id = $1", [
      req.params.users_id
    ]);

     //passwordCheck
    const validPassword = await bcrypt.compare(
      req.body.password,
      users.rows[0].password
    );
    if (!validPassword)
      return res.status(401).json({ error: "Your old password is incorrect" });

    const changePassword= await pool.query(
      "UPDATE users SET password = $1 WHERE users_id= $2 RETURNING *",
      [ 
        hashedPassword, 
        req.params.users_id
      ]
    );  
    res.json({ changePassword: changePassword.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
