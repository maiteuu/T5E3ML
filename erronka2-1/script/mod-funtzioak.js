/**
 * Admin Functions - Funcionalidades de administración
 * Permite a los usuarios administradores editar contenido
 */

// Modal Management Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });
});

// Cerrar modal con botón Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach(modal => {
            modal.classList.remove("active");
        });
    }
});

/**
 * Mapeo de nombres de equipos a imágenes
 */
const teamImageMap = {
    'Ameztoi Zarautz ZKE': 'Irudiak/Taldeak/Ameztoi Zarautz zke.jpg',
    'Berango Urduliz Eskubaloia': 'Irudiak/Taldeak/Berango_Urduliz_Eskubaloia.jpg',
    'Construcciones Ugarte Aloña Mendi K.E': 'Irudiak/Taldeak/ALONA MENDI KIROL ELKARTEA.jpg',
    'Irauli-Bosteko': 'Irudiak/Taldeak/Irauli-Bosteko.jpg',
    'Kukullaga Etxebarri': 'Irudiak/Taldeak/EscudoKukuHD.jpg',
    'San Adrian': 'Irudiak/Taldeak/San Adrian.jpg'
};

/**
 * Obtener la imagen correcta de un equipo basándose en el nombre
 * Si no encuentra coincidencia exacta, intenta una búsqueda parcial
 */
function obtenerImagenEquipo(nombreEquipo) {
    // Buscar coincidencia exacta
    if (teamImageMap[nombreEquipo]) {
        return teamImageMap[nombreEquipo];
    }
    
    // Buscar coincidencia parcial
    for (const [nombre, imagen] of Object.entries(teamImageMap)) {
        if (nombre.includes(nombreEquipo) || nombreEquipo.includes(nombre)) {
            return imagen;
        }
    }
    
    // Si no encuentra nada, retornar vacío
    return "";
}

// Admin Edit Functions for Different Sections

/**
 * Función auxiliar para realizar fetch de JSON de forma segura
 * Maneja errores de servidor y respuestas que no son JSON (como archivos PHP devueltos como texto)
 */
async function safeFetchJson(url, options) {
    try {
        const response = await fetch(url, options);
        const text = await response.text();
        
        // Detección de errores PHP y servidor
        if (text.trim().startsWith("<?php")) {
            console.error("PHP kodea itzulia da, ez JSON. Zerbitzaria PHP onartu dezakela egiaztatu.");
            throw new Error("Zerbitzaria ez dago PHP onartzen. Abian dago http://localhost motara? (ez file://)");
        }
        
        if (text.trim().toLowerCase().startsWith("<!doctype") || text.trim().startsWith("<html")) {
            console.error("HTML itzulia da jarraipena ez da badaezpaduz PHP:", text.substring(0, 200));
            throw new Error("Zerbitzaria HTML itzuli du PHP JSON beharrean. Itxura du PHP ez duela onartzen.");
        }
        
        if (response.status !== 200 && !response.ok) {
            console.error(`HTTP ${response.status}:`, text);
            throw new Error(`HTTP Error ${response.status}: ${text.substring(0, 100)}`);
        }
        
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("JSON ez da baliozkoa. Jasotakoa:", text.substring(0, 200));
            throw new Error("Zerbitzariaren erantzuna ez da JSON baliozkoa: " + text.substring(0, 80));
        }
    } catch (error) {
        throw error;
    }
}

function eefUrl(pathRelativeToRoot) {
    const base = window.eefPaths?.base ?? "";
    return base + pathRelativeToRoot;
}

function editTeam(teamId) {
    if (!isAdmin()) {
        alert("Solo los administradores pueden editar contenido");
        return;
    }
    openModal("teamEditModal");
    console.log("Editando equipo:", teamId);
}

// Guardar cambios usando PHP
async function saveStandingsChanges() {
    const standingsData = document.getElementById("standingsData")?.value;
    
    if (!standingsData) {
        alert("Mesedez bete eremu guztiak");
        return;
    }
    
    try {
        // Parsear JSON
        const standings = JSON.parse(standingsData);
        
        if (!Array.isArray(standings)) {
            alert("Nire datuak array bat debe da");
            return;
        }
        
        // Mostrar indicador de carga
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gordetzen...';
        
        // Llamar al PHP de forma segura
        const result = await safeFetchJson(eefUrl('php/eguneratu-sailkapena.php'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ standings: standings })
        });
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (result.success) {
            alert(result.message + ' (' + result.rows_updated + ' errenkada)');
            closeModal("standingsEditModal");
            // Recargar página para ver cambios
            location.reload();
        } else {
            alert('Errorea: ' + (result.error || 'Ezezaguna'));
            if (result.restored) {
                alert('Datuak itzuli egin dira aurreko egoerara');
            }
        }
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        console.error('Error:', error);
    }
}

async function saveTeamChanges() {
    const teamName = document.getElementById("teamName")?.value;
    const teamImage = document.getElementById("teamImage")?.value;
    
    if (!teamName) {
        alert("Mesedez bete taldearenaren izena");
        return;
    }
    
    try {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gordetzen...';
        
        const result = await safeFetchJson(eefUrl('php/eguneratu-taldeak.php'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teams: [{
                    izena: teamName,
                    irudia: teamImage
                }]
            })
        });
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (result.success) {
            alert(result.message);
            closeModal("teamEditModal");
            location.reload();
        } else {
            alert('Errorea: ' + (result.error || 'Ezezaguna'));
        }
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        console.error('Error:', error);
    }
}

