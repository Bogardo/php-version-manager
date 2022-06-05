#!/usr/bin/env node

import * as php from "./php.js";
import * as fpm from "./fpm.js";
import * as nginx from "./nginx.js";
import commander from "commander";
import packageConfig from "../package.json" assert {type: 'json'};


if (process.argv.length === 2) {
  process.argv.push("status");
}

const renderStatus = () => {
  console.log("\x1b[32m%s\x1b[0m \x1b[33m%s\x1b[0m", "PHP Version Manager", packageConfig.version);

  const phpText = "PHP: \x1b[33m" + php.current() + "\x1b[0m";
  const cliText = "CLI: " + (php.status() ? "\x1b[32mON\x1b[0m" : "\x1b[31mOFF\x1b[0m");
  const fpmText = "FPM: " + (fpm.status() ? ("\x1b[32mON\x1b[0m" + (nginx.status() == 'running' ? "\x1b[32m(Nginx)\x1b[0m" : "")) : "\x1b[31mOFF\x1b[0m");

  console.log([phpText, cliText, fpmText].join("\n"));
};

const program = new commander.Command();

program
  .name("pvm")
  .version(
    packageConfig.version,
    "-v, --version",
    "output the current application version"
  )
  .usage("[command] [options]")
  .description("\x1b[32m%s\x1b[0m %s \x1b[33m%s\x1b[0m", "PHP Version Manager", "version \n", packageConfig.version);

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
        console.log("\x1b[32m%s\x1b[0m", version);
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
    
    // Validate version
    let strVersion = toString(version);
    if (strVersion.length == 2 && !strVersion.includes('.')) {
      console.log('Version incorrect: ' + version);
      version = version.slice(0, 1) + "." + version.slice(1);
      console.log('Updated version: ' + version);
    } else if (strVersion.length > 2 && strVersion.length < 2 && !strVersion.includes('.')){
      console.log('Invalid version: ' + version);
      return false;
    }
    
    // Switch version and restart relevant services
    if (php.use(version) && fpm.status()) {
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
