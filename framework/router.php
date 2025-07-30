<?php
/**
 * PHP Built-in Server Router for SVG+PHP files
 * Enables PHP execution in .svg files for Tauri SVG Processor
 * Includes CORS headers for cross-origin requests
 */

// Add CORS headers to allow cross-origin requests from Vite dev server
header('Access-Control-Allow-Origin: http://localhost:1420');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the requested URI
$uri = $_SERVER['REQUEST_URI'];
$parsed = parse_url($uri);
$path = $parsed['path'];

// Remove query string for file path
$file_path = ltrim($path, '/');

// Check if the requested file exists
if (!file_exists($file_path)) {
    // Return 404 for non-existent files
    http_response_code(404);
    echo "File not found: $file_path";
    return false;
}

// Check if it's an SVG file with potential PHP code
if (pathinfo($file_path, PATHINFO_EXTENSION) === 'svg') {
    // Read the file content
    $content = file_get_contents($file_path);
    
    // Check if it contains PHP code
    if (strpos($content, '<?php') !== false) {
        // Set proper content type for SVG
        header('Content-Type: image/svg+xml; charset=utf-8');
        
        // Enable output buffering to capture PHP execution
        ob_start();
        
        // Execute the SVG file as PHP
        include $file_path;
        
        // Get the processed content
        $processed_content = ob_get_clean();
        
        // Output the processed SVG
        echo $processed_content;
        return true;
    }
}

// For other file types or SVG without PHP, serve normally
$mime_types = [
    'svg' => 'image/svg+xml',
    'html' => 'text/html',
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'php' => 'text/html'
];

$extension = pathinfo($file_path, PATHINFO_EXTENSION);
$content_type = $mime_types[$extension] ?? 'application/octet-stream';

header("Content-Type: $content_type");

// For PHP files, execute them
if ($extension === 'php') {
    include $file_path;
} else {
    // For static files, serve them directly
    readfile($file_path);
}

return true;
?>
