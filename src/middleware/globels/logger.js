import chalk from "chalk";
import morgan from "morgan";
export const logger = () => {
  // const date = new Date();
  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const day = String(date.getDate()).padStart(2, "0");
  // const hours = String(date.getHours()).padStart(2, "0");
  // const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");
  // const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  const formattedTime = new Date().toLocaleString().replace(', ', '-')    // Replace comma and space with a dash
  .replace(' ', '-'); ;
  const colors = (mehtod) => {
    const methodColors = {
      GET: chalk.greenBright,
      POST: chalk.yellow,
      PUT: chalk.blue,
      DELETE: chalk.red,
      PATCH: chalk.magenta,
      OPTIONS: chalk.cyan,
      HEAD: chalk.cyan,
      TRACE: chalk.cyan,
      CONNECT: chalk.cyan,
      PURGE: chalk.cyan,
    };
    const color = methodColors[mehtod] || chalk.greenBright;
    return color(mehtod);
  };
  return morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const isError = status >= 400;
    const customMessage = isError
      ? chalk.red(`${tokens.status(req, res)}`)
      : chalk.green(`${tokens.status(req, res)}`);
    const isCahced = req?.cached ? chalk.cyan(`cahced`) : "";
    const isrevaildatedcache = req?.revaildatecache
      ? chalk.bold(`cleared cache`)
      : "";
    return [
      chalk.white(`[ ${formattedTime} ]`),
      `${chalk.black(req.protocol)}:`,
      colors(tokens.method(req, res)),
      tokens.url(req, res),
      `(${Math.ceil(tokens["response-time"](req, res))} ms)`,
      customMessage,
      isCahced,
      isrevaildatedcache,
    ].join(" ");
  });
};
