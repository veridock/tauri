<?php
// Auto-generated configuration from .env
// Generated at: 2025-07-29T19:11:07.229Z

class AppConfig {
    public static $VITE_PORT = "1420";
    public static $PHP_SERVER_PORT = "8088";
    public static $VITE_PHP_SERVER_PORT = "8088";
    public static $VITE_FILE_PHP = "todo.php.svg";
    public static $VITE_DEV_URL = "http://localhost:${VITE_PORT}";
    public static $PHP_SERVER_URL = "http://localhost:${PHP_SERVER_PORT}";
    public static $PDF_PROCESSOR_URL = "http://localhost:${PHP_SERVER_PORT}/${VITE_FILE_PHP}";
    public static $ENABLE_VERBOSE_LOGGING = "false";
    public static $LOG_DIRECTORY = "logs";
    public static $NODE_ENV = "development";

    /**
     * Get all configuration as array
     */
    public static function getAll() {
        return [
            'VITE_PORT' => self::$VITE_PORT,
            'PHP_SERVER_PORT' => self::$PHP_SERVER_PORT,
            'VITE_PHP_SERVER_PORT' => self::$VITE_PHP_SERVER_PORT,
            'VITE_FILE_PHP' => self::$VITE_FILE_PHP,
            'VITE_DEV_URL' => self::$VITE_DEV_URL,
            'PHP_SERVER_URL' => self::$PHP_SERVER_URL,
            'PDF_PROCESSOR_URL' => self::$PDF_PROCESSOR_URL,
            'ENABLE_VERBOSE_LOGGING' => self::$ENABLE_VERBOSE_LOGGING,
            'LOG_DIRECTORY' => self::$LOG_DIRECTORY,
            'NODE_ENV' => self::$NODE_ENV
        ];
    }

    /**
     * Get configuration value by key
     */
    public static function get($key, $default = null) {
        $config = self::getAll();
        return isset($config[$key]) ? $config[$key] : $default;
    }
}

// Make variables available globally
define('VITE_PORT', '1420');
define('PHP_SERVER_PORT', '8088');
define('VITE_PHP_SERVER_PORT', '8088');
define('VITE_FILE_PHP', 'todo.php.svg');
define('VITE_DEV_URL', 'http://localhost:${VITE_PORT}');
define('PHP_SERVER_URL', 'http://localhost:${PHP_SERVER_PORT}');
define('PDF_PROCESSOR_URL', 'http://localhost:${PHP_SERVER_PORT}/${VITE_FILE_PHP}');
define('ENABLE_VERBOSE_LOGGING', 'false');
define('LOG_DIRECTORY', 'logs');
define('NODE_ENV', 'development');

error_log('✅ AppConfig loaded with ' . count(AppConfig::getAll()) . ' variables');
?>