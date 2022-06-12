import express from "express";
import {
  createEventDocument,
  deleteEventById,
  editEventById,
  getEventByIdOrAll,
} from "../Controllers/eventController.js";

const router = express.Router();

router.route("/events").get(getEventByIdOrAll).post(createEventDocument);

router.route("/events/:id").delete(deleteEventById).put(editEventById);

export default router;
