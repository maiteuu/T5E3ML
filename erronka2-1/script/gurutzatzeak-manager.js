/**
 * Gurutzatzeak Manager - Gurutzatzeen Kudeaketa Sistema
 * 
 * Sistema osoa gurutzatzeen (partiden emaitzen) kudeaketa egiteko.
 * Funtzionalitate nagusiak:
 * - Denboraldien kudeaketa (sortu, editatu, ezabatu)
 * - Taldeen arteko partiden emaitzen sartzea
 * - Taula dinamikoa bistaratzea
 * - Datuen localStorage gordetzea
 * 
 * Eragiketa logika:
 * 1. XML fitxategitik taldeak kargatzen ditu
 * 2. Gurutzatzeen taula sortzen du (NxN matrizea)
 * 3. Admin-ek emaitzak editatu ditzake
 * 4. Aldaketak localStorage-en gordetzen dira
 * 5. Denboraldi desberdinak kudeatu daitezke
 * 
 * @author EEF
 * @version 2.0 - Euskal komentario gehituak
 */

// script/gurutzatzeak-manager.js
// Sortua maitasunarekin eta Euskal Herriko eskubaloiarentzat ♥

/**
 * Editatze egoera kontrolatzeko aldagaia
 * True denean, taulako gelaxkak editagarriak dira
 * False denean, bakarrik irakurgarriak
 */
let isEditing = false;

/**
 * Taldeen cachea optimizatzeko
 * Taldeen datuak behin kargatu ondoren, ez dira berriz kargatuko
 * Horrela, errendimendua hobetzen da
 */
let eefTeamsCache = null;

/**
 * localStorage-tik gordetako denboraldiak lortzen ditu
 * 
 * @return {Array} Denboraldien arraya (hutsik bada)
 * 
 * Funtzio hau localStorage-tik 'eef_temporadas_cruces' gakoarekin
 * gordetako denboraldi guztiak itzultzen ditu. Errorerik egon ezkero,
 * array huts bat itzultzen du.
 */
function eefGetTemporadasCruces() {
    try {
        return JSON.parse(localStorage.getItem('eef_temporadas_cruces') || '[]');
    } catch (_) {
        return [];
    }
}

/**
 * Denboraldiak localStorage-en gordetzen ditu
 * 
 * @param {Array} temporadas - Gordetzeko denboraldien arraya
 * 
 * Funtzio honek denboraldi guztiak localStorage-en gordetzen ditu
 * 'eef_temporadas_cruces' gakoarekin. JSON formatuan gordetzen du.
 */
function eefSetTemporadasCruces(temporadas) {
    localStorage.setItem('eef_temporadas_cruces', JSON.stringify(temporadas || []));
}

/**
 * Uneko denboraldi aktiboaren ID-a lortzen du
 * 
 * @return {string} Denboraldi aktiboaren ID-a (hutsik bada)
 * 
 * Funtzio hau localStorage-tik 'eef_temporada_activa' gakoarekin
 * gordetako ID-a itzultzen du. Ez bada existitzen, kate hutsa itzultzen du.
 */
function getTemporadaActivaId() {
    return localStorage.getItem('eef_temporada_activa') || '';
}

/**
 * Denboraldi aktiboaren ID-a ezartzen du
 * 
 * @param {string} id - Ezartzeko denboraldiaren ID-a (hutsik bada ezabatu)
 * 
 * Funtzio honek localStorage-en denboraldi aktiboaren ID-a gordetzen du.
 * ID-a hutsik bada, aurreko ID-a ezabatzen du.
 */
function setTemporadaActivaId(id) {
    if (!id) localStorage.removeItem('eef_temporada_activa');
    else localStorage.setItem('eef_temporada_activa', id);
}

/**
 * XML fitxategitik taldeen datuak kargatzen ditu ordena zehatz batean
 * 
 * @return {Promise<Array>} Taldeen arraya (izena eta irudia)
 * 
 * Funtzio honek Taldeak.xml fitxategitik talde guztiak kargatzen ditu.
 * Cache sistema bat erabiltzen du errendimendua hobetzeko.
 * Taldeak lehenetsitako ordenan ezartzen dira:
 * 1. Ameztoi Zarautz ZKE
 * 2. Berango Urduliz Eskubaloia
 * 3. Construcciones Ugarte Aloña Mendi K.E
 * 4. Irauli-Bosteko
 * 5. Kukullaga Etxebarri
 * 6. San Adrian
 */