async function saveNewsChanges() {
    const newsId = document.getElementById("newsId")?.value;
    const newsTitle = document.getElementById("newsTitle")?.value;
    const newsDate = document.getElementById("newsDate")?.value;
    const newsImage = document.getElementById("newsImage")?.value;
    const newsDescription = document.getElementById("newsDescription")?.value;
    const newsAuthor = document.getElementById("newsAuthor")?.value;
    
    if (!newsTitle || !newsDescription) {
        alert("Mesedez bete izenburua eta deskribapena");
        return;
    }
    
    try {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gordetzen...';
        
        // Preparar datos - usar solo ID si está editando, no incluir para crear
        const newsData = {
            titulua: newsTitle,
            testua: newsDescription,
            irudia: newsImage,
            data: newsDate || new Date().toISOString().split('T')[0],
            kategoria: "Berriak"  // Categoría por defecto
        };
        
        // Si tiene ID, es actualización; si no, es creación
        if (newsId) {
            newsData.id = newsId;
        }
        
        const response = await safeFetchJson(eefUrl('php/eguneratu-berriak.php'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        });
        
        const result = response;
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        if (result.success) {
            alert(result.message);
            closeModal("newsEditModal");
            location.reload();
        } else {
            alert('Errorea: ' + (result.error || 'Ezezaguna'));
        }
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        console.error('Error:', error);
    }
}

// Agregar indicador visual de permisos admin en elementos editables
document.addEventListener("DOMContentLoaded", () => {
    if (isAdmin()) {
        const editableElements = document.querySelectorAll("[data-editable]");
        editableElements.forEach(element => {
            element.style.cursor = "pointer";
            element.title = "Haz clic para editar";
            element.classList.add("editable-admin");
        });
    }
    
    // Cargar registros guardados si estamos en Sailkapena
    const page = window.location.pathname.split("/").pop();
    if (page === "Sailkapena.html") {
        recargarRegistros();
    }
});

// ===== GESTIÓN DE CLASIFICACIONES GUARDADAS =====

/**
 * Habilitar edición de la tabla de clasificación (Admin)
 * Solo permite editar las columnas: Irab., Gald., PF, KP
 */
function habilitarEdicion() {
    if (!isAdmin()) {
        alert("Solo los administradores pueden editar");
        return;
    }
    
    const table = document.querySelector(".standings-table-wrapper table");
    if (!table) {
        alert("Taula ez da aurkitu");
        return;
    }
    
    // Obtener solo las celdas editables (data-field)
    const editableCells = table.querySelectorAll("td[data-field]");
    editableCells.forEach(cell => {
        if (!cell.querySelector("input")) {
            const originalValue = cell.textContent.trim();
            const input = document.createElement("input");
            input.type = "number";
            input.value = originalValue;
            input.style.width = "100%";
            input.style.padding = "5px";
            input.style.borderRadius = "3px";
            input.style.border = "1px solid #990000";
            input.addEventListener("change", recalcularFila);
            cell.textContent = "";
            cell.appendChild(input);
        }
    });
    
    alert("Taula edita daiteke orain. Irab., Gald., PF eta KP zutabeak aldatu ditzakezu.");
}

/**
 * Recalcular los valores de una fila cuando se edita
 */
function recalcularFila(event) {
    const cell = event.target.closest("td");
    const row = cell.closest("tr");
    
    // Obtener los valores editables
    const cells = row.querySelectorAll("td");
    
    // Indices: 0=posicion, 1=equipo, 2=irab, 3=gald, 4=pf, 5=kp, 6=pt, 7=punt
    const getValue = (cellIndex) => {
        const input = cells[cellIndex].querySelector("input");
        return input ? parseInt(input.value) || 0 : parseInt(cells[cellIndex].textContent) || 0;
    };
    
    const irab = getValue(2);
    const gald = getValue(3);
    const pf = getValue(4);
    const kp = getValue(5);
    
    // Calcular PT (irab + gald)
    const pt = irab + gald;
    cells[6].textContent = pt;
    
    // Calcular Punt. (pf - kp)
    const punt = pf - kp;
    cells[7].textContent = punt;
}

/**
 * Recolectar datos de la tabla actual
 * Captura todos los datos en el formato nuevo (irab, gald, pf, kp)
 */
function recolectarDatosTabla() {
    const rows = document.querySelectorAll(".standings-table-wrapper table tbody tr");
    if (rows.length === 0) return null;
    
    const datos = [];
    
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 8) {
            try {
                const getValue = (cell) => {
                    const input = cell.querySelector("input");
                    return input ? input.value.trim() : cell.textContent.trim();
                };
                
                // Extraer imagen del elemento team-cell (cells[1])
                const teamCell = cells[1];
                const imgElement = teamCell?.querySelector("img");
                const irudia = imgElement?.src || "";
                
                // Obtener nombre del equipo desde el span o directamente
                const spanElement = teamCell?.querySelector("span");
                const taldea = spanElement?.textContent.trim() || getValue(cells[1]);
                
                // Valores editables
                const irab = parseInt(getValue(cells[2])) || 0;
                const gald = parseInt(getValue(cells[3])) || 0;
                const pf = parseInt(getValue(cells[4])) || 0;
                const kp = parseInt(getValue(cells[5])) || 0;
                
                // Valores calculados
                const pt = irab + gald;
                const pnt = pf - kp;
                
                const errenkada = {
                    taldea: taldea,
                    irudia: irudia,
                    irab: irab,
                    gald: gald,
                    pf: pf,
                    kp: kp,
                    pt: pt,
                    pnt: pnt
                };
                
                // Validar que el nombre no esté vacío
                if (errenkada.taldea) {
                    datos.push(errenkada);
                }
            } catch (e) {
                console.error('Error parsing row:', e);
            }
        }
    });
    
    return datos.length > 0 ? datos : null;
}

/**
 * Guardar registro (Admin)
 */
function gordeRegistroa() {
    if (!isAdmin()) {
        alert("Solo los administradores pueden guardar");
        return;
    }
    
    const datos = recolectarDatosTabla();
    if (!datos || datos.length === 0) {
        alert("Ez dago daturik tabuán");
        return;
    }
    
    // Almacenar datos temporalmente
    window.datosAGuardar = datos;
    openModal("guardarRegistroModal");
    document.getElementById("nombreRegistro").focus();
}

