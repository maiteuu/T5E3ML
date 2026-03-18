<?php
/**
 * Euskal Eskubaloi Federazioa - Berriak Eguneratzeko API
 * 
 * Fitxategi hau berrien datuak eguneratzeko API-a da.
 * POST eskaerak jasotzen ditu JSON formatuan eta XML fitxategia eguneratzen du.
 * 
 * Funtzioak:
 * - Berriak sortzea, eguneratzea eta ezabatzea
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo ez onartu']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Datuak ez dira baliozkoak']);
    exit;
}

// Validar campos requeridos
if (!isset($data['titulua']) || !isset($data['testua'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Titulua eta testua derrigortuak dira']);
    exit;
}

$xmlFile = __DIR__ . '/../XML/berriak.xml';
$backupFile = __DIR__ . '/../XML/berriak.xml.backup';

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
    
    // Si es una actualización de noticia existente (tiene ID)
    if (isset($data['id']) && !empty($data['id'])) {
        $newsId = (int)$data['id'];
        $newsItems = $xml->xpath("//berria[id=$newsId]");
        
        if (count($newsItems) > 0) {
            $news = $newsItems[0];
            $news->titulua = htmlspecialchars($data['titulua'] ?? '');
            $news->testua = htmlspecialchars($data['testua'] ?? '');
            $news->kategoria = htmlspecialchars($data['kategoria'] ?? 'Berriak');
            $news->irudia = htmlspecialchars($data['irudia'] ?? '');
            $news->data = htmlspecialchars($data['data'] ?? date('Y-m-d'));
            $action = 'update';
        } else {
            throw new Exception('Berriak ez da aurkitu ID-rekin: ' . $newsId);
        }
    } else {
        // Nueva noticia
        $entry = $xml->addChild('berria');
        
        // Calcular nueva ID
        $maxId = 0;
        foreach ($xml->xpath('//berria/id') as $id) {
            $maxId = max($maxId, (int)$id);
        }
        
        $entry->addChild('id', $maxId + 1);
        $entry->addChild('titulua', htmlspecialchars($data['titulua'] ?? ''));
        $entry->addChild('testua', htmlspecialchars($data['testua'] ?? ''));
        $entry->addChild('irudia', htmlspecialchars($data['irudia'] ?? ''));
        $entry->addChild('kategoria', htmlspecialchars($data['kategoria'] ?? 'Berriak'));
        $entry->addChild('data', htmlspecialchars($data['data'] ?? date('Y-m-d')));
        $action = 'create';
    }
    
    // Guardar con formato
    $dom = dom_import_simplexml($xml)->ownerDocument;
    $dom->formatOutput = true;
    
    if (!$dom->save($xmlFile)) {
        throw new Exception('XML fitxategia gorde ezin izan');
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $action === 'create' ? 'Berria sortu egin da' : 'Berriak eguneratu egin dira',
        'action' => $action
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
