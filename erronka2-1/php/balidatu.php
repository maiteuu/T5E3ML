<?php
/**
 * Euskal Eskubaloi Federazioa - Balidazio Funtzioak
 * 
 * Fitxategi hau datuak balidatzeko funtzioak biltzen ditu.
 * Segurtasunerako balidazio guztiak hemen egiten dira.
 * 
 * Funtzioak:
 * - Required fields balidatzea
 * - Zenbakiak balidatzea
 * - Datak balidatzea
 * - Testua sanitizatzea
 * - XML egitura balidatzea
 * 
 * @author EEF
 * @version 1.0
 */

/**
 * Validar que una cadena no esté vacía
 */
function validateRequired($value, $fieldName = 'Campo') {
    if (empty(trim($value))) {
        throw new Exception($fieldName . ' ezin da hutsik egon');
    }
    return trim($value);
}

/**
 * Validar que un número sea válido
 */
function validateNumber($value, $fieldName = 'Zenbakia', $min = null, $max = null) {
    if (!is_numeric($value)) {
        throw new Exception($fieldName . ' zenbakia izan behar da');
    }
    
    $num = (int)$value;
    
    if ($min !== null && $num < $min) {
        throw new Exception($fieldName . ' ' . $min . ' baino handiagoa izan behar da');
    }
    
    if ($max !== null && $num > $max) {
        throw new Exception($fieldName . ' ' . $max . ' baino txikiagoa izan behar da');
    }
    
    return $num;
}

/**
 * Validar que sea una URL válida
 */
function validateUrl($value) {
    if (!filter_var($value, FILTER_VALIDATE_URL)) {
        throw new Exception('URL-a ez da baliozkoa');
    }
    return $value;
}

/**
 * Validar que sea una fecha válida (YYYY-MM-DD)
 */
function validateDate($value) {
    $formats = ['Y-m-d', 'Y/m/d', 'd-m-Y'];
    
    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, $value);
        if ($date !== false) {
            return $date->format('Y-m-d');
        }
    }
    
    throw new Exception('Data formatu ok ez da (Y-m-d)');
}

/**
 * Sanitizar cadena HTML
 */
function sanitizeString($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

/**
 * Registrar operación en log
 */
function logOperation($action, $data = []) {
    $logFile = __DIR__ . '/../logs/operations.log';
    
    // Crear carpeta si no existe
    if (!is_dir(dirname($logFile))) {
        mkdir(dirname($logFile), 0755, true);
    }
    
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'action' => $action,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    file_put_contents(
        $logFile,
        json_encode($logData) . "\n",
        FILE_APPEND
    );
}

/**
 * Crear respuesta JSON estándar
 */
function jsonResponse($success, $message, $data = null, $httpCode = 200) {
    http_response_code($httpCode);
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

/**
 * Crear error JSON estándar
 */
function jsonError($message, $httpCode = 400, $details = null) {
    http_response_code($httpCode);
    
    $response = [
        'success' => false,
        'error' => $message
    ];
    
    if ($details !== null) {
        $response['details'] = $details;
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

/**
 * Verificar permisos de archivo
 */
function checkFilePermissions($filePath) {
    if (!file_exists($filePath)) {
        return ['exists' => false, 'readable' => false, 'writable' => false];
    }
    
    return [
        'exists' => true,
        'readable' => is_readable($filePath),
        'writable' => is_writable($filePath)
    ];
}

/**
 * Crear copia de seguridad automática
 */
function createAutoBackup($filePath, $maxBackups = 5) {
    $backupDir = dirname($filePath) . '/.backups';
    
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $backupFile = $backupDir . '/' . basename($filePath) . '.' . date('YmdHis') . '.backup';
    
    if (!copy($filePath, $backupFile)) {
        throw new Exception('Backup automatikoa sortzea huts egin');
    }
    
    // Limpiar backups antiguos
    $backups = glob($backupDir . '/*.backup');
    if (count($backups) > $maxBackups) {
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        
        foreach (array_slice($backups, 0, count($backups) - $maxBackups) as $old) {
            unlink($old);
        }
    }
    
    return $backupFile;
}
?>