/**
 * Guardar registro con nombre - OPTIMIZADO
 */
async function guardarConNombre() {
    if (!window.datosAGuardar) {
        alert("Ez dago daturik gordetzeko");
        return;
    }
    
    const nombre = document.getElementById("nombreRegistro")?.value.trim();
    if (!nombre) {
        alert("Mesedez sartu denboraldi izena");
        return;
    }
    
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gordetzen...';
        
        const payload = {
            izena: nombre,
            data: new Date().toISOString().split('T')[0],
            sailkapena: window.datosAGuardar
        };
        
        try {
            const result = await safeFetchJson(eefUrl('php/gorde-sailkapena.php'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (result.success) {
                alert(result.message);
                finalizarGuardado();
            } else {
                throw new Error(result.error || 'Ezezaguna');
            }
        } catch (phpError) {
            console.warn("PHP error, intentando guardar en localStorage:", phpError.message);
            // Fallback: Guardar en localStorage
            const localSeasons = JSON.parse(localStorage.getItem('eef_local_seasons') || '[]');
            const newId = 'local_' + Date.now();
            payload.id = newId;
            localSeasons.push(payload);
            localStorage.setItem('eef_local_seasons', JSON.stringify(localSeasons));
            
            alert(nombre + ' gorde egin da lokalean (nabigatzailean). PHP zerbitzaria ez dago erabilgarri.');
            finalizarGuardado();
        }
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
        console.error('Error:', error);
    }
}

/**
 * Acciones comunes después de guardar un registro
 */
function finalizarGuardado() {
    closeModal("guardarRegistroModal");
    const nombreInput = document.getElementById("nombreRegistro");
    if (nombreInput) nombreInput.value = "";
    window.datosAGuardar = null;
    setTimeout(() => recargarRegistros(), 300);
}

/**
 * Recargar lista de registros - OPTIMIZADO
 */
if (typeof window.recargarRegistros !== "function") {
async function recargarRegistros() {
    try {
        const response = await fetch(eefUrl('XML/sailkapena-egutegia.xml'), { cache: 'no-cache' });
        if (!response.ok) throw new Error('Errore en fetch');
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Verificar errores de parsing
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            console.error('XML parsing error');
            return;
        }
        
        const select = document.getElementById("registroSelect");
        if (!select) return;
        
        const currentValue = select.value; // Guardar valor actual
        select.innerHTML = '<option value="">-- Aukeratu denboraldia --</option>';
        
        const egutegiList = xmlDoc.querySelectorAll("egutegi");
        egutegiList.forEach(reg => {
            const id = reg.querySelector("id")?.textContent;
            const izena = reg.querySelector("izena")?.textContent;
            
            if (id && izena) {
                const option = document.createElement("option");
                option.value = id;
                option.textContent = izena;
                select.appendChild(option);
            }
        });
        
        // Cargar registros locales (fallback)
        const localSeasons = JSON.parse(localStorage.getItem('eef_local_seasons') || '[]');
        localSeasons.forEach(reg => {
            const option = document.createElement("option");
            option.value = reg.id;
            option.textContent = reg.izena + " (Lokala)";
            select.appendChild(option);
        });
        
        // Restaurar valor si existe
        if (currentValue) select.value = currentValue;
        
    } catch (error) {
        console.error('Error loading records:', error);
    }
}
}

/**
 * Cargar un registro guardado - OPTIMIZADO
 */
if (typeof window.cargarRegistro !== "function") {
async function cargarRegistro() {
    const select = document.getElementById("registroSelect");
    const registroId = select?.value;
    const borrarBtn = document.getElementById("borrarBtn");
    
    if (!registroId) {
        // Ocultar botón de borrar si no hay registro seleccionado
        if (borrarBtn) borrarBtn.style.display = "none";
        return;
    }
    
    // Mostrar botón de borrar cuando hay un registro seleccionado (solo para admin)
    if (borrarBtn && isAdmin()) borrarBtn.style.display = "inline-block";
    
    try {
        const response = await fetch(eefUrl('XML/sailkapena-egutegia.xml'), { cache: 'no-cache' });
        if (!response.ok) throw new Error('Errore en fetch');
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Buscar el registro por ID
        let egutegia = null;
        xmlDoc.querySelectorAll("egutegi").forEach(reg => {
            if (reg.querySelector("id")?.textContent === registroId) {
                egutegia = reg;
            }
        });
        
        if (egutegia) {
            mostrarResultados(egutegia);
        } else {
            // Intentar buscar en localStorage
            const localSeasons = JSON.parse(localStorage.getItem('eef_local_seasons') || '[]');
            const localReg = localSeasons.find(reg => reg.id === registroId);
            
            if (localReg) {
                mostrarResultadosLocales(localReg);
            } else {
                alert("Denboraldia ez da aurkitu");
            }
        }
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        console.error('Error:', error);
    }
}
}

/**
 * Mostrar resultados en la tabla con los nuevos campos y cálculos
 */
