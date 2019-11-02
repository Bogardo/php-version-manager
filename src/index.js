#!/usr/bin/env node

const commander = require("commander");
const chalk = require("chalk");
const php = require("./php");
const fpm = require("./fpm");
const applicationVersion = require("../package.json").version;

if (process.argv.length === 2) {
  process.argv.push("status");
}

const renderStatus = () => {
  console.log(
    chalk`\n  {green PHP Version Manager} version {yellow ${applicationVersion}}\n`
  );

  const version = php.current();
  const cli = php.moduleStatus(version, "cli", "xdebug");
  const fpm = php.moduleStatus(version, "fpm", "xdebug");

  const phpText = "PHP: " + chalk.blue.bold(version);
  const cliText =
    "CLI: " + (cli ? chalk.green.bold("ON") : chalk.red.bold("OFF"));
  const fpmText =
    "FPM: " + (fpm ? chalk.green.bold("ON") : chalk.red.bold("OFF"));

  console.log("  " + [phpText, cliText, fpmText].join("   ") + "\n");
};

const program = new commander.Command();

program
  .name("pvm")
  .version(
    applicationVersion,
    "-v, --version",
    "Output the current application version"
  )
  .description(
    chalk`{green PHP Version Manager} version {yellow ${applicationVersion}}`
  );

program
  .command("status")
  .alias("s")
  .description("Show current PHP version status")
  .action(() => {
    renderStatus();

    process.exit(0);
  });

program
  .command("ls")
  .description("List available PHP versions")
  .action(() => {
    const currentVersion = php.current();
    php.versions().forEach(version => {
      if (version === currentVersion) {
        console.log(chalk.green(version));
      } else {
        console.log(version);
      }
    });

    process.exit(0);
  });

program
  .command("use <version>")
  .alias("u")
  .description("Switch PHP version")
  .action(version => {
    if (/^\d\d$/.test(version)) {
      version = version.slice(0, 1) + "." + version.slice(1);
    }

    if (php.use(version)) {
      console.log("Restarting PHP-FPM and NGINX");
      fpm.restart();
    }

    renderStatus();
  });

program
  .command("xdebug [toggle] [sapi]")
  .alias("x")
  .description("Manage XDebug status")
  .action((toggle, sapi) => {
    if (toggle === undefined) {
      const currentVersion = php.current();
      const cliStatus = php.moduleStatus(currentVersion, "cli", "xdebug");
      const fpmStatus = php.moduleStatus(currentVersion, "fpm", "xdebug");

      if (cliStatus || fpmStatus) {
        php.moduleDisable("xdebug");
      } else {
        php.moduleEnable("xdebug");
      }

      console.log("Restarting PHP-FPM and NGINX");
      fpm.restart();

      renderStatus();

      process.exit(0);
    }

    switch (toggle) {
      case "1":
      case "on":
      case "yes":
      case "y":
        php.moduleEnable("xdebug", sapi);
        break;
      case "0":
      case "off":
      case "no":
      case "n":
        php.moduleDisable("xdebug", sapi);
        break;
      default:
        console.error("Invalid option");
        process.exit(1);
    }

    if (sapi === "fpm" || sapi === undefined) {
      console.log("Restarting PHP-FPM and NGINX");
      fpm.restart();
    }

    renderStatus();

    process.exit(0);
  });

program
  .command("restart")
  .alias("r")
  .description("Restart PHP-FPM and NGINX")
  .action(() => {
    console.log("Restarting PHP-FPM and NGINX");
    fpm.restart();
    process.exit(0);
  });

program.parse(process.argv);

if (!program.args.length) renderStatus();
