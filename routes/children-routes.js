import express from "express";
import pool from "../database.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

//add a new child
router.post("/api/v1/newChild", authenticateToken, async (req, res) => {
    try {
      const new_child = await pool.query(
        "INSERT INTO children (user_id, school_id, school_name, first_name, last_name, class, age, gender, child_photo, pickup_location, drop_off_location, created_by, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        [
            req.body.user_id,
            req.body.school_id, 
            req.body.school_name, 
            req.body.first_name, 
            req.body.last_name, 
            req.body.class, 
            req.body.age, 
            req.body.gender, 
            req.body.child_photo, 
            req.body.pickup_location, 
            req.body.drop_off_location, 
            req.body.created_by, 
            req.body.created_on
        ]
      );
      res.json({ new_child: new_child.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//get all children
router.get("/api/v1/children", authenticateToken,async (req, res) => {
    try {
      const children = await pool.query(
        "SELECT * FROM children"
      );
      res.json({ children: children.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
//get a child
router.get("/api/v1/children/:child_id", authenticateToken, async (req, res) => {
    try {
      const child = await pool.query(
        "SELECT * FROM children WHERE child_id = $1",
        [req.params.child_id]
      );
      res.json({ child: child.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//get all children belonging to a parent
router.get("/api/v1/children/:user_id", authenticateToken, async (req, res) => {
    try {
      const parent_children = await pool.query(
        "SELECT * FROM children WHERE user_id = $1",
        [
          req.params.user_id,
        ]
      );
      res.json({ parent_children: parent_children.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//get all children belonging to a school
router.get("/api/v1/children/:school_id", authenticateToken, async (req, res) => {
    try {
      const school_children = await pool.query(
        "SELECT * FROM children WHERE school_id = $1",
        [
          req.params.school_id,
        ]
      );
      res.json({ school_children: school_children.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;