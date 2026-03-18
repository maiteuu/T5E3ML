# PHP API - EEF Website

## Descripción

Este directorio contiene los scripts PHP que manejan las operaciones de actualización de datos XML. 

## Archivos

### update-standings.php
**Endpoint:** `POST /php/update-standings.php`

Actualiza la clasificación (Sailkapena.xml)

**Formato de entrada:**
```json
{
  "standings": [
    {
      "posizioa": 1,
      "taldea": "Ameztoi Zarautz ZKE",
      "irudia": "Irudiak/Taldeak/...",
      "jp": 12,
      "i": 10,
      "b": 1,
      "g": 250,
      "gd": "+45",
      "pnt": 21
    }
  ]
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Sailkapena eguneratu egin da",
  "rows_updated": 6
}
```

---

### update-teams.php
**Endpoint:** `POST /php/update-teams.php`

Actualiza los equipos (Taldeak.xml)

**Formato de entrada:**
```json
{
  "teams": [
    {
      "id": "equipo1",
      "izena": "Ameztoi Zarautz ZKE",
      "hiriharra": "Zarautz",
      "entzulea": "2000",
      "irudia": "Irudiak/Taldeak/...",
      "liga": "ELF",
      "urtea": 2025,
      "players": [
        {
          "izena": "Jokin Gomez",
          "dortsala": "1",
          "posizioa": "Portero"
        }
      ]
    }
  ]
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Taldeak eguneratu egin dira",
  "teams_updated": 6
}
```

---

### update-news.php
**Endpoint:** `POST /php/update-news.php`

Actualiza las noticias (berriak.xml)

**Formato para crear noticia:**
```json
{
  "titulua": "Título de la noticia",
  "testua": "Contenido de la noticia",
  "kategoria": "Txapelketa",
  "irudia": "Irudiak/Hasierako Berriak/...",
  "data": "2025-03-10"
}
```

**Formato para actualizar noticia:**
```json
{
  "id": 1,
  "titulua": "Título actualizado",
  "testua": "Contenido actualizado",
  "kategoria": "Formakuntza",
  "irudia": "Irudiak/...",
  "data": "2025-03-10"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Berriak eguneratu egin dira",
  "action": "create"
}
```

---

## Características de Seguridad

### 1. Validación de Datos
- Sanitización de entrada con `htmlspecialchars()`
- Validación de tipos de datos
- Validación de rangos numéricos
- Validación de fechas

### 2. Copias de Seguridad
- Backup automático antes de cada actualización
- Restauración automática en caso de error
- Historial de cambios en `.backups/`

### 3. Control de Errores
- Try-catch en todas las operaciones
- Mensajes de error descriptivos
- HTTP status codes correctos

### 4. Logging
- Registro de todas las operaciones en `logs/operations.log`
- Información del usuario, IP, timestamp
- Datos de cambios realizados

## Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Operación exitosa |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Archivo XML no encontrado |
| 405 | Method Not Allowed - Solo POST permitido |
| 500 | Internal Server Error - Error del servidor |

## Integración con Frontend

Los scripts se llaman desde `script/admin-functions.js` usando `fetch()`:

```javascript
const response = await fetch('php/update-standings.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        standings: data
    })
});

const result = await response.json();
if (result.success) {
    alert('Cambios guardados');
} else {
    alert('Error: ' + result.error);
}
```

## Requisitos del Servidor

- PHP 7.0+
- Permisos de lectura/escritura en:
  - `XML/` - Directorio de archivos XML
  - `logs/` - Directorio de logging

## Estructura de Directorios

```
php/
├── update-standings.php    # Actualizar clasificación
├── update-teams.php        # Actualizar equipos
├── update-news.php         # Actualizar noticias
├── validate.php            # Funciones de validación
└── README.md              # Este archivo

../XML/
├── Sailkapena.xml         # Clasificación
├── Taldeak.xml            # Equipos
├── berriak.xml            # Noticias
├── .backups/              # Copias de seguridad

../logs/
└── operations.log         # Registro de operaciones
```

## Notas de Desarrollo

- Todos los mensajes de error están en euskera
- Los datos se sanitizan automáticamente
- Las backups se crean automáticamente
- Los IDs de noticias se generan automáticamente
- Las fechas se validan en formato YYYY-MM-DD
