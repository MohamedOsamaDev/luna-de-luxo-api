
import chalk from "chalk";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const databaseConnection = async () => {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error(
      chalk.red("Error: DB_URL is not defined in the environment variables.")
    );
    process.exit(1); // Exit the process with an error code
  }

  try {
    await mongoose.connect(dbUrl);
    console.log(chalk.blue("Database connected"));
  } catch (error) {
    console.error(chalk.red("Database connection error:", error));
    process.exit(1); // Exit the process with an error code
  }
};