if (typeof window.mostrarResultados !== "function") {
function mostrarResultados(egutegia) {
    const table = document.querySelector(".standings-table-wrapper table tbody");
    if (!table) {
        alert("Taula ez da aurkitu");
        return;
    }
    
    try {
        table.innerHTML = "";
        const taldeas = egutegia.querySelectorAll("sailkapena > errenkada");
        
        if (taldeas.length === 0) {
            alert("Denboraldian ez dago dataturik");
            return;
        }
        
        // Convertir a array y ordenar por Punt. descendente
        let equipos = [];
        taldeas.forEach(taldea => {
            const irab = parseInt(taldea.querySelector("irab")?.textContent) || 0;
            const gald = parseInt(taldea.querySelector("gald")?.textContent) || 0;
            const pf = parseInt(taldea.querySelector("pf")?.textContent) || 0;
            const kp = parseInt(taldea.querySelector("kp")?.textContent) || 0;
            
            let taldeaName = taldea.querySelector("taldea")?.textContent || "";
            let irudia = taldea.querySelector("irudia")?.textContent || "";
            
            equipos.push({
                nombre: taldeaName,
                imagen: irudia,
                irab, gald, pf, kp,
                pt: irab + gald,
                pnt: pf - kp
            });
        });
        
        // Ordenar por Punt. descendente
        equipos.sort((a, b) => b.pnt - a.pnt);
        
        equipos.forEach((equipo, index) => {
            const row = document.createElement("tr");
            
            let rankClass = "standings-row";
            if (index + 1 <= 2) rankClass += " top-two";
            else if (index + 1 === equipos.length) rankClass += " last";
            
            row.className = rankClass;
            
            // Renderizar con imagen - si no está disponible, buscar del mapeo
            let teamCellContent = equipo.nombre;
            let irudia = equipo.imagen;
            if (!irudia) {
                irudia = obtenerImagenEquipo(equipo.nombre);
            }
            if (irudia) {
                teamCellContent = `<img src="${irudia}" alt="${equipo.nombre}" class="standings-img"/> <span>${equipo.nombre}</span>`;
            }
            
            row.innerHTML = `
                <td class="position">${index + 1}</td>
                <td class="team-cell">${teamCellContent}</td>
                <td class="editable" data-field="irab">${equipo.irab}</td>
                <td class="editable" data-field="gald">${equipo.gald}</td>
                <td class="editable" data-field="pf">${equipo.pf}</td>
                <td class="editable" data-field="kp">${equipo.kp}</td>
                <td class="calculated" data-calc="pt">${equipo.pt}</td>
                <td class="calculated points" data-calc="punt">${equipo.pnt}</td>
            `;
            
            table.appendChild(row);
        });
        
        alert("Denboraldia kargatu egin da");
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        console.error('Error:', error);
    }
}
}

/**
 * Mostrar resultados de localStorage en la tabla - Con ordenamiento y cálculos
 */
if (typeof window.mostrarResultadosLocales !== "function") {
function mostrarResultadosLocales(registro) {
    const table = document.querySelector(".standings-table-wrapper table tbody");
    if (!table) {
        alert("Taula ez da aurkitu");
        return;
    }
    
    try {
        table.innerHTML = "";
        const sailkapena = registro.sailkapena;
        
        if (!sailkapena || sailkapena.length === 0) {
            alert("Denboraldian ez dago dataturik");
            return;
        }
        
        // Procesar y ordenar por Punt. descendente
        let equipos = [];
        sailkapena.forEach(taldea => {
            const irab = taldea.irab || 0;
            const gald = taldea.gald || 0;
            const pf = taldea.pf || 0;
            const kp = taldea.kp || 0;
            
            let taldeaName = taldea.taldea || taldea.izena || "";
            let irudia = taldea.irudia || "";
            
            equipos.push({
                nombre: taldeaName,
                imagen: irudia,
                irab, gald, pf, kp,
                pt: irab + gald,
                pnt: pf - kp
            });
        });
        
        // Ordenar por Punt. descendente
        equipos.sort((a, b) => b.pnt - a.pnt);
        
        equipos.forEach((equipo, index) => {
            const row = document.createElement("tr");
            
            let rankClass = "standings-row";
            if (index + 1 <= 2) rankClass += " top-two";
            else if (index + 1 === equipos.length) rankClass += " last";
            
            row.className = rankClass;
            
            // Renderizar con imagen - si no está disponible, buscar del mapeo
            let teamCellContent = equipo.nombre;
            let irudia = equipo.imagen;
            if (!irudia) {
                irudia = obtenerImagenEquipo(equipo.nombre);
            }
            if (irudia) {
                teamCellContent = `<img src="${irudia}" alt="${equipo.nombre}" class="standings-img"/> <span>${equipo.nombre}</span>`;
            }
            
            row.innerHTML = `
                <td class="position">${index + 1}</td>
                <td class="team-cell">${teamCellContent}</td>
                <td class="editable" data-field="irab">${equipo.irab}</td>
                <td class="editable" data-field="gald">${equipo.gald}</td>
                <td class="editable" data-field="pf">${equipo.pf}</td>
                <td class="editable" data-field="kp">${equipo.kp}</td>
                <td class="calculated" data-calc="pt">${equipo.pt}</td>
                <td class="calculated points" data-calc="punt">${equipo.pnt}</td>
            `;
            
            table.appendChild(row);
        });
        
        alert("Denboraldia kargatu egin da (Local)");
        
    } catch (error) {
        alert('Errorea: ' + error.message);
        console.error('Error:', error);
    }
}
}

/**
 * ===== GESTIÓN DE TABLA DE CRUCES =====
 */

/**
 * Habilitar edición de la tabla de cruces
 */
