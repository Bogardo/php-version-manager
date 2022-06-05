import { execSync } from "child_process";
import { query as phpQuery, current as currentPhpVersion } from "./php.js";

/**
 * Restart PHP-FPM and NGINX services
 *
 * @return {boolean}
 */
const restart = () => {
  const version = currentPhpVersion();
  if (!phpQuery(version, 'fpm')) return false;
  execSync(`sudo /usr/sbin/service php${version}-fpm restart`);
  execSync("sudo /usr/sbin/service nginx restart");
  return true;
};

export {
  restart
};