import { prismaService } from "@/modules/shared/services";

import { NoteController } from "./note.controller";
import { NoteRepository } from "./note.repository";
import { NoteService } from "./note.service";

const noteRepository = NoteRepository.getInstance({ db: prismaService });

const noteService = NoteService.getInstance({ noteRepository, prismaService });

const noteController = NoteController.getInstance({ noteService });

export { noteController };
