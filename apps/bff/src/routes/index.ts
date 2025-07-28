import { Router } from "express";

import { authRoutes } from "@/modules/auth";
import { noteRoutes } from "@/modules/note";
import { userRoutes } from "@/modules/user";
import { videoRoutes } from "@/modules/video";

const appRoutes: Router = Router();

appRoutes.use("/auth", authRoutes);
appRoutes.use("/users", userRoutes);
appRoutes.use("/notes", noteRoutes);
appRoutes.use("/videos", videoRoutes);

export { appRoutes };
