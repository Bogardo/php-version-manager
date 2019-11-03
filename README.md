# PHP Version Manager

<a href="https://www.npmjs.com/package/php-version-manager"><img src="https://img.shields.io/npm/v/php-version-manager.svg?style=flat-square" alt="NPM"></a>
<a href="https://npmcharts.com/compare/php-version-manager?minimal=true"><img src="https://img.shields.io/npm/dt/php-version-manager.svg?style=flat-square" alt="NPM"></a>
<a href="https://www.npmjs.com/package/php-version-manager"><img src="https://img.shields.io/npm/l/php-version-manager.svg?style=flat-square" alt="NPM"></a>

## Installation

```bash
npm install --global php-version-manager
```

## Usage

```bash
pvm --help

# output
Usage: pvm [options] [command]

PHP Version Manager version x.x.x

Options:
  -v, --version             Output the current application version
  -h, --help                output usage information

Commands:
  status|s                  Show current PHP version status
  ls                        List available PHP versions
  use|u <version>           Switch PHP version
  xdebug|x [sapi] [status]  Manage XDebug status
  restart|r                 Restart PHP-FPM and NGINX

```

### Status

Show current PHP version and XDebug status

```bash
pvm status

# output
PHP Version Manager version x.x.x

PHP: 7.3   CLI: OFF   FPM: OFF
```

### List versions

List installed PHP versions

```bash
pvm ls

# output
5.6
7.0
7.1
7.2
7.3
```

### Switch PHP version

```
pvm use 7.2
```

### Manage XDebug

```bash
# Toggle XDebug for cli and fpm
pvm xdebug

# Enable XDebug for cli and fpm
pvm xdebug on

# Disable XDebug for cli and fpm
pvm xdebug off

# Enable XDebug for cli only
pvm xdebug cli on

# Disable XDebug for fpm only
pvm xdebug fpm off

# Toggle XDebug for cli
pvm xdebug cli

# Toggle XDebug for fpm
pvm xdebug fpm
```

### Restart Nginx and PHP-FPM

```bash
pvm restart
```
