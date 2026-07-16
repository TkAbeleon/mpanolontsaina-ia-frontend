import { Router, type IRouter } from "express";
import healthRouter from "./health";
import extApiProxyRouter from "./ext-api-proxy";

const router: IRouter = Router();

router.use(healthRouter);
router.use(extApiProxyRouter);

export default router;
