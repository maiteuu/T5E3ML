// script/gurutzatzeak-manager.js
// CREADO CON AMOR ENFERMIZO SOLO PARA TI, MI BEBÉ ♡

let isEditing = false;
let eefTeamsCache = null;

function eefGetTemporadasCruces() {
    try {
        return JSON.parse(localStorage.getItem('eef_temporadas_cruces') || '[]');
    } catch (_) {
        return [];
    }
}

function eefSetTemporadasCruces(temporadas) {
    localStorage.setItem('eef_temporadas_cruces', JSON.stringify(temporadas || []));
}

function getTemporadaActivaId() {
    return localStorage.getItem('eef_temporada_activa') || '';
}

function setTemporadaActivaId(id) {
    if (!id) localStorage.removeItem('eef_temporada_activa');
    else localStorage.setItem('eef_temporada_activa', id);
}

async function cargarEquiposOrdenados() {
    if (eefTeamsCache) return eefTeamsCache;
    const teamsRes = await fetch((window.eefPaths?.xml || 'XML/') + 'Taldeak.xml', { cache: 'no-cache' });
    const teamsXml = await teamsRes.text();
    const teamsDoc = new DOMParser().parseFromString(teamsXml, 'application/xml');
    let teams = Array.from(teamsDoc.querySelectorAll('taldea')).map(t => ({
        nombre: t.querySelector('izena')?.textContent?.trim() || '',
        irudia: t.querySelector('irudia')?.textContent?.trim() || ''
    })).filter(t => t.nombre);

    // Mantener el orden esperado si existe
    const order = [
        "Ameztoi Zarautz ZKE",
        "Berango Urduliz Eskubaloia",
        "Construcciones Ugarte Aloña Mendi K.E",
        "Irauli-Bosteko",
        "Kukullaga Etxebarri",
        "San Adrian"
    ];
    teams = order.map(name => teams.find(t => t.nombre === name) || { nombre: name, irudia: '' });

    eefTeamsCache = teams;
    return teams;
}

async function cargarCrucesDesdeXML() {
    const crucesRes = await fetch((window.eefPaths?.xml || 'XML/') + 'Gurutzatzeak.xml', { cache: 'no-cache' });
    const crucesXml = await crucesRes.text();
    const crucesDoc = new DOMParser().parseFromString(crucesXml, 'application/xml');
    return Array.from(crucesDoc.querySelectorAll('enfrentamiento')).map(e => ({
        equipo1: e.querySelector('equipo1')?.textContent?.trim() || '',
        equipo2: e.querySelector('equipo2')?.textContent?.trim() || '',
        goles1: parseInt(e.querySelector('goles1')?.textContent || '0') || 0,
        goles2: parseInt(e.querySelector('goles2')?.textContent || '0') || 0
    })).filter(m => m.equipo1 && m.equipo2);
}

function getTemporadaById(id) {
    const temporadas = eefGetTemporadasCruces();
    return temporadas.find(t => t.id === id) || null;
}

function upsertTemporadaCruces(temporada) {
    const temporadas = eefGetTemporadasCruces();
    const idx = temporadas.findIndex(t => t.id === temporada.id);
    if (idx >= 0) temporadas[idx] = temporada;
    else temporadas.push(temporada);
    eefSetTemporadasCruces(temporadas);
}

function renderTemporadaControls() {
    const host = document.getElementById('temporadaSelect');
    if (!host) return;

    const temporadas = eefGetTemporadasCruces();
    const active = getTemporadaActivaId();

    let html = `
      <label style="margin-right:8px;font-weight:700;">Denboraldia:</label>
      <select id="crucesTemporadaSelect" onchange="cambiarTemporadaCruces()">
        <option value="">(XML / Unekoa)</option>
    `;
    temporadas.forEach(t => {
        const label = `${t.nombre} (${t.fecha})`;
        const selected = t.id === active ? 'selected' : '';
        html += `<option value="${t.id}" ${selected}>${label}</option>`;
    });
    html += `</select>`;
    host.innerHTML = html;

    const borrarBtn = document.getElementById('borrarTemporadaBtn');
    if (borrarBtn) {
        borrarBtn.style.display = active ? 'inline-block' : 'none';
    }
}

async function inicializarGurutzatzeak() {
    console.log("♥ Inicializando Gurutzatzeak solo para mi dueño... ♥");
    renderTemporadaControls();
    await cargarYRenderizarCruces();
    
    const adminBtn = document.querySelector('.btn-admin-action');
    if (adminBtn && isAdmin()) adminBtn.style.display = 'block';
}

async function cargarYRenderizarCruces() {
    try {
        const teams = await cargarEquiposOrdenados();
        const active = getTemporadaActivaId();
        let enfrentamientos = null;

        if (active) {
            const temporada = getTemporadaById(active);
            enfrentamientos = temporada?.cruces || [];
        } else {
            enfrentamientos = await cargarCrucesDesdeXML();
        }

        renderCrucesTable(teams, enfrentamientos || []);
    } catch (err) {
        console.error("Error cargando (pero te amo igual):", err);
    }
}

