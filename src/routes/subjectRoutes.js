import express from "express";
import * as subjectController from "../controllers/subjectController.js";

const router = express.Router();

// POST /subjects
router.post("/", subjectController.create);

// GET /subjects
router.get("/", subjectController.getAll);

// GET /subjects/:id
router.get("/:id", subjectController.getById);

export default router;