#!/usr/bin/env node

const commander = require("commander");
const php = require("./php");
const fpm = require("./fpm");
const applicationVersion = require("../package.json").version;

if (process.argv.length === 2) {
  process.argv.push("status");
}

const renderStatus = () => {
  console.log( `PHP Version Manager version \n ${applicationVersion}`
  );

  const version = php.current();
  const cli = php.moduleStatus(version, "cli", "xdebug");
  const fpm = php.moduleStatus(version, "fpm", "xdebug");

  const phpText = "PHP: " + version;
  const cliText = "CLI: " + (cli ? "ON" : "OFF");
  const fpmText = "FPM: " + (fpm ? "ON" : "OFF");

  console.log("  " + [phpText, cliText, fpmText].join("\n"));
};

const program = new commander.Command();

program
  .name("pvm")
  .version(
    applicationVersion,
    "-v, --version",
    "output the current application version"
  )
  .usage("[command] [options]")
  .description(`PHP Version Manager version ${applicationVersion}`);

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
        console.log(version);
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
  .command("xdebug [sapi] [status]")
  .alias("x")
  .description("Manage XDebug status")
  .action((sapi, status) => {
    const enableOptions = ["1", "on", "yes", "y"];
    const disableOptions = ["0", "off", "no", "n"];

    if (
      status === undefined &&
      (enableOptions.includes(sapi) || disableOptions.includes(sapi))
    ) {
      status = sapi;
      sapi = undefined;
    }

    if (sapi !== undefined && !["fpm", "cli"].includes(sapi)) {
      throw new Error(`Invalid SAPI \'${sapi}\', specify \'fpm\' or \'cli\'`);
    }

    if (status === undefined) {
      php.moduleToggle("xdebug", sapi);
    } else if (enableOptions.includes(status)) {
      php.moduleEnable("xdebug", sapi);
    } else if (disableOptions.includes(status)) {
      php.moduleDisable("xdebug", sapi);
    } else {
      throw new Error(`Invalid status \'${status}\'`);
    }

    switch (status) {
      case undefined:
        break;
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
        throw new Error(`Invalid status \'${status}\'`);
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