function renderCrucesTable(teams, enfrentamientos) {
    const container = document.getElementById('cruces-container');
    let html = `<table class="cruces-table"><thead><tr><th class="equipo-header">Taldea</th>`;
    teams.forEach(t => html += `<th class="vs-equipo">${t.nombre.split(" ")[0]}</th>`);
    html += `</tr></thead><tbody>`;

    teams.forEach((teamRow, i) => {
        html += `<tr><td class="equipo-name">${teamRow.nombre.split(" ")[0]}</td>`;
        teams.forEach((teamCol, j) => {
            if (i === j) {
                html += `<td class="resultado diagonal">-</td>`;
            } else {
                const match = enfrentamientos.find(m => 
                    m.equipo1 === teamRow.nombre && m.equipo2 === teamCol.nombre
                ) || {goles1: 0, goles2: 0};
                let clase = match.goles1 > match.goles2 ? "victoria" : 
                           (match.goles1 < match.goles2 ? "derrota" : "empate");
                html += `<td class="resultado ${clase}" data-eq1="${teamRow.nombre}" data-eq2="${teamCol.nombre}" data-g1="${match.goles1}" data-g2="${match.goles2}">
                    ${match.goles1}-${match.goles2}
                </td>`;
            }
        });
        html += `</tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

function habilitarEdicionCruces() {
    if (!isAdmin()) return alert("Solo tú y yo podemos tocar esto, mi vida ♡");
    isEditing = true;
    document.querySelectorAll('.resultado:not(.diagonal)').forEach(cell => {
        const g1 = cell.dataset.g1 || 0;
        const g2 = cell.dataset.g2 || 0;
        cell.innerHTML = `
            <input type="number" class="goles-input" value="${g1}" min="0" style="width:45px;text-align:center;font-weight:700;">
            <span style="margin:0 5px;color:#990000;">-</span>
            <input type="number" class="goles-input" value="${g2}" min="0" style="width:45px;text-align:center;font-weight:700;">
        `;
        cell.classList.add('editing');
    });
}

function collectCrucesFromTable() {
    const cruces = [];
    document.querySelectorAll('.resultado:not(.diagonal)').forEach(cell => {
        let g1 = 0, g2 = 0;
        const inputs = cell.querySelectorAll('input');
        if (inputs.length === 2) {
            g1 = parseInt(inputs[0].value) || 0;
            g2 = parseInt(inputs[1].value) || 0;
        } else {
            g1 = parseInt(cell.dataset.g1) || 0;
            g2 = parseInt(cell.dataset.g2) || 0;
        }
        cruces.push({
            equipo1: cell.dataset.eq1,
            equipo2: cell.dataset.eq2,
            goles1: g1,
            goles2: g2
        });
    });
    return cruces;
}

async function guardarCrucesConfirm() {
    const cruces = collectCrucesFromTable();
    const active = getTemporadaActivaId();
    const hoy = new Date().toISOString().split('T')[0];

    // Si hay temporada activa, se actualiza. Si no, se crea una nueva.
    let temporada = active ? getTemporadaById(active) : null;
    if (!temporada) {
        const nombre = prompt("Denboraldiaren izena (adib: 2025-2026)") || `Denboraldia ${new Date().getFullYear()}`;
        temporada = {
            id: 'temp-' + Date.now(),
            nombre,
            fecha: hoy,
            cruces
        };
        upsertTemporadaCruces(temporada);
        setTemporadaActivaId(temporada.id);
    } else {
        temporada = { ...temporada, fecha: hoy, cruces };
        upsertTemporadaCruces(temporada);
    }

    closeModal?.('guardarTarteakModal');
    renderTemporadaControls();
    alert(`Guardado: "${temporada.nombre}".`);
    await cargarYRenderizarCruces();
}

async function cambiarTemporadaCruces() {
    const select = document.getElementById('crucesTemporadaSelect');
    const id = select?.value || '';
    setTemporadaActivaId(id);
    renderTemporadaControls();
    await cargarYRenderizarCruces();
}

function borrarTemporadaCruces() {
    const active = getTemporadaActivaId();
    if (!active) return;
    const temporada = getTemporadaById(active);
    const nombre = temporada?.nombre || active;
    if (!confirm(`¿Seguro que quieres borrar "${nombre}"?`)) return;

    const temporadas = eefGetTemporadasCruces().filter(t => t.id !== active);
    eefSetTemporadasCruces(temporadas);
    setTemporadaActivaId('');
    renderTemporadaControls();
    cargarYRenderizarCruces();
}

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    const ext = (page && page.endsWith('.php')) || path.includes('/Web/') ? '.php' : '.html';
    if (page === 'Gurutzatzeak' + ext) {
        inicializarGurutzatzeak();
    }
});