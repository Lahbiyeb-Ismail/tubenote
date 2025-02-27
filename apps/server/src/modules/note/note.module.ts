import { prismaClient } from "@modules/shared";

import { NoteController } from "./note.controller";
import { NoteRepository } from "./note.repository";
import { NoteService } from "./note.service";

const noteRepository = new NoteRepository(prismaClient);
const noteService = new NoteService(noteRepository);
const noteController = new NoteController(noteService);

export { noteController };
