# PHP Version Manager

## Installation

```
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
  xdebug|x [toggle] [sapi]  Manage XDebug status
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
# Enable XDebug
pvm xdebug on

# Disable XDebug
pvm xdebug off

# Enable XDebug for cli only
pvm xdebug on cli

# Disable XDebug for fpm only
pvm xdebug off fpm
```

### Restart Nginx and PHP-FPM

```bash
pvm restart
```
