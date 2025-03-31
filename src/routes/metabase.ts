import metabaseController from "../controllers/metabaseController";
import { Router } from "express";

const metabaseRouter = Router();

metabaseRouter.get("/cards", metabaseController.getMetabaseCards)
metabaseRouter.get("/users", metabaseController.getMetabaseUsers)
metabaseRouter.get("/views", metabaseController.getMetabaseViews)
metabaseRouter.get("/views/:anoMes", metabaseController.getMetabaseViews)
metabaseRouter.get("/dashboardViews", metabaseController.getMetabaseDashboardViews)
metabaseRouter.get("/dashboardViews/:anoMes", metabaseController.getMetabaseDashboardViews)

export default metabaseRouter
