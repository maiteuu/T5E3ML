<?php
/**
 * Actualizar equipos XML
 * Recibe datos JSON y actualiza XML/Taldeak.xml
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo ez onartu']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['teams']) || !is_array($data['teams'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datuak ez dira baliozkoak']);
    exit;
}

$xmlFile = __DIR__ . '/../XML/Taldeak.xml';
$backupFile = __DIR__ . '/../XML/Taldeak.xml.backup';

if (!file_exists($xmlFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'XML fitxategia ez da aurkitu']);
    exit;
}

// Crear backup
if (!copy($xmlFile, $backupFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Backup-a sortzea huts egin']);
    exit;
}

try {
    $xml = new SimpleXMLElement(file_get_contents($xmlFile));
    
    // Limpiar elementos
    $xml->taldea = null;
    
    // Agregar nuevos datos
    foreach ($data['teams'] as $team) {
        if (!isset($team['izena'])) {
            throw new Exception('Taldearenaren izena falta');
        }
        
        $entry = $xml->addChild('taldea');
        $entry->addChild('id', htmlspecialchars($team['id'] ?? uniqid()));
        $entry->addChild('izena', htmlspecialchars($team['izena']));
        $entry->addChild('hiriharra', htmlspecialchars($team['hiriharra'] ?? ''));
        $entry->addChild('entzulea', htmlspecialchars($team['entzulea'] ?? ''));
        $entry->addChild('irudia', htmlspecialchars($team['irudia'] ?? ''));
        $entry->addChild('liga', htmlspecialchars($team['liga'] ?? 'ELF'));
        $entry->addChild('urtea', htmlspecialchars($team['urtea'] ?? date('Y')));
        
        // Agregar jugadores si existen
        if (isset($team['players']) && is_array($team['players'])) {
            $playersNode = $entry->addChild('players');
            foreach ($team['players'] as $player) {
                $playerNode = $playersNode->addChild('player');
                $playerNode->addChild('izena', htmlspecialchars($player['izena'] ?? ''));
                $playerNode->addChild('dortsala', htmlspecialchars($player['dortsala'] ?? ''));
                $playerNode->addChild('posizioa', htmlspecialchars($player['posizioa'] ?? ''));
            }
        }
    }
    
    $dom = dom_import_simplexml($xml)->ownerDocument;
    $dom->formatOutput = true;
    
    if (!$dom->save($xmlFile)) {
        throw new Exception('XML fitxategia gorde ezin izan');
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Taldeak eguneratu egin dira',
        'teams_updated' => count($data['teams'])
    ]);
    
} catch (Exception $e) {
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
