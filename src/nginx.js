import { execSync } from "child_process";

/**
 * Get the status of nginx
 * @returns {boolean}
 */
const status = () => {
    try {
        let status = execSync("sudo /usr/sbin/service nginx status 2> /dev/null");
        if (status) {
            return status.includes('stopped') ? 'stopped' : 'running';
        }    
    } catch (error) {
        return false;
    }
};

/**
 * Restart nginx
 * @returns {boolean}
 */
const restart = () => {
    if (status()) return false;
    if (execSync("sudo /usr/sbin/service nginx restart 2> /dev/null")) return true;
    return false;
};

export {
    status,
    restart
};