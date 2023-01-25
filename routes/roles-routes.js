import express from "express";
import pool from "../database.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

//add a new role
router.post("/api/v1/newRole", async (req, res) => {
    try {
      const new_role = await pool.query(
        "INSERT INTO roles(role_name, role_description, created_by, created_on) VALUES ($1, $2, $3, $4) RETURNING *",
        [
            req.body.role_name, 
            req.body.role_description,  
            req.body.created_by, 
            req.body.created_on, 
        ]
      );
      res.json({ new_role: new_role.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //get all roles
router.get("/api/v1/roles", async (req, res) => {
    try {
      const roles = await pool.query("SELECT * FROM roles");
      res.json({ roles: roles.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  //get role details
  router.get("/api/v1/roles/:role_id", async (req, res) => {
    try {
      const role_details = await pool.query(
        "SELECT * FROM roles WHERE role_id = $1",
        [req.params.role_id]
      );
      res.json({ role_details: role_details.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  //edit role
  router.put("/api/v1/roles/edit/:role_id", async (req, res) => {
    try {
      const updateRoleDetails = await pool.query(
        "UPDATE roles SET role_name =$1, role_description=$2, modified_by=$3, last_modified_on=$4 WHERE role_id= $5 RETURNING *",
        [
            req.body.role_name, 
            req.body.role_description,  
            req.body.modified_by, 
            req.body.last_modified_on,
            req.params.role_id,
        ]
      );  
      res.json({ updateRoleDetails: updateRoleDetails.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router;
  