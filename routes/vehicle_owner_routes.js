import express from "express";
import pool from "../database.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

//add a new owner
router.post("/api/v1/newOwner", async (req, res) => {
    try {
      const new_owner = await pool.query(
        "INSERT INTO vehicle_owner(vehicle_owner_name,email,phone_number,created_by,created_on) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
            req.body.vehicle_owner_name,
            req.body.email,
            req.body.phone_number,
            req.body.created_by,
            req.body.created_on
        ]
      );
      res.json({ new_owner: new_owner.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//get all owners
router.get("/api/v1/owners", authenticateToken,async (req, res) => {
    try {
      const owners = await pool.query(
        "SELECT * FROM vehicle_owner"
      );
      res.json({ owners: owners.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//get an owner
router.get("/api/v1/owners/:vehicle_owner_id", authenticateToken, async (req, res) => {
    try {
      const owner = await pool.query(
        "SELECT * FROM vehicle_owner WHERE vehicle_owner_id = $1",
        [req.params.vehicle_owner_id]
      );
      res.json({ owner: owner.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;