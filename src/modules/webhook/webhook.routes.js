import express from "express";

const webHookRouter = express.Router();
webHookRouter.use(express.raw({ type: "application/json" }));
export default webHookRouter;