async function cargarEquiposOrdenados() {
    if (eefTeamsCache) return eefTeamsCache;
    const teamsRes = await fetch((window.eefPaths?.xml || 'XML/') + 'Taldeak.xml', { cache: 'no-cache' });
    const teamsXml = await teamsRes.text();
    const teamsDoc = new DOMParser().parseFromString(teamsXml, 'application/xml');
    let teams = Array.from(teamsDoc.querySelectorAll('taldea')).map(t => ({
        nombre: t.querySelector('izena')?.textContent?.trim() || '',
        irudia: t.querySelector('irudia')?.textContent?.trim() || ''
    })).filter(t => t.nombre);

    // Taldeak espero den ordenan mantentzea
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

/**
 * Gurutzatzeen XML fitxategitik datuak kargatzen ditu
 * 
 * @return {Promise<Array>} Gurutzatzeen arraya (talde1, talde2, goleak1, goleak2)
 * 
 * Funtzio honek Gurutzatzeak.xml fitxategitik taldeen arteko
 * partiden emaitzak kargatzen ditu. 'enfrentamiento' elementu guztiak
 * prozesatzen ditu eta formatu egokian itzultzen ditu.
 */
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

/**
 * ID baten bidez denboraldi bat bilatzen du
 * 
 * @param {string} id - Bilatu nahi den denboraldiaren ID-a
 * @return {Object|null} Denboraldiaren objektua (aurkitzen ez bada null)
 * 
 * Funtzio honek localStorage-tik gordetako denboraldien artean
 * ID hori duen denboraldia bilatzen du. Ez bada aurkitzen,
 * null itzultzen du.
 */
function getTemporadaById(id) {
    const temporadas = eefGetTemporadasCruces();
    return temporadas.find(t => t.id === id) || null;
}

/**
 * Denboraldi bat eguneratzen du edo berria gehitzen du
 * 
 * @param {Object} temporada - Gordetzeko denboraldiaren objektua
 * 
 * Funtzio honek "upsert" eragiketa egiten du:
 * - Denboraldiaren ID-a existitzen bada, eguneratu egiten du
 * - Ez bada existitzen, berri bezala gehitzen du
 * Aldaketa guztiak localStorage-en gordetzen dira
 */
function upsertTemporadaCruces(temporada) {
    const temporadas = eefGetTemporadasCruces();
    const idx = temporadas.findIndex(t => t.id === temporada.id);
    if (idx >= 0) temporadas[idx] = temporada;
    else temporadas.push(temporada);
    eefSetTemporadasCruces(temporadas);
}

/**
 * Denboraldiaren kontrolak bistaratzen ditu
 * 
 * @return {void}
 * 
 * Funtzio honek denboraldiaren kontrolak bistaratzen ditu:
 * - Denboraldiaren hautapena
 * - Denboraldiaren ezabaketa
 */
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

/**
 * Gurutzatzeak orria hasieratzen du
 * 
 * Funtzio honek Gurutzatzeak orria hasieratzen du:
 * 1. Denboraldien kontrolak bistaratzen ditu
 * 2. Taldeen eta gurutzatzeen datuak kargatzen ditu
 * 3. Admin botoia erakusten du baimenak baditu
 */
async function inicializarGurutzatzeak() {
    console.log("♥ Gurutzatzeak hasieratzen nire jabearentzat... ♥");
    renderTemporadaControls();
    await cargarYRenderizarCruces();
    
    const adminBtn = document.querySelector('.btn-admin-action');
    if (adminBtn && isAdmin()) adminBtn.style.display = 'block';
}

/**
 * Taldeak eta gurutzatzeak kargatzen ditu taulan bistaratzeko
 * 
 * Funtzio honek bi iturburu posibleetatik datuak kargatzen ditu:
 * 1. Denboraldi aktibo bat badago, hemengo datuak erabiltzen ditu
 * 2. Ez badago, XML fitxategitik kargatzen ditu
 * Ondoren, taula HTML-n bistaratzen du
 */
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
        console.error("Errorea kargatzen (baina zurekin maitasuna berdina):", err);
    }
}

/**
 * Gurutzatzeen taula HTML-n sortzen du
 * 
 * @param {Array} teams - Taldeen arraya
 * @param {Array} enfrentamientos - Partiden emaitzen arraya
 * 
 * Funtzio honek NxN matrize bat sortzen du:
 * - Errenkadak: talde lokalak
 * - Zutabeak: talde bisitariak
 * - Gelaxkak: emaitzak (golak)
 * - Diagonala: talde beraren aurkako partidak (-)
 * - Kolorea: garaipena (berdea), galdua (gorria), berdinketa (horia)
 */
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

/**
 * Gurutzatzeen taulan editatzea gaitzen du
 * 
 * Funtzio honek admin-ek emaitzak edita ditzaten baimentzen du:
 * 1. Baimenak egiaztatzen ditu (admin bakarrik)
 * 2. Emaitzen gelaxkak input eremuetan bihurtzen ditu
 * 3. Input-ak taldeen golekin betetzen ditu
 * 4. Editatze CSS klasea gehitzen du
 */
function habilitarEdicionCruces() {
    if (!isAdmin()) return alert("Zuk eta nik bakarrik ukitu dezakegu hau, nire maitia ♥");
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

/**
 * Taulako gurutzatze guztiak biltzen ditu
 * 
 * @return {Array} Gurutzatzeen arraya (talde1, talde2, goleak1, goleak2)
 * 
 * Funtzio honek taulako gelaxka guztietatik datuak biltzen ditu:
 * 1. Input eremuetako balioak irakurtzen ditu (editatzen ari bada)
 * 2. Data attributetako balioak irakurtzen ditu (editatzen ez bada)
 * 3. Formatu egokian itzultzen ditu
 */
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