/**
 * Sailkapena Manager - Gestión de la clasificación
 * Calcula automáticamente la clasificación basada en los cruces guardados
 */

function eefResolveAssetPath(maybeRelativePath) {
    if (!maybeRelativePath) return "";
    const p = String(maybeRelativePath).trim();
    if (!p) return "";
    // Absolute or URL
    if (/^(https?:)?\/\//i.test(p) || p.startsWith("/")) return p;
    const base = window.eefPaths?.base || "";
    return base + p;
}

/**
 * Inicializar Sailkapena
 */
async function inicializarSailkapena() {
    console.log("Inicializando Sailkapena...");
    
    // Cargar lista de temporadas
    await cargarListaTemporadasSailkapena();
    
    // Mostrar panel admin si es necesario
    const adminPanel = document.querySelector(".admin-panel");
    if (adminPanel && isAdmin()) {
        adminPanel.style.display = "block";
    } else if (adminPanel) {
        adminPanel.style.display = "none";
    }
    
    // Cargar automáticamente la temporada que estaba seleccionada en Cruces
    const temporadaActiva = localStorage.getItem('eef_temporada_activa');
    if (temporadaActiva) {
        const select = document.getElementById('registroSelect');
        if (select) {
            select.value = temporadaActiva;
            // Esperar un poco a que el DOM se actualice
            setTimeout(() => {
                cargarRegistro();
            }, 100);
        }
    }
}

/**
 * Cargar la lista de temporadas guardadas en el dropdown de Sailkapena
 */
async function cargarListaTemporadasSailkapena() {
    try {
        const temporadas = JSON.parse(localStorage.getItem('eef_temporadas_cruces') || '[]');
        
        const select = document.getElementById('registroSelect');
        if (!select) return;
        
        // Limpiar opciones anteriores excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Agregar temporadas guardadas
        temporadas.forEach((temporada, index) => {
            const option = document.createElement('option');
            option.value = temporada.id;
            option.textContent = temporada.nombre + ' (' + temporada.fecha + ')';
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error cargando temporadas en Sailkapena:', error);
    }
}

/**
 * Cargar una temporada y mostrar su clasificación
 */
async function cargarRegistro() {
    const select = document.getElementById('registroSelect');
    const temporadaId = select?.value;
    
    if (!temporadaId) {
        // Limpiar tabla si no hay temporada seleccionada
        const container = document.getElementById('standings-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Selecciona una temporada para ver la clasificación</p>';
        }
        return;
    }
    
    try {
        const temporadas = JSON.parse(localStorage.getItem('eef_temporadas_cruces') || '[]');
        const temporada = temporadas.find(t => t.id === temporadaId);
        
        if (!temporada) {
            alert('Denboraldia ez da aurkitu');
            return;
        }
        
        // Calcular y mostrar clasificación
        calcularYMostrarClasificacion(temporada.cruces);
        
    } catch (error) {
        console.error('Error cargando temporada:', error);
        alert('Errorea denboraldia kargatzean: ' + error.message);
    }
}

/**
 * Calcular y mostrar la clasificación basada en los cruces
 */
async function calcularYMostrarClasificacion(cruces) {
    try {
        // Obtener lista de equipos
        const response = await fetch((window.eefPaths?.xml || 'XML/') + 'Taldeak.xml', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Taldeak.xml ezin da irakurri');
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Crear estructura de estadísticas para cada equipo
        const estadisticas = {};
        
        const taldeas = xmlDoc.querySelectorAll('taldea');
        taldeas.forEach(taldea => {
            const nombre = taldea.querySelector('izena')?.textContent;
            const imagen = taldea.querySelector('irudia')?.textContent;
            
            if (nombre) {
                estadisticas[nombre] = {
                    nombre: nombre,
                    imagen: imagen,
                    irab: 0,  // Victorias
                    gald: 0,  // Derrotas
                    pf: 0,    // Puntos a favor (goles marcados)
                    kp: 0     // Puntos en contra (goles recibidos)
                };
            }
        });
        
        // Procesar cruces para calcular estadísticas
        cruces.forEach(enf => {
            const eq1 = enf.equipo1;
            const eq2 = enf.equipo2;
            const g1 = enf.goles1 || 0;
            const g2 = enf.goles2 || 0;
            
            if (estadisticas[eq1] && estadisticas[eq2]) {
                // Actualizar goles a favor y en contra
                estadisticas[eq1].pf += g1;
                estadisticas[eq1].kp += g2;
                
                estadisticas[eq2].pf += g2;
                estadisticas[eq2].kp += g1;
                
                // Contar victorias y derrotas
                if (g1 > g2) {
                    estadisticas[eq1].irab++;
                    estadisticas[eq2].gald++;
                } else if (g1 < g2) {
                    estadisticas[eq2].irab++;
                    estadisticas[eq1].gald++;
                }
                // Si g1 === g2 es empate
            }
        });
        
        // Convertir a array, calcular puntos y ordenar (descendente)
        const equipos = Object.values(estadisticas).map(equipo => ({
            ...equipo,
            pt: equipo.irab + equipo.gald,  // Partidos totales
            pnt: equipo.pf - equipo.kp      // Diferencia de puntos
        })).sort((a, b) => {
            // 1) Más victorias primero
            if (b.irab !== a.irab) return b.irab - a.irab;
            // 2) Desempate por diferencia (pf - kp)
            if (b.pnt !== a.pnt) return b.pnt - a.pnt;
            // 3) Desempate por pf
            if (b.pf !== a.pf) return b.pf - a.pf;
            // 4) Estable: alfabético
            return String(a.nombre).localeCompare(String(b.nombre));
        });
        
        // Mostrar en la tabla
        mostrarTablaClasificacion(equipos);
        
    } catch (error) {
        console.error('Error calculando clasificación:', error);
        alert('Errorea: ' + error.message);
    }
}

/**
 * Mostrar la tabla de clasificación en el DOM
 */
function mostrarTablaClasificacion(equipos) {
    const container = document.getElementById('standings-container');
    if (!container) return;
    
    let html = '<div class="standings-table-wrapper">\n';
    html += '  <table class="standings-table">\n';
    html += '    <thead>\n';
    html += '      <tr>\n';
    html += '        <th>Pos.</th>\n';
    html += '        <th>Taldea</th>\n';
    html += '        <th>Irab.</th>\n';
    html += '        <th>Gald.</th>\n';
    html += '        <th>PJ</th>\n';
    html += '        <th>PF</th>\n';
    html += '        <th>KP</th>\n';
    html += '        <th>Punt.</th>\n';
    html += '      </tr>\n';
    html += '    </thead>\n';
    html += '    <tbody>\n';
    
    equipos.forEach((equipo, index) => {
        let rowClass = 'standings-row';
        if (index + 1 <= 2) {
            rowClass += ' top-two';  // Top 2 champions
        } else if (index + 1 === equipos.length) {
            rowClass += ' last';     // Last place
        }
        
        // Obtener imagen
        let imagenHtml = '';
        if (equipo.imagen) {
            const imgSrc = eefResolveAssetPath(equipo.imagen);
            imagenHtml = `<img src="${imgSrc}" alt="${equipo.nombre}" class="standings-img team-link" onclick="irATaldea('${equipo.nombre}')"/> `;
        }
        
        html += `      <tr class="${rowClass}">\n`;
        html += `        <td class="position">${index + 1}</td>\n`;
        html += `        <td class="team-cell"><span class="team-link" onclick="irATaldea('${equipo.nombre}')">${imagenHtml}${equipo.nombre}</span></td>\n`;
        html += `        <td class="editable" data-field="irab">${equipo.irab}</td>\n`;
        html += `        <td class="editable" data-field="gald">${equipo.gald}</td>\n`;
        html += `        <td class="calculated" data-calc="pt">${equipo.pt}</td>\n`;
        html += `        <td class="editable" data-field="pf">${equipo.pf}</td>\n`;
        html += `        <td class="editable" data-field="kp">${equipo.kp}</td>\n`;
        html += `        <td class="calculated points" data-calc="punt">${equipo.pnt}</td>\n`;
        html += '      </tr>\n';
    });
    
    html += '    </tbody>\n';
    html += '  </table>\n';
    html += '</div>\n';
    
    container.innerHTML = html;
}

/**
 * Recargar lista de registros (compatibilidad)
 */
async function recargarRegistros() {
    await cargarListaTemporadasSailkapena();
}

/**
 * Ir a la página de detalles de un equipo
 */
function irATaldea(equipoNombre) {
    // Codificar el nombre del equipo para la URL
    const encodedNombre = encodeURIComponent(equipoNombre);
    const path = window.location.pathname || "";
    const isPhp = path.endsWith(".php") || path.includes("/Web/");
    const ext = isPhp ? ".php" : ".html";
    window.location.href = `Taldea${ext}?equipo=${encodedNombre}`;
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname || "";
    const page = path.split('/').pop();
    const isPhp = page.endsWith(".php") || path.includes("/Web/");
    const ext = isPhp ? ".php" : ".html";
    if (page === 'Sailkapena' + ext) {
        inicializarSailkapena();
    }
});
