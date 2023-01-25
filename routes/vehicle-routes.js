import express from "express";
import pool from "../database.js";
import { authenticateToken } from "../middleware/authorization.js";

const router = express.Router();

//add a new vehicle
router.post("/api/v1/newVehicle", async (req, res) => {
    try {
      const new_vehicle = await pool.query(
        
        "INSERT INTO vehicles(vehicle_owner_id,vehicle_owner_name,status,vehicle_model,licence_plate,vehicle_photo1,vehicle_photo2,vehicle_photo3,vehicle_photo4,vehicle_color,vehicle_seats,available_seats, created_by,created_on ) VALUES ($1, $2, $3, $4, $5,$6, $7, $8, $9, $10,$11, $12, $13, $14) RETURNING *",
        [
            req.body.vehicle_owner_id,
            req.body.vehicle_owner_name,
            req.body.status,
            req.body.vehicle_model,
            req.body.licence_plate,
            req.body.vehicle_photo1,
            req.body.vehicle_photo2,
            req.body.vehicle_photo3,
            req.body.vehicle_photo4,
            req.body.vehicle_color,
            req.body.vehicle_seats,
            req.body.available_seats, 
            req.body.created_by,
            req.body.created_on 
            
        ]
      );
      res.json({ new_vehicle: new_vehicle.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//get all vehicles
router.get("/api/v1/vehicles", authenticateToken, async (req, res) => {
    try {
      const vehicles = await pool.query(
        "SELECT * FROM vehicles"
      );
      res.json({ vehicles: vehicles.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//get a vehicle
router.get("/api/v1/vehicles/:vehicle_id", authenticateToken, async (req, res) => {
    try {
      const vehicle = await pool.query(
        "SELECT * FROM vehicles WHERE vehicle_id = $1",
        [req.params.vehicle_id]
      );
      res.json({ vehicle: vehicle.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//get all vehicles by owner
router.get("/api/v1/vehicles/:vehicle_owner_id", authenticateToken, async (req, res) => {
    try {
      const vehicles_owner = await pool.query(
        "SELECT * FROM vehicles WHERE vehicle_owner_id = $1",
        [req.params.vehicle_owner_id]
      );
      res.json({ vehicles_owner: vehicles_owner.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router;