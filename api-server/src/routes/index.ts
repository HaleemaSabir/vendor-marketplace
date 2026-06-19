import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import servicesRouter from "./services";
import projectsRouter from "./projects";
import reviewsRouter from "./reviews";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/services", servicesRouter);
router.use("/projects", projectsRouter);
router.use("/reviews", reviewsRouter);

export default router;
