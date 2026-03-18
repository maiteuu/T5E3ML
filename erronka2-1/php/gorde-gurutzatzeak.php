<?php
/**
 * Guardar cambios en Tarteak (Cruces) - Optimizado
 * Solo actualiza los registros que han cambiado
 */

// Establecer headers ANTES de cualquier salida
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Asegurar que no hay buffer output
ob_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metodo ez onartu']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['cruces'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Tarteak datuak falta dira']);
    exit;
}

// Fitxategiaren ibilbidea (proiektuan erabiltzen den izena: Gurutzatzeak.xml)
$xmlFile = __DIR__ . '/../XML/Gurutzatzeak.xml';
$backupFile = __DIR__ . '/../XML/Gurutzatzeak.xml.backup';

try {
    // Cargar XML actual
    if (!file_exists($xmlFile)) {
        throw new Exception('Tarteak fitxategia ez dago: ' . $xmlFile);
    }
    
    $xmlContent = file_get_contents($xmlFile);
    if (!$xmlContent) {
        throw new Exception('Ezin dira Tarteak fitxategia irakurri');
    }
    
    $xml = new SimpleXMLElement($xmlContent);
    
    // Hacer backup veloz
    if (!copy($xmlFile, $backupFile)) {
        throw new Exception('Backupa egitean arazoa');
    }
    
    // Procesar cambios
    $cruces = $data['cruces'];
    $updated = 0;
    
    foreach ($cruces as $cruce) {
        if (!isset($cruce['equipo1'], $cruce['equipo2'], $cruce['goles1'], $cruce['goles2'])) {
            continue;
        }
        
        // Buscar y actualizar este enfrentamiento específico
        foreach ($xml->enfrentamiento as $enf) {
            if ((string)$enf->equipo1 === $cruce['equipo1'] && 
                (string)$enf->equipo2 === $cruce['equipo2']) {
                $enf->goles1 = (int)$cruce['goles1'];
                $enf->goles2 = (int)$cruce['goles2'];
                $updated++;
                break;
            }
        }
    }
    
    // Guardar cambios de forma eficiente
    if (!$xml->asXML($xmlFile)) {
        throw new Exception('Tarteak fitxategia gordetzean arazoa');
    }
    
    ob_end_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Tarteak gordeta',
        'updated' => $updated
    ]);
    
} catch (Exception $e) {
    // Restaurar backup en caso de error
    if (file_exists($backupFile)) {
        @copy($backupFile, $xmlFile);
    }
    
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'restored' => true
    ]);
}
exit;
?>

