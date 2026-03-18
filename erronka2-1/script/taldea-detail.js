/**
 * Taldea Detail Manager - Gestión de la página de detalles de equipo
 * Carga dinámicamente la información de un equipo específico desde XML
 */

function eefResolveAssetPath(maybeRelativePath) {
    if (!maybeRelativePath) return "";
    const p = String(maybeRelativePath).trim();
    if (!p) return "";
    if (/^(https?:)?\/\//i.test(p) || p.startsWith("/")) return p;
    const base = window.eefPaths?.base || "";
    return base + p;
}

/**
 * Inicializar la página de detalles del equipo
 */
async function inicializarTaldeaDetail() {
    console.log("Inicializando página de detalles del equipo...");

    // Obtener el nombre del equipo desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const equipoNombre = urlParams.get('equipo');

    if (!equipoNombre) {
        mostrarError("Ez da talderik aukeratu");
        return;
    }

    try {
        // Cargar datos del equipo desde XML
        await cargarEquipoDetalle(equipoNombre);
    } catch (error) {
        console.error('Error inicializando detalles del equipo:', error);
        mostrarError("Errorea taldearen datuak kargatzean");
    }
}

/**
 * Cargar los detalles de un equipo específico desde XML
 */
async function cargarEquipoDetalle(equipoNombre) {
    try {
        const response = await fetch((window.eefPaths?.xml || 'XML/') + 'Taldeak.xml', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Taldeak.xml ezin da irakurri');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Buscar el equipo por nombre
        const taldeas = xmlDoc.querySelectorAll('taldea');
        let equipoEncontrado = null;

        taldeas.forEach(taldea => {
            const nombre = taldea.querySelector('izena')?.textContent;
            if (nombre === equipoNombre) {
                equipoEncontrado = {
                    id: taldea.querySelector('id')?.textContent,
                    nombre: nombre,
                    imagen: taldea.querySelector('irudia')?.textContent,
                    descripcion: taldea.querySelector('deskribapena')?.textContent,
                    infoUrl: taldea.querySelector('info_url')?.textContent
                };
            }
        });

        if (!equipoEncontrado) {
            mostrarError(`Taldea "${equipoNombre}" ez da aurkitu`);
            return;
        }

        // Mostrar los detalles del equipo
        mostrarEquipoDetalle(equipoEncontrado);

    } catch (error) {
        console.error('Error cargando equipo:', error);
        mostrarError("Errorea taldearen datuak kargatzean");
    }
}

/**
 * Mostrar los detalles del equipo en el DOM
 */
function mostrarEquipoDetalle(equipo) {
    const container = document.getElementById('team-detail-content');
    const title = document.getElementById('team-title');
    const breadcrumb = document.getElementById('breadcrumb-team');

    if (!container || !title) return;

    // Actualizar título y breadcrumb
    title.textContent = equipo.nombre;
    if (breadcrumb) {
        breadcrumb.textContent = equipo.nombre;
    }

    // Actualizar el título de la página
    document.title = `${equipo.nombre} - EEF`;

    // Crear contenido HTML
    let html = '';

    html += '<div class="team-detail-card">';
    html += '  <div class="team-detail-header">';
    html += '    <div class="team-logo-large">';
    if (equipo.imagen) {
        const imgSrc = eefResolveAssetPath(equipo.imagen);
        html += `      <img src="${imgSrc}" alt="${equipo.nombre}" />`;
    } else {
        html += '      <div class="no-logo"><i class="fas fa-users"></i></div>';
    }
    html += '    </div>';
    html += '    <div class="team-info">';
    html += `      <h3>${equipo.nombre}</h3>`;
    if (equipo.infoUrl) {
        html += `      <a href="${equipo.infoUrl}" target="_blank" class="btn-secondary">`;
        html += '        <i class="fas fa-external-link-alt"></i> Webgunea ikusi';
        html += '      </a>';
    }
    html += '    </div>';
    html += '  </div>';

    html += '  <div class="team-description">';
    html += `    <h4>Taldearen deskribapena</h4>`;
    html += `    <p>${equipo.descripcion}</p>`;
    html += '  </div>';

    // Información adicional (estadísticas básicas si están disponibles)
    html += '  <div class="team-stats">';
    html += '    <h4>Estatistikak</h4>';
    html += '    <div class="stats-grid">';
    html += '      <div class="stat-item">';
    html += '        <span class="stat-label">ID:</span>';
    html += `        <span class="stat-value">${equipo.id}</span>`;
    html += '      </div>';
    html += '      <div class="stat-item">';
    html += '        <span class="stat-label">Egoera:</span>';
    html += '        <span class="stat-value active">Aktibo</span>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    html += '</div>';

    container.innerHTML = html;
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    const container = document.getElementById('team-detail-content');
    const title = document.getElementById('team-title');

    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Errorea</h3>
                <p>${mensaje}</p>
                <button class="btn-primary" onclick="history.back()">
                    <i class="fas fa-arrow-left"></i> Atzera joan
                </button>
            </div>
        `;
    }

    if (title) {
        title.textContent = 'Errorea';
    }
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname || "";
    const page = path.split('/').pop();
    const isPhp = page.endsWith(".php") || path.includes("/Web/");
    const ext = isPhp ? ".php" : ".html";
    if (page === 'Taldea' + ext) {
        inicializarTaldeaDetail();
    }
});