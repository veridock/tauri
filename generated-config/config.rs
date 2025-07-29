// Auto-generated configuration from .env
// Generated at: 2025-07-29T19:11:07.229Z

use std::collections::HashMap;

pub struct AppConfig;

impl AppConfig {
    pub const VITE_PORT: &'static str = "1420";
    pub const PHP_SERVER_PORT: &'static str = "8088";
    pub const VITE_PHP_SERVER_PORT: &'static str = "8088";
    pub const VITE_FILE_PHP: &'static str = "todo.php.svg";
    pub const VITE_DEV_URL: &'static str = "http://localhost:${VITE_PORT}";
    pub const PHP_SERVER_URL: &'static str = "http://localhost:${PHP_SERVER_PORT}";
    pub const PDF_PROCESSOR_URL: &'static str = "http://localhost:${PHP_SERVER_PORT}/${VITE_FILE_PHP}";
    pub const ENABLE_VERBOSE_LOGGING: &'static str = "false";
    pub const LOG_DIRECTORY: &'static str = "logs";
    pub const NODE_ENV: &'static str = "development";

    pub fn get_all() -> HashMap<&'static str, &'static str> {
        let mut config = HashMap::new();
        config.insert("VITE_PORT", Self::VITE_PORT);
        config.insert("PHP_SERVER_PORT", Self::PHP_SERVER_PORT);
        config.insert("VITE_PHP_SERVER_PORT", Self::VITE_PHP_SERVER_PORT);
        config.insert("VITE_FILE_PHP", Self::VITE_FILE_PHP);
        config.insert("VITE_DEV_URL", Self::VITE_DEV_URL);
        config.insert("PHP_SERVER_URL", Self::PHP_SERVER_URL);
        config.insert("PDF_PROCESSOR_URL", Self::PDF_PROCESSOR_URL);
        config.insert("ENABLE_VERBOSE_LOGGING", Self::ENABLE_VERBOSE_LOGGING);
        config.insert("LOG_DIRECTORY", Self::LOG_DIRECTORY);
        config.insert("NODE_ENV", Self::NODE_ENV);
        config
    }

    pub fn get(key: &str) -> Option<&'static str> {
        match key {
            "VITE_PORT" => Some(Self::VITE_PORT),
            "PHP_SERVER_PORT" => Some(Self::PHP_SERVER_PORT),
            "VITE_PHP_SERVER_PORT" => Some(Self::VITE_PHP_SERVER_PORT),
            "VITE_FILE_PHP" => Some(Self::VITE_FILE_PHP),
            "VITE_DEV_URL" => Some(Self::VITE_DEV_URL),
            "PHP_SERVER_URL" => Some(Self::PHP_SERVER_URL),
            "PDF_PROCESSOR_URL" => Some(Self::PDF_PROCESSOR_URL),
            "ENABLE_VERBOSE_LOGGING" => Some(Self::ENABLE_VERBOSE_LOGGING),
            "LOG_DIRECTORY" => Some(Self::LOG_DIRECTORY),
            "NODE_ENV" => Some(Self::NODE_ENV),
            _ => None,
        }
    }
}
