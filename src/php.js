import { execSync } from "child_process";
import * as fpm from "./fpm.js";

/**
 * Get currently active PHP version number
 *
 * @return {string}
 */
const current = () =>
  execSync('php -v | head -n 1 | cut -d " " -f 2 | cut -f1-2 -d"."')
    .toString()
    .trim();

/**
 * Get all installed PHP version numbers
 *
 * @return {Array.string}
 */
const versions = () =>
  execSync("find /usr/bin -name 'php*.*' -type f | cut -b 13- | sort -g")
    .toString()
    .trim()
    .split("\n");

/**
 * Switch default PHP Version
 *
 * @param {string} version PHP Version number
 *
 * @return {bool|string}
 */
const use = version => {
  if (!/^\d\.\d$/.test(version) || !versions().includes(version)) {
    throw new Error(`Invalid version number "${version}"`);
  }

  if (version === current()) {
    return false;
  }

  execSync(
    `sudo /usr/bin/update-alternatives --set php /usr/bin/php${version}`
  );

  return current();
};

/**
 * Perform a phpquery.
 *
 * @param {string} version PHP Version
 * @param {string} sapi    SAPI name (e.g. cli, fpm, apache2)
 * @param {string} module  PHP Module name (optional)
 *
 * @return {boolean}
 */
const query = (version, sapi, module=undefined) => {
  try {
    execSync(`phpquery -v ${version} -s ${sapi}` + (module ? ` -m ${module}` : ''));
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get the php cli status.
 * @returns {boolean}
 */
const status = () => {
  return query(current(), 'cli');
};

/**
 * Enable PHP Module
 *
 * @param {string} module
 * @param {string|undefined} sapi
 */
const moduleEnable = (module, sapi) => {
  sapi = sapi ? `-s ${sapi}` : "";
  execSync(`sudo /usr/sbin/phpenmod ${sapi} ${module}`);
};

/**
 * Disable PHP Module
 *
 * @param {string} module
 * @param {string|undefined} sapi
 */
const moduleDisable = (module, sapi) => {
  sapi = sapi ? `-s ${sapi}` : "";
  execSync(`sudo /usr/sbin/phpdismod ${sapi} ${module}`);
};

const moduleToggle = (module, sapi) => {
  const currentVersion = current();

  let cliStatus;
  let fpmStatus = query(currentPhpVersion(), "fpm");

  if (sapi === "cli" || sapi === undefined) {
    cliStatus = query(currentVersion, "cli", module);
  }

  if (cliStatus === true || fpmStatus === true) {
    moduleDisable(module, sapi);
    return false;
  } else {
    moduleEnable(module, sapi);
    return true;
  }
};

export {
  current,
  versions,
  use,
  query,
  status,
  moduleEnable,
  moduleDisable,
  moduleToggle
};