<?php
// Archivo de debug para verificar que PHP funciona
header('Content-Type: application/json; charset=UTF-8');

// Asegurar que no hay salida previa
ob_start();

try {
    // Test 1: ¿Funciona PHP?
    $test1 = "PHP funciona correctamente";
    
    // Test 2: ¿Existe el archivo Cruces.xml?
    $xmlFile = __DIR__ . '/../XML/Cruces.xml';
    $test2 = file_exists($xmlFile) ? "Cruces.xml existe" : "Cruces.xml NO EXISTE";
    
    // Test 3: ¿Se puede leer?
    $test3 = is_readable($xmlFile) ? "Cruces.xml es legible" : "Cruces.xml NO es legible";
    
    // Test 4: ¿POST data?
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $test4 = $data ? "POST JSON recibido" : "POST JSON vacío";
    
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'debug' => [
            'php_works' => $test1,
            'xml_exists' => $test2,
            'xml_readable' => $test3,
            'post_data' => $test4,
            'received_cruces' => isset($data['cruces']) ? count($data['cruces']) . " items" : "Sin cruces"
        ]
    ]);
    
} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
