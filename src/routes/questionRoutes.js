import express from "express";
import * as questionController from "../controllers/questionController.js";

const router = express.Router();

// POST /questions
router.post("/", questionController.create);

// GET /questions
router.get("/", questionController.getAll);

// GET /questions/:id
router.get("/:id", questionController.getById);

export default router;