// Evitar pisar las funciones específicas de `gurutzatzeak-manager.js` (se carga antes),
// porque este archivo se incluye globalmente en el footer.
if (typeof window.habilitarEdicionCruces !== "function") {
function habilitarEdicionCruces() {
    if (!isAdmin()) {
        alert("Solo los administradores pueden editar");
        return;
    }
    
    const cells = document.querySelectorAll(".cruces-table td.resultado:not(.diagonal)");
    cells.forEach(cell => {
        if (!cell.querySelector("input")) {
            const originalValue = cell.textContent.trim();
            const input = document.createElement("input");
            input.type = "text";
            input.value = originalValue;
            input.maxLength = "5";
            cell.textContent = "";
            cell.appendChild(input);
        }
    });
    
    alert("Tarteak taula edita daiteke orain. Emaitzak aldatu ditzakezu (adibidez: 28-25).");
}

/**
 * Confirmar y guardar tarteak - OPTIMIZADO
 * Solo guarda en Cruces.xml, Sailkapena se calcula automáticamente
 */
async function guardarCrucesConfirm() {
    let btn = null;
    let originalText = null;
    try {
        btn = event.target;
        originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gordetzen...';
        
        const cruces = recolectarDatosTabla();
        
        if (!cruces || cruces.length === 0) {
            alert("Tarteak ez dago aldatarik");
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }
        
        console.log("Tarteak gordetzea hasita:", cruces.length, "aldaketa");
        
        let guardadoExito = false;
        
        // Intentar guardar vía PHP primero
        try {
            // Gorde gurutzatzeak PHP bidez (fitxategia: php/gorde-gurutzatzeak.php)
            const result = await safeFetchJson(eefUrl('php/gorde-gurutzatzeak.php'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ cruces: cruces })
            });
            
            if (result.success) {
                guardadoExito = true;
                console.log("Tarteak gorde PHP bidez:", result.updated || "?", "aldaketa");
            } else {
                throw new Error(result.error || 'Errore ezezaguna PHP-n');
            }
        } catch (phpError) {
            console.warn("PHP fallita, baliteke lokala gorian:", phpError.message);
            
            // Fallback: Guardar en localStorage como respaldo
            try {
                const dataLocal = {
                    timestamp: new Date().toISOString(),
                    cruces: cruces,
                    cantidad: cruces.length
                };
                localStorage.setItem('eef_cruces_pending', JSON.stringify(dataLocal));
                guardadoExito = true;
                console.log("Tarteak gorde lokala bidez (localStorage):", cruces.length, "aldaketa");
            } catch (localError) {
                throw new Error("PHP eta localStorage ez daude: " + localError.message);
            }
        }
        
        if (guardadoExito) {
            btn.innerHTML = '<i class="fas fa-check"></i> Gordeta!';
            btn.classList.add("success");
            closeModal("guardarTarteakModal");
            
            // Mostrar confirmación, kalkulatu Sailkapena eta berritu taulak
            setTimeout(() => {
                alert("✓ Tarteak gorde egin dira!\n" + cruces.length + " aldaketa\n\nSailkapena berriro kalkulatuko da...");
                
                // 1) Kalkulatu eta gorde Sailkapena XML-an (backend-ean)
                if (window.calcularSailkapena) {
                    try {
                        calcularSailkapena();
                    } catch (e) {
                        console.error("Ezin izan da Sailkapena kalkulatu automatikoki:", e);
                    }
                }
                
                // 2) Sailkapena orrian badago, berriro kalkulatu bistaratutako taula
                if (window.calcularYMostrarSailkapena) {
                    try {
                        calcularYMostrarSailkapena();
                    } catch (e) {
                        console.error("Ezin izan da Sailkapena berriro bistaratu:", e);
                    }
                }
                
                // 3) Berritu soilik Gurutzatzeak taula (reload osoa gabe)
                const crucesContainer = document.getElementById("cruces-container");
                if (crucesContainer) {
                    displayDynamicContent("XML/Gurutzatzeak.xml", "XSLT/Gurutzatzeak.xsl", "cruces-container");
                }
            }, 600);
        }
        
    } catch (error) {
        console.error('Error guardando tarteak:', error);
        alert('❌ Errorea: ' + error.message);
        
        if (btn && originalText) {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.classList.remove("success");
        }
    }
}

/**
 * Recolectar datos de la tabla de tarteak (Cruces) - OPTIMIZADO
 * Solo itera sobre inputs editados (mucho más rápido)
 */
function recolectarDatosTabla() {
    const cruces = [];
    // Iterar SOLO sobre inputs (mucho más rápido que querySelectorAll sobre todas las celdas)
    const inputs = document.querySelectorAll(".cruces-table td.resultado input");
    
    inputs.forEach(input => {
        const valor = input.value?.trim();
        if (!valor || valor === "-") return;
        
        // Parsear formato "28-25" a [28, 25]
        const partes = valor.split("-");
        if (partes.length !== 2) return;
        
        const g1 = parseInt(partes[0]);
        const g2 = parseInt(partes[1]);
        if (isNaN(g1) || isNaN(g2)) return;
        
        // Obtener equipos del atributo data de la celda padre
        const cell = input.parentElement;
        const equipo1 = cell.getAttribute("data-eq1");
        const equipo2 = cell.getAttribute("data-eq2");
        
        if (!equipo1 || !equipo2) return;
        
        cruces.push({
            equipo1: equipo1,
            equipo2: equipo2,
            goles1: g1,
            goles2: g2
        });
    });
    
    return cruces.length > 0 ? cruces : null;
}
} // fin guardia habilitarEdicionCruces/guardarCrucesConfirm/recolectarDatosTabla

/**
 * Calcular Sailkapena basado en los cruces
 * Lee equipos de Taldeak y calcula estadísticas desde Cruces
 */
