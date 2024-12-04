import { Router } from "express";

import {
	createNote,
	getUserNotes,
	deleteNote,
	getNoteById,
	updateNote,
	getUserRecentNotes,
	getUserRecentlyUpdatedNotes,
} from "../controllers/note.controller";

import isAuthenticated from "../middlewares/isAuthenticated";
import validateRequestBody from "../middlewares/validateRequestBody";
import validateRequestParams from "../middlewares/validateRequestParams";

import {
	noteIdParamSchema,
	noteSchema,
	updateNoteSchema,
} from "../schemas/note.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
router.use(isAuthenticated);

// - GET /: Get all notes for the authenticated user.
// - POST /: Create a new note (requires request body validation).
router
	.route("/")
	.get(getUserNotes)
	.post(validateRequestBody(noteSchema), createNote);

// - GET /recent: Get the most recent notes for the authenticated user.
router.route("/recent").get(getUserRecentNotes);

// - GET /recently-updated: Get the recently updated notes for the authenticated user.
router.route("/recently-updated").get(getUserRecentlyUpdatedNotes);

// - GET /:noteId: Get a specific note by its ID (requires request params validation).
// - PATCH /:noteId: Update a specific note by its ID (requires request params validation).
// - DELETE /:noteId: Delete a specific note by its ID (requires request params validation).
router
	.route("/:noteId")
	.all(validateRequestParams(noteIdParamSchema))
	.patch(validateRequestBody(updateNoteSchema), updateNote)
	.get(getNoteById)
	.delete(deleteNote);

export default router;
