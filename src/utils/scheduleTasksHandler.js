import chalk from "chalk";
import cron from "node-cron";

export const scheduleTasksHandler = (tasks = []) => {
  tasks?.forEach(({ task, name = null, interval }, index) => {
    let taskName = `| ${name || index} |`;
    try {
      cron.schedule(interval, () => {
        task(); // Execute the provided task function
      });
      console.log( chalk.yellow(`task activated successfully for  ${taskName}`));
    } catch (error) {
      if (
        error?.message ===
        "Cannot read properties of undefined (reading 'replace')"
      ) {
        return console.log(
          chalk.red(`Invalid interval format for task ${taskName}`)
        );
      }
      console.log(chalk.red(`Error while scheduling task: ${taskName}`));
    }
  });
};
