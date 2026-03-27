<?php
/**
 * Actualizar archivo Sailkapena.xml con nuevo contenido
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metodo ez onartu']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['content'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Edukia falta da']);
    exit;
}

$xmlFile = __DIR__ . '/../XML/Sailkapena.xml';
$backupFile = __DIR__ . '/../XML/Sailkapena.xml.backup';

try {
    // Hacer backup
    if (file_exists($xmlFile)) {
        copy($xmlFile, $backupFile);
    }
    
    // Escribir nuevo contenido
    $bytes = file_put_contents($xmlFile, $data['content']);
    
    if ($bytes === false) {
        throw new Exception('Fitxategia gorde ezin izan');
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Sailkapena eguneratu egin da',
        'bytes_written' => $bytes
    ]);
    
} catch (Exception $e) {
    // Restaurar backup
    if (file_exists($backupFile)) {
        copy($backupFile, $xmlFile);
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Errorea: ' . $e->getMessage(),
        'restored' => true
    ]);
}
?>
