import { Router } from "express";

import { authRoutes } from "@/modules/auth";
import { noteRoutes } from "@/modules/note";
import { userRoutes } from "@/modules/user";

const appRoutes: Router = Router();

appRoutes.use("/auth", authRoutes);
appRoutes.use("/users", userRoutes);
appRoutes.use("/notes", noteRoutes);

export { appRoutes };