async function calcularSailkapena() {
    if (!isAdmin()) {
        alert("Solo los administradores pueden calcular");
        return;
    }
    
    let btn = null;
    try {
        // Obtener botón para feedback visual
        btn = event?.target;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kalkulatzen...';
        }
        
        // Obtener datos de Taldeak
        let responseTaldeak;
        try {
            responseTaldeak = await fetch(eefUrl('XML/Taldeak.xml'), { cache: 'no-cache' });
            if (!responseTaldeak.ok) throw new Error(`Taldeak.xml HTTP ${responseTaldeak.status}`);
        } catch (e) {
            throw new Error('Taldeak.xml ezin da irakurri: ' + e.message);
        }
        
        const xmlTextTaldeak = await responseTaldeak.text();
        const parserTaldeak = new DOMParser();
        const xmlTaldeak = parserTaldeak.parseFromString(xmlTextTaldeak, 'application/xml');
        
        if (xmlTaldeak.getElementsByTagName("parsererror").length > 0) {
            throw new Error('Taldeak.xml ez da XML baliozkoa');
        }
        
        // Obtener datos de Gurutzatzeak (tarteak)
        let responseCruces;
        try {
            responseCruces = await fetch(eefUrl('XML/Gurutzatzeak.xml'), { cache: 'no-cache' });
            if (!responseCruces.ok) throw new Error(`Cruces.xml HTTP ${responseCruces.status}`);
        } catch (e) {
            throw new Error('Cruces.xml ezin da irakurri: ' + e.message);
        }
        
        const xmlTextCruces = await responseCruces.text();
        const parserCruces = new DOMParser();
        const xmlCruces = parserCruces.parseFromString(xmlTextCruces, 'application/xml');
        
        if (xmlCruces.getElementsByTagName("parsererror").length > 0) {
            throw new Error('Cruces.xml ez da XML baliozkoa');
        }
        
        // Extraer equipos de Taldeak
        const taldeasList = xmlTaldeak.querySelectorAll("taldea");
        if (taldeasList.length === 0) {
            throw new Error('Taldeak.xml-en taldearik ez dago');
        }
        
        const estadisticas = {};
        
        taldeasList.forEach(taldea => {
            const nombre = taldea.querySelector("izena")?.textContent;
            const imagen = taldea.querySelector("irudia")?.textContent;
            
            if (nombre) {
                estadisticas[nombre] = {
                    nombre: nombre,
                    imagen: imagen,
                    irab: 0,      // Victorias
                    gald: 0,      // Derrotas
                    pf: 0,        // Puntos a favor (goles marcados)
                    kp: 0         // Puntos en contra (goles recibidos)
                };
            }
        });
        
        // Procesar todos los enfrentamientos de Cruces
        const enfrentamientos = xmlCruces.querySelectorAll("enfrentamiento");
        
        enfrentamientos.forEach(enf => {
            const eq1 = enf.querySelector("equipo1")?.textContent;
            const eq2 = enf.querySelector("equipo2")?.textContent;
            const g1 = parseInt(enf.querySelector("goles1")?.textContent || 0);
            const g2 = parseInt(enf.querySelector("goles2")?.textContent || 0);
            
            if (eq1 && eq2 && estadisticas[eq1] && estadisticas[eq2]) {
                // Agregar goles a favor y en contra
                estadisticas[eq1].pf += g1;  // Goles que marcó eq1
                estadisticas[eq1].kp += g2;  // Goles que recibió eq1
                
                estadisticas[eq2].pf += g2;  // Goles que marcó eq2
                estadisticas[eq2].kp += g1;  // Goles que recibió eq2
                
                // Contar victorias y derrotas
                if (g1 > g2) {
                    // eq1 ganó
                    estadisticas[eq1].irab++;
                    estadisticas[eq2].gald++;
                } else if (g1 < g2) {
                    // eq2 ganó
                    estadisticas[eq2].irab++;
                    estadisticas[eq1].gald++;
                }
                // Si g1 === g2 es empate, no se cuenta como victoria ni derrota
            }
        });
        
        console.log('Kalkulua osatuta:', Object.keys(estadisticas).length, 'taldea,', enfrentamientos.length, 'enfrentamienza');
        
        // Actualizar Sailkapena con estos valores (sin reload)
        try {
            await actualizarSailkapenaDesdeCruces(estadisticas);
            
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Kalkulatuta!';
                btn.classList.add("success");
            }
            
            alert("✓ Sailkapena kalkulatu egin da\n\n" + Object.keys(estadisticas).length + " taldea\n" + enfrentamientos.length + " enfrentamienza");
            
            // Actualizar tabla sin reload completo (más rápido)
            setTimeout(() => {
                calcularYMostrarSailkapena();
            }, 800);
            
        } catch (updateError) {
            console.error('Sailkapena eguneratzearen errorea:', updateError);
            if (btn) {
                btn.innerHTML = '<i class="fas fa-calculator"></i> Kalkulatu Sailkapena';
                btn.disabled = false;
            }
            throw new Error('Sailkapena eguneratzean arazoa: ' + updateError.message);
        }
        
    } catch (error) {
        console.error('Errorea kalkulatzen:', error);
        alert('❌ Errorea: ' + error.message + '\n\nhttp://localhost:8000 bilatzen ari zara?');
        
        if (btn) {
            btn.innerHTML = '<i class="fas fa-calculator"></i> Kalkulatu Sailkapena';
            btn.disabled = false;
            btn.classList.remove("success");
        }
    }
}

/**
 * Actualizar XML de Sailkapena con datos de cruces
 */
async function actualizarSailkapenaDesdeCruces(estadisticas) {
    try {
        // Crear XML con datos calculados
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlContent += '<!-- Ligako sailkapenaren datuak -->\n';
        xmlContent += '<sailkapena xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../XSD/Sailkapena.xsd">\n';
        
        // Convertir a array, calcular puntos y ordenar por Punt. descendente
        const equipoArray = Object.values(estadisticas).map(equipo => ({
            ...equipo,
            pt: equipo.irab + equipo.gald,
            punt: equipo.pf - equipo.kp
        })).sort((a, b) => b.punt - a.punt);
        
        // Generar XML con posiciones correctas
        equipoArray.forEach((equipo, index) => {
            xmlContent += '  <errenkada>\n';
            xmlContent += `    <posizioa>${index + 1}</posizioa>\n`;
            xmlContent += `    <taldea>${escapeXml(equipo.nombre)}</taldea>\n`;
            xmlContent += `    <irudia>${escapeXml(equipo.imagen)}</irudia>\n`;
            xmlContent += `    <irab>${equipo.irab}</irab>\n`;
            xmlContent += `    <gald>${equipo.gald}</gald>\n`;
            xmlContent += `    <pf>${equipo.pf}</pf>\n`;
            xmlContent += `    <kp>${equipo.kp}</kp>\n`;
            xmlContent += `    <pnt>${equipo.punt}</pnt>\n`;
            xmlContent += '  </errenkada>\n';
        });
        
        xmlContent += '</sailkapena>';
        
        // Guardar vía PHP
        const result = await safeFetchJson(eefUrl('php/eguneratu-sailkapena-xml.php'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: xmlContent })
        });
        
        if (result.success) {
            console.log("Sailkapena actualizado exitosamente");
            alert("Sailkapena eguneratu egin da!");
            location.reload();
        } else {
            alert("Errorea Sailkapena gordetzean: " + (result.error || result.message));
        }
        
    } catch (error) {
        console.error('Error updating Sailkapena:', error);
        alert("Errorea: " + error.message);
    }
}

