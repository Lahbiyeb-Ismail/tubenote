import { prismaService } from "@/modules/shared/services";

import { NoteController } from "./note.controller";
import { NoteRepository } from "./note.repository";
import { NoteService } from "./note.service";

const noteRepository = new NoteRepository(prismaService);

const noteService = new NoteService(noteRepository, prismaService);

const noteController = new NoteController(noteService);

export { noteController };
