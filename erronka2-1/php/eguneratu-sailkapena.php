<?php
/**
 * Euskal Eskubaloi Federazioa - Sailkapena Eguneratzeko API
 * 
 * Fitxategi hau sailkapenaren datuak eguneratzeko API-a da.
 * POST eskaerak jasotzen ditu JSON formatuan eta XML fitxategia eguneratzen du.
 * 
 * Funtzioak:
 * - Datuak balidatzea
 * - XML fitxategia eguneratzea
 * - Backup-ak egitea
 * - Erroreak kudeatzea
 * 
 * @author EEF
 * @version 1.0
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo ez onartu', 'method' => $_SERVER['REQUEST_METHOD']]);
    exit;
}

// Obtener datos JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validar datos
if (!$data || !isset($data['standings']) || !is_array($data['standings'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datuak ez dira baliozkoak']);
    exit;
}

// Ruta del archivo XML
$xmlFile = __DIR__ . '/../XML/Sailkapena.xml';
$backupFile = __DIR__ . '/../XML/Sailkapena.xml.backup';

// Verificar que el archivo existe
if (!file_exists($xmlFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'XML fitxategia ez da aurkitu']);
    exit;
}

// Crear backup
if (!copy($xmlFile, $backupFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Backup-a sortzea huts egin', 'backup_error' => true]);
    exit;
}

try {
    // Cargar XML
    $xml = new SimpleXMLElement(file_get_contents($xmlFile));
    
    // Limpiar elementos existentes
    foreach ($xml->errenkada as $entry) {
        unset($entry[0]);
    }
    
    // Agregar nuevos datos
    foreach ($data['standings'] as $standing) {
        // Validar datos requeridos
        if (!isset($standing['taldea'])) {
            throw new Exception('Taldea daturak faltan');
        }
        
        $entry = $xml->addChild('errenkada');
        $entry->addChild('taldea', htmlspecialchars($standing['taldea']));
        $entry->addChild('irudia', htmlspecialchars($standing['irudia'] ?? ''));
        $entry->addChild('irab', htmlspecialchars($standing['irab'] ?? '0'));
        $entry->addChild('gald', htmlspecialchars($standing['gald'] ?? '0'));
        $entry->addChild('pf', htmlspecialchars($standing['pf'] ?? '0'));
        $entry->addChild('kp', htmlspecialchars($standing['kp'] ?? '0'));
        
        // Calcular pnt (pf - kp)
        $pnt = (int)($standing['pf'] ?? 0) - (int)($standing['kp'] ?? 0);
        $entry->addChild('pnt', $pnt);
    }
    
    // Guardar XML con formato
    $dom = dom_import_simplexml($xml)->ownerDocument;
    $dom->formatOutput = true;
    
    if (!$dom->save($xmlFile)) {
        throw new Exception('XML fitxategia gorde ezin izan');
    }
    
    // Respuesta de éxito
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Sailkapena eguneratu egin da',
        'rows_updated' => count($data['standings'])
    ]);
    
} catch (Exception $e) {
    // Restaurar backup en caso de error
    if (file_exists($backupFile)) {
        copy($backupFile, $xmlFile);
    }
    
    http_response_code(500);
    echo json_encode([
        'error' => 'Errorea: ' . $e->getMessage(),
        'restored' => true
    ]);
}
?>