/**
 * Escapar caracteres especiales para XML
 */
function escapeXml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}

/**
 * Borrar un registro guardado
 */
if (typeof window.borrarRegistro !== "function") {
async function borrarRegistro() {
    if (!isAdmin()) {
        alert("Solo los administradores pueden borrar registros");
        return;
    }
    
    const select = document.getElementById("registroSelect");
    const registroId = select?.value;
    
    if (!registroId) {
        alert("Mesedez aukeratu denboraldia ezabatzeko");
        return;
    }
    
    // Confirmar eliminación
    const izena = select.options[select.selectedIndex].text;
    if (!confirm(`Ziur al zaude "${izena}" ezabatu nahi duzula? Ekintza hau itzuli ezin da.`)) {
        return;
    }
    
    try {
        // Si es un registro local (localStorage), eliminarlo de ahí
        if (registroId.startsWith('local_')) {
            const localSeasons = JSON.parse(localStorage.getItem('eef_local_seasons') || '[]');
            const filtered = localSeasons.filter(reg => reg.id !== registroId);
            localStorage.setItem('eef_local_seasons', JSON.stringify(filtered));
            alert(izena + " ezabatu egin da");
            recargarRegistros();
            return;
        }
        
        // Si es un registro en XML, preparar para eliminar (requiere PHP si lo quieres)
        // Por ahora, solo soportamos eliminar registros locales
        alert("XML bideetako ordua ez dago onartzen. Erregistro hau localStorage-ko denboraldia da ziurrenik.");
        
    } catch (error) {
        alert('Errorea ezabatzean: ' + error.message);
        console.error('Error:', error);
    }
}
}

/**
 * Calcular y mostrar Sailkapena automáticamente desde Cruces
 * Se llama automáticamente al cargar Sailkapena.html
 */
