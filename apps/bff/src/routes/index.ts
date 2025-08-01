import { Router } from "express";

import { authRoutes } from "@/modules/auth";
import { userRoutes } from "@/modules/user";

const appRoutes: Router = Router();

appRoutes.use("/auth", authRoutes);
appRoutes.use("/users", userRoutes);

export { appRoutes };
