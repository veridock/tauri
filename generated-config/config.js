// Auto-generated configuration from .env
// Generated at: 2025-07-29T19:11:07.228Z

window.AppConfig = {
    VITE_PORT: "1420",
    PHP_SERVER_PORT: "8088",
    VITE_PHP_SERVER_PORT: "8088",
    VITE_FILE_PHP: "todo.php.svg",
    VITE_DEV_URL: "http://localhost:${VITE_PORT}",
    PHP_SERVER_URL: "http://localhost:${PHP_SERVER_PORT}",
    PDF_PROCESSOR_URL: "http://localhost:${PHP_SERVER_PORT}/${VITE_FILE_PHP}",
    ENABLE_VERBOSE_LOGGING: "false",
    LOG_DIRECTORY: "logs",
    NODE_ENV: "development"
};

// Export for ES modules
export default window.AppConfig;
console.log('✅ AppConfig loaded:', window.AppConfig);
