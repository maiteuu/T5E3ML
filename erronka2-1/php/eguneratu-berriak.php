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
 * Eragiketa logika:
 * 1. HTTP metodoa egiaztatzen du (POST bakarrik)
 * 2. JSON datuak jasotzen ditu
 * 3. Beharrezko eremuak balidatzen ditu
 * 4. XML fitxategia kargatzen du
 * 5. Backup automatikoa egiten du
 * 6. Berria eguneratzen edo sortzen du
 * 7. XML fitxategia gordetzen du
 * 8. Erroreen kasuan backup-a berrezartzen du
 * 
 * @author EEF
 * @version 2.0 - Euskal komentario gehituak
 */

// HTTP goiburuak konfiguratu
// Content-Type: JSON erantzunak bidaltzeko
// Access-Control: Nabigatzailearen segurtasun politikak kudeatzeko
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

/**
 * HTTP metodoa egiaztatzen du
 * 
 * Funtzio honek eskaera metodoa egiaztatzen du:
 * - POST metodoa bakarrik onartzen du
 * - Beste metodoek 405 Method Not Allowed errorea itzultzen dute
 * - Segurtasunerako, ez da GET eskaerarik onartzen datuak aldatzeko
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo ez onartu']);
    exit;
}

/**
 * JSON datuak jasotzen ditu
 * 
 * Funtzio honek eskaeraren gorputza irakurtzen du:
 * - php://input erabiltzen du POST datuak irakurtzeko
 * - json_decode() erabiltzen du array-era bihurtzeko
 * - Erroreen kasuan false itzultzen du
 */
$input = file_get_contents('php://input');
$data = json_decode($input, true);

/**
 * JSON datuak balidatzen ditu
 * 
 * Funtzio honek jasotako datuak egiaztatzen ditu:
 * - JSON formatua baliozkoa den egiaztatzen du
 * - 400 Bad Request errorea itzultzen du formatu okerragatik
 */
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Datuak ez dira baliozkoak']);
    exit;
}

/**
 * Beharrezko eremuak balidatzen ditu
 * 
 * Funtzio honek berri baterako beharrezko eremuak egiaztatzen ditu:
 * - titulua: Berriaren izenburua (nahitaezkoa)
 * - testua: Berriaren edukia (nahitaezkoa)
 * - Beste eremuak aukerakoak dira
 */
if (!isset($data['titulua']) || !isset($data['testua'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Titulua eta testua derrigortuak dira']);
    exit;
}

/**
 * XML fitxategien bideak definitzen ditu
 * 
 * - xmlFile: Berrien datuak gordetzeko XML fitxategia
 * - backupFile: Segurtasun kopia gordetzeko fitxategia
 */
$xmlFile = __DIR__ . '/../XML/berriak.xml';
$backupFile = __DIR__ . '/../XML/berriak.xml.backup';

/**
 * XML fitxategia existitzen den egiaztatzen du
 * 
 * Funtzio honek fitxategia existitzen den egiaztatzen du:
 * - 404 Not Found errorea itzultzen du ez bada existitzen
 * - Fitxategiaren bidea absolutua da (__DIR__ erabiliz)
 */
if (!file_exists($xmlFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'XML fitxategia ez da aurkitu']);
    exit;
}

/**
 * Backup automatikoa sortzen du
 * 
 * Funtzio honek segurtasun kopia bat sortzen du:
 * - Jatorrizko fitxategia .backup luzapenarekin kopiatzen du
 * - 500 Internal Server Error errorea itzultzen du huts egitean
 * - Hau da garrantzitsua erroreen kasuan datuak berreskuratzeko
 */
if (!copy($xmlFile, $backupFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Backup-a sortzea huts egin']);
    exit;
}

    /**
     * Berriaren datuak prozesatzen ditu
     * 
     * Bloke honek bi aukera posibleak kudeatzen ditu:
     * 1. Berri existentea eguneratzea (ID-a badago)
     * 2. Berri berria sortzea (ID-a ez badago)
     */
    try {
        $xml = new SimpleXMLElement(file_get_contents($xmlFile));
        
        /**
         * Berri existentea eguneratzen du
         * 
         * ID-a badago, berri hori bilatu eta eguneratzen du:
         * - XPath erabiltzen du berria bilatzeko
         * - Eremu guztiak eguneratzen ditu (titulua, testua, etab.)
         * - htmlspecialchars() erabiltzen du segurtasunerako
         */
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
            /**
             * Berri berria sortzen du
             * 
             * ID-a ez badago, berri berria sortzen du:
             * 1. Berriaren ID-a kalkulatzen du (maximoa + 1)
             * 2. <berria> elementua sortzen du
             * 3. Eremu guztiak gehitzen dizkio
             * 4. Gaurko data ezartzen du ez badago
             */
            $entry = $xml->addChild('berria');
            
            // Berriaren ID-a kalkulatu
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
    
        /**
         * XML fitxategia gordetzen du
         * 
         * Funtzio honek XML fitxategia diskoan gordetzen du:
         * 1. SimpleXMLElement DOM dokumentura bihurtzen du
         * 2. Formatu egokia ezartzen du (formatOutput = true)
         * 3. Fitxategian gordetzen du
         * 4. Errorea kontrolatzen du
         */
        $dom = dom_import_simplexml($xml)->ownerDocument;
        $dom->formatOutput = true;
        
        if (!$dom->save($xmlFile)) {
            throw new Exception('XML fitxategia gorde ezin izan');
        }
        
        /**
         * Erantzun arrakastatsua bidaltzen du
         * 
         * Erantzun honek operazioaren emaitza adierazten du:
         * - success: true
         * - message: Berria sortu/eguneratu mezua
         * - action: create edo update
         */
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $action === 'create' ? 'Berria sortu egin da' : 'Berriak eguneratu egin dira',
            'action' => $action
        ]);
    
    } catch (Exception $e) {
        /**
         * Erroreen kudeaketa
         * 
         * Erroren kasuan:
         * 1. Backup fitxategia berrezartzen du
         * 2. 500 Internal Server Error errorea bidaltzen du
         * 3. Errorearen mezua eta berreskuratze egoera adierazten du
         */
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
