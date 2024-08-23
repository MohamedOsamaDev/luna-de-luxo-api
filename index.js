process.on("uncaughtException", (error) => {
  console.log(error);
});
import express from "express";
import dotenv from "dotenv";
import { bootstrap } from "./src/modules/index.routes.js";
import chalk from "chalk";
dotenv.config(); //config env
const app = express();
bootstrap(app, express);
process.on("unhandledRejection", (error) => {
  console.log(error);
});
app.listen(process.env.PORT, () =>
  console.log(chalk.white(`app listening... `))
);
