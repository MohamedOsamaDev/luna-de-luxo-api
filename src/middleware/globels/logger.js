import chalk from "chalk";
import morgan from "morgan";
export const logger = () => {
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
    const formattedTime = new Date().toLocaleString().replace(", ", " ");
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
