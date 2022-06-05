import { execSync } from "child_process";
import { versions } from "./php.js";

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

export {
  restart
};