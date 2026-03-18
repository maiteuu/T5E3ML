<?php
/**
 * Guardar registro de clasificación - Optimizado
 * Guarda una temporada/registro de resultados en XML/sailkapena-egutegia.xml
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

// Validar datos requeridos
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'JSON ez baliozkoa']);
    exit;
}

if (empty($data['izena']) || empty($data['sailkapena'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Izena eta sailkapena derrigortuak']);
    exit;
}

if (!is_array($data['sailkapena']) || count($data['sailkapena']) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Sailkapena array bat debe da']);
    exit;
}

$xmlFile = __DIR__ . '/../XML/sailkapena-egutegia.xml';

if (!file_exists($xmlFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'XML fitxategia ez da aurkitu']);
    exit;
}

try {
    // Leer XML existente
    $xmlContent = file_get_contents($xmlFile);
    if ($xmlContent === false) {
        throw new Exception('XML irakurketa huts egin');
    }
    
    $xml = new SimpleXMLElement($xmlContent);
    
    // Calcular nueva ID rápidamente
    $maxId = 0;
    foreach ($xml->egutegi as $egutegi) {
        $id = (int)$egutegi->id;
        if ($id > $maxId) $maxId = $id;
    }
    $newId = $maxId + 1;
    
    // Crear nuevo registro
    $egutegi = $xml->addChild('egutegi');
    $egutegi->addChild('id', $newId);
    $egutegi->addChild('izena', htmlspecialchars($data['izena'], ENT_XML1));
    $egutegi->addChild('data', htmlspecialchars($data['data'] ?? date('Y-m-d'), ENT_XML1));
    
    // Agregar datos de clasificación usando el nuevo formato (irab, gald, pf, kp)
    $sailkapenaNode = $egutegi->addChild('sailkapena');
    
    foreach ($data['sailkapena'] as $taldea) {
        // Validar cada equipo
        $equipoName = $taldea['taldea'] ?? $taldea['nombre'] ?? null;
        if (empty($equipoName)) continue;
        
        $taldeNode = $sailkapenaNode->addChild('errenkada');
        $taldeNode->addChild('taldea', htmlspecialchars($equipoName, ENT_XML1));
        
        // Agregar imagen si está disponible
        if (!empty($taldea['irudia'])) {
            $taldeNode->addChild('irudia', htmlspecialchars($taldea['irudia'], ENT_XML1));
        }
        
        // Usar nuevo formato: irab, gald, pf, kp
        $taldeNode->addChild('irab', (int)($taldea['irab'] ?? 0));
        $taldeNode->addChild('gald', (int)($taldea['gald'] ?? 0));
        $taldeNode->addChild('pf', (int)($taldea['pf'] ?? 0));
        $taldeNode->addChild('kp', (int)($taldea['kp'] ?? 0));
        
        // Calcular pnt (pf - kp)
        $pnt = (int)($taldea['pf'] ?? 0) - (int)($taldea['kp'] ?? 0);
        $taldeNode->addChild('pnt', $pnt);
    }
    
    // Guardar sin formato (más rápido)
    if ($xml->asXML($xmlFile) === false) {
        throw new Exception('XML gorde ezin izan');
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => htmlspecialchars($data['izena']) . ' gorde egin da',
        'id' => $newId
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Errorea: ' . $e->getMessage()
    ]);
}
