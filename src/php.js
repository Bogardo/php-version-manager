const { execSync } = require("child_process");

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
  execSync("find /etc/php -maxdepth 1 -type d | tail -n +2")
    .toString()
    .trim()
    .replace(/\/etc\/php\//g, "")
    .split("\n")
    .sort((a, b) => a - b);

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
 * Get the status of a PHP module
 *
 * @param {string} version PHP Version
 * @param {string} sapi    SAPI name (cli or fpm)
 * @param {string} module  PHP Module name
 *
 * @return {boolean}
 */
const moduleStatus = (version, sapi, module) => {
  try {
    execSync(`phpquery -v ${version} -s ${sapi} -m ${module}`);
    return true;
  } catch (error) {
    return false;
  }
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
  let fpmStatus;

  if (sapi === "cli" || sapi === undefined) {
    cliStatus = moduleStatus(currentVersion, "cli", module);
  }

  if (sapi === "fpm" || sapi === undefined) {
    fpmStatus = moduleStatus(currentVersion, "fpm", module);
  }

  if (cliStatus === true || fpmStatus === true) {
    moduleDisable(module, sapi);
    return false;
  } else {
    moduleEnable(module, sapi);
    return true;
  }
};

module.exports = {
  current,
  versions,
  use,
  moduleStatus,
  moduleEnable,
  moduleDisable,
  moduleToggle
};