async function calcularYMostrarSailkapena() {
    const container = document.getElementById("standings-container");
    
    try {
        console.log("Sailkapena kalkulatzea hasita...");
        
        // Obtener datos de Taldeak
        let responseTaldeak;
        let responseCruces;
        
        try {
            responseTaldeak = await fetch(eefUrl('XML/Taldeak.xml'), { cache: 'no-cache' });
            if (!responseTaldeak.ok) throw new Error(`Taldeak.xml HTTP ${responseTaldeak.status}`);
        } catch (e) {
            console.error('Taldeak.xml kargatzearen errorea:', e.message);
            throw new Error('Taldeak.xml ezin da irakurri: ' + e.message);
        }
        
        let xmlTextTaldeak;
        try {
            xmlTextTaldeak = await responseTaldeak.text();
        } catch (e) {
            console.error('Taldeak.xml testua irakurtzean errorea:', e.message);
            throw new Error('Taldeak.xml testua irakurri ezin: ' + e.message);
        }
        
        const parserTaldeak = new DOMParser();
        const xmlTaldeak = parserTaldeak.parseFromString(xmlTextTaldeak, 'application/xml');
        
        // Comprobar si hay errores en parsing
        if (xmlTaldeak.getElementsByTagName("parsererror").length > 0) {
            throw new Error('XML parsing error en Taldeak.xml');
        }
        
        // Obtener datos de Gurutzatzeak (tarteak)
        try {
            responseCruces = await fetch(eefUrl('XML/Gurutzatzeak.xml'), { cache: 'no-cache' });
            if (!responseCruces.ok) throw new Error(`Cruces.xml HTTP ${responseCruces.status}`);
        } catch (e) {
            console.error('Cruces.xml kargatzearen errorea:', e.message);
            throw new Error('Cruces.xml ezin da irakurri: ' + e.message);
        }
        
        let xmlTextCruces;
        try {
            xmlTextCruces = await responseCruces.text();
        } catch (e) {
            console.error('Cruces.xml testua irakurtzean errorea:', e.message);
            throw new Error('Cruces.xml testua irakurri ezin: ' + e.message);
        }
        
        const parserCruces = new DOMParser();
        const xmlCruces = parserCruces.parseFromString(xmlTextCruces, 'application/xml');
        
        // Comprobar si hay errores en parsing
        if (xmlCruces.getElementsByTagName("parsererror").length > 0) {
            throw new Error('XML parsing error en Cruces.xml');
        }
        
        // Extraer equipos de Taldeak
        const taldeasList = xmlTaldeak.querySelectorAll("taldea");
        if (taldeasList.length === 0) {
            throw new Error('Taldeak.xml-en taldearik ez dago');
        }
        
        const estadisticas = {};
        
        taldeasList.forEach(taldea => {
            const nombre = taldea.querySelector("izena")?.textContent;
            const imagen = taldea.querySelector("irudia")?.textContent;
            
            if (nombre) {
                estadisticas[nombre] = {
                    nombre: nombre,
                    imagen: imagen,
                    irab: 0,      // Victorias
                    gald: 0,      // Derrotas
                    pf: 0,        // Puntos a favor (goles marcados)
                    kp: 0         // Puntos en contra (goles recibidos)
                };
            }
        });
        
        console.log("Taldeak irakurrita:", Object.keys(estadisticas).length);
        
        // Procesar todos los enfrentamientos de Cruces
        const enfrentamientos = xmlCruces.querySelectorAll("enfrentamiento");
        if (enfrentamientos.length === 0) {
            console.warn('Cruces.xml-en enfrentamientorik ez dago');
        }
        
        enfrentamientos.forEach(enf => {
            const eq1 = enf.querySelector("equipo1")?.textContent;
            const eq2 = enf.querySelector("equipo2")?.textContent;
            const g1 = parseInt(enf.querySelector("goles1")?.textContent || 0);
            const g2 = parseInt(enf.querySelector("goles2")?.textContent || 0);
            
            if (eq1 && eq2 && estadisticas[eq1] && estadisticas[eq2]) {
                // Agregar goles a favor y en contra
                estadisticas[eq1].pf += g1;  // Goles que marcó eq1
                estadisticas[eq1].kp += g2;  // Goles que recibió eq1
                
                estadisticas[eq2].pf += g2;  // Goles que marcó eq2
                estadisticas[eq2].kp += g1;  // Goles que recibió eq2
                
                // Contar victorias y derrotas
                if (g1 > g2) {
                    // eq1 ganó
                    estadisticas[eq1].irab++;
                    estadisticas[eq2].gald++;
                } else if (g1 < g2) {
                    // eq2 ganó
                    estadisticas[eq2].irab++;
                    estadisticas[eq1].gald++;
                }
                // Si g1 === g2 es empate, no se cuenta como victoria ni derrota
            }
        });
        
        console.log("Enfrentamienduak kalkulatuta:", enfrentamientos.length);
        
        // Convertir a array, calcular puntos y ordenar por Pont. descendente
        const equipoArray = Object.values(estadisticas).map(equipo => ({
            ...equipo,
            pt: equipo.irab + equipo.gald,
            punt: equipo.pf - equipo.kp
        })).sort((a, b) => b.punt - a.punt);
        
        // Crear XML con datos calculados
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xmlContent += '<!-- Ligako sailkapenaren datuak -->\n';
        xmlContent += '<sailkapena xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../XSD/Sailkapena.xsd">\n';
        
        // Generar XML con posiciones correctas
        equipoArray.forEach((equipo, index) => {
            xmlContent += '  <errenkada>\n';
            xmlContent += `    <posizioa>${index + 1}</posizioa>\n`;
            xmlContent += `    <taldea>${escapeXml(equipo.nombre)}</taldea>\n`;
            xmlContent += `    <irudia>${escapeXml(equipo.imagen)}</irudia>\n`;
            xmlContent += `    <irab>${equipo.irab}</irab>\n`;
            xmlContent += `    <gald>${equipo.gald}</gald>\n`;
            xmlContent += `    <pf>${equipo.pf}</pf>\n`;
            xmlContent += `    <kp>${equipo.kp}</kp>\n`;
            xmlContent += `    <pnt>${equipo.punt}</pnt>\n`;
            xmlContent += '  </errenkada>\n';
        });
        
        xmlContent += '</sailkapena>';
        
        // Transformar y mostrar el XML calculado
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
        
        // Comprobar si hay errores en parsing
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            throw new Error('XML generatutako sailkapena ez da baliozkoa');
        }
        
        let xsltResponse;
        try {
            xsltResponse = await fetch(eefUrl('XSLT/Sailkapena.xsl'), { cache: 'no-cache' });
            if (!xsltResponse.ok) throw new Error(`Sailkapena.xsl HTTP ${xsltResponse.status}`);
        } catch (e) {
            console.error('XSLT kargatzearen errorea:', e.message);
            throw new Error('Sailkapena.xsl ezin da irakurri: ' + e.message);
        }
        
        const xsltText = await xsltResponse.text();
        const xsltDoc = parser.parseFromString(xsltText, "application/xml");
        
        // Comprobar si hay errores en parsing XSLT
        if (xsltDoc.getElementsByTagName("parsererror").length > 0) {
            throw new Error('XSLT fitxategia ez da baliozkoa');
        }
        
        if (window.XSLTProcessor) {
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsltDoc);
            const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
            
            if (container) {
                container.innerHTML = "";
                container.appendChild(resultDocument);
                console.log("✓ Sailkapena eguneratu egin da kalkulatutako datuekin");
            }
        } else {
            throw new Error('XSLTProcessor ez dago aurkitzen');
        }
        
    } catch (error) {
        console.error('Sailkapena kalkulatzean errorea:', error.message);
        
        // Si el contenedor aún está vacío, intenta cargar el XML como fallback
        if (container && !container.innerHTML) {
            console.log('Fallback: XML fitxategia kargatzea...');
            try {
                if (window.displayDynamicContent) {
                    displayDynamicContent("XML/Sailkapena.xml", "XSLT/Sailkapena.xsl", "standings-container");
                }
            } catch (fallbackError) {
                console.error('Fallback errorea:', fallbackError);
                container.innerHTML = `<div style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
                    <p style="color: #856404; margin: 0;"><strong>⚠️ Sailkapena earrega ezin:</strong></p>
                    <p style="color: #856404; margin: 10px 0 0 0; font-size: 0.9em;">${error.message}</p>
                    <p style="color: #856404; margin: 10px 0 0 0; font-size: 0.85em;">Zerbitzaria oraindik php-a marcha hartzen ari da?<br>http://localhost:8000 erabili.</p>
                </div>`;
            }
        } else {
            // Mostrar error pero mantener tabla existente
            if (container) {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'padding: 10px; margin: 10px 0; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;';
                errorDiv.innerHTML = `<strong>Abisuak:</strong> Sailkapena egunean ez dago eguneratu: ${error.message}`;
                container.parentElement.insertBefore(errorDiv, container);
            }
        }
    }
}
