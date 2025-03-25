import metabaseController from "../controllers/metabaseController";
import { Router } from "express";

const metabaseRouter = Router();

metabaseRouter.get("/cards", metabaseController.getMetabaseCards);

export default metabaseRouter;
