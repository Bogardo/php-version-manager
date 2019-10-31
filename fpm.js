const { execSync } = require("child_process");
const { versions } = require("./php");

/**
 * Restart PHP-FPM and NGINX services
 *
 * @return {boolean}
 */
const restart = () => {
  versions().forEach(version => {
    execSync(`sudo /usr/sbin/service php${version}-fpm restart`);
  });
  execSync("sudo /usr/sbin/service nginx restart");
  return true;
};

module.exports = {
  restart
};
