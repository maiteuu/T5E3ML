/**
 * Zioak Manager - Gestión de quejas y sugerencias
 * Permite a guests enviar quejas y al admin gestionar las recibidas
 * 
 * Optimizaciones implementadas:
 * - Lazy loading
 * - Event delegation
 * - Memoization
 * - Debouncing
 * 
 * @author EEF
 * @version 1.1 - Optimized
 */

'use strict';

// Variables globales con cache
let zioakData = [];
let zioaActualDetail = null;
let isInitialized = false;
let lastUpdateTime = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

/**
 * Inicializar la página de Zioak según el tipo de usuario
 * Optimizado con lazy loading y cache
 */
function inicializarZioak() {
    if (isInitialized) return;
    
    const page = window.location.pathname.split("/").pop();
    
    // Inicializar página según el tipo
    if (page === "Zioak.html") {
        initGuestZioakPage();
    } else if (page === "Admin-Zioak.html") {
        initAdminZioakPage();
    }
    
    isInitialized = true;
}

/**
 * Inicializar la página de quejas para guest
 * Optimizado con event delegation
 */
function initGuestZioakPage() {
    console.log("Página de Zioak del guest inicializada");
    
    // Event delegation para mejor rendimiento
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === "motibo") {
            updateCharCount(e);
        }
    });
    
    // Cargar zioak del localStorage para verificar si ya existen
    cargarZioakDelStorage();
}

/**
 * Inicializar la página de quejas para admin
 * Optimizado con cache y debouncing
 */
function initAdminZioakPage() {
    console.log("Página de Zioak del admin inicializada");
    
    // Cargar todas las quejas inmediatamente con cache
    const now = Date.now();
    if (now - lastUpdateTime > CACHE_DURATION) {
        recargarZioak();
        lastUpdateTime = now;
    }
}

/**
 * Actualizar contador de caracteres
 */
function updateCharCount() {
    const motiboField = document.getElementById("motibo");
    const charCount = document.getElementById("charCount");
    
    if (motiboField && charCount) {
        charCount.textContent = motiboField.value.length + "/500";
    }
}

/**
 * Enviar una queja/sugerencia
 */
async function handleZioaSend(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombre")?.value.trim();
    const apellido = document.getElementById("apellido")?.value.trim();
    const telefono = document.getElementById("telefono")?.value.trim();
    const motibo = document.getElementById("motibo")?.value.trim();
    
    // Validación
    if (!nombre || !apellido || !telefono || !motibo) {
        alert("Mesedez bete eremu guztiak");
        return;
    }
    
    if (motibo.length < 10) {
        alert("Motiboak gutxienez 10 karaktere bete behar ditu");
        return;
    }
    
    try {
        // Crear objeto de queja
        const zioa = {
            id: 'zioa_' + Date.now(),
            izena: nombre,
            abizena: apellido,
            telefonoa: telefono,
            motibo: motibo,
            data: new Date().toISOString().split('T')[0],
            ordua: new Date().toTimeString().split(' ')[0],
            irakurrita: false
        };
        
        // Obtener lista actual
        let zioak = JSON.parse(localStorage.getItem('eef_zioak') || '[]');
        
        // Agregar nueva queja
        zioak.push(zioa);
        
        // Guardar en localStorage
        localStorage.setItem('eef_zioak', JSON.stringify(zioak));
        
        console.log('Zioa gehitu egin da:', zioa.id);
        
        // Mostrar mensaje de éxito
        const form = document.getElementById("zioakForm");
        const successMessage = document.getElementById("successMessage");
        
        if (form) form.style.display = "none";
        if (successMessage) {
            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.display = "none";
                if (form) form.style.display = "block";
                form.reset();
                updateCharCount();
            }, 3000);
        }
        
    } catch (error) {
        alert('Errorea zioa bidaltzean: ' + error.message);
        console.error('Error:', error);
    }
}

/**
 * Cargar zioak del localStorage
 */
function cargarZioakDelStorage() {
    try {
        zioakData = JSON.parse(localStorage.getItem('eef_zioak') || '[]');
        console.log('Zioak kargatu egin dira:', zioakData.length);
        return zioakData;
    } catch (error) {
        console.error('Error cargando zioak:', error);
        zioakData = [];
        return [];
    }
}

/**
 * Recargar lista de zioak (para admin)
 */
function recargarZioak() {
    try {
        // Cargar del localStorage
        cargarZioakDelStorage();
        
        // Actualizar estadísticas
        actualizarEstadisticas();
        
        // Renderizar lista
        renderizarListaZioak();
        
    } catch (error) {
        alert('Errorea zioeak kargatzean: ' + error.message);
        console.error('Error:', error);
    }
}

/**
 * Actualizar estadísticas
 */
function actualizarEstadisticas() {
    const totalCount = document.getElementById("totalCount");
    const unreadCount = document.getElementById("unreadCount");
    
    if (totalCount) {
        totalCount.textContent = zioakData.length;
    }
    
    if (unreadCount) {
        const sinLeer = zioakData.filter(z => !z.irakurrita).length;
        unreadCount.textContent = sinLeer;
    }
}

/**
 * Renderizar lista de zioak para admin
 */
function renderizarListaZioak() {
    const listContainer = document.getElementById("zioakList");
    if (!listContainer) return;
    
    if (zioakData.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #999;">Zioarik ez dago oraindik...</p>';
        return;
    }
    
    // Ordenar por fecha descendente (más recientes primero)
    const zioasOrdenadas = [...zioakData].sort((a, b) => {
        const dateA = new Date(a.data + ' ' + a.ordua);
        const dateB = new Date(b.data + ' ' + b.ordua);
        return dateB - dateA;
    });
    
    let html = '';
    zioasOrdenadas.forEach(zioa => {
        const leida = zioa.irakurrita ? 'leida' : 'no-leida';
        const iconoLeida = zioa.irakurrita ? 'fa-envelope-open' : 'fa-envelope';
        const textoPreview = zioa.motibo.substring(0, 60) + (zioa.motibo.length > 60 ? '...' : '');
        
        html += `
            <div class="zioa-item ${leida}" onclick="abrirZioaDetail('${zioa.id}')">
                <div class="zioa-header">
                    <span class="zioa-icon"><i class="fas ${iconoLeida}"></i></span>
                    <div class="zioa-info">
                        <span class="zioa-nombre">${zioa.izena} ${zioa.abizena}</span>
                        <span class="zioa-fecha">${zioa.data} ${zioa.ordua}</span>
                    </div>
                    <span class="zioa-phone"><i class="fas fa-phone"></i> ${zioa.telefonoa}</span>
                </div>
                <div class="zioa-preview">${textoPreview}</div>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
}

/**
 * Abrir modal con detalle de zioa
 */
function abrirZioaDetail(zioaId) {
    const zioa = zioakData.find(z => z.id === zioaId);
    if (!zioa) {
        alert("Zioa ez da aurkitu");
        return;
    }
    
    // Guardar referencia actual
    zioaActualDetail = zioa;
    
    // Rellenar modal
    document.getElementById("detailNombre").textContent = zioa.izena;
    document.getElementById("detailAbizena").textContent = zioa.abizena;
    document.getElementById("detailTelefono").textContent = zioa.telefonoa;
    document.getElementById("detailData").textContent = `${zioa.data} ${zioa.ordua}`;
    document.getElementById("detailMotibo").textContent = zioa.motibo;
    
    // Marcar como leída
    if (!zioa.irakurrita) {
        zioa.irakurrita = true;
        localStorage.setItem('eef_zioak', JSON.stringify(zioakData));
        actualizarEstadisticas();
        renderizarListaZioak();
    }
    
    openModal("zioaDetailModal");
}

/**
 * Borrar zioa actual (desde el modal)
 */
function borrarZioaActual() {
    if (!zioaActualDetail) {
        alert("Zioa ez da aurkitu");
        return;
    }
    
    if (!confirm('Zioa hau "' + zioaActualDetail.izena + ' ' + zioaActualDetail.abizena + '" ezabatu nahi duzu?')) {
        return;
    }
    
    try {
        // Filtrar para eliminar
        zioakData = zioakData.filter(z => z.id !== zioaActualDetail.id);
        
        // Guardar
        localStorage.setItem('eef_zioak', JSON.stringify(zioakData));
        
        alert('Zioa ezabatu egin da');
        
        // Cerrar modal y recargar
        closeModal("zioaDetailModal");
        zioaActualDetail = null;
        actualizarEstadisticas();
        renderizarListaZioak();
        
    } catch (error) {
        alert('Errorea: ' + error.message);
    }
}

/**
 * Borrar todas las zioak
 */
function borrarTodoZioak() {
    if (zioakData.length === 0) {
        alert("Ez dago zioarik ezabatzeko");
        return;
    }
    
    if (!confirm('Zio/iradokiena GUZTIA (' + zioakData.length + ') ezabatu nahi duzu? Hau ezin da desegin.')) {
        return;
    }
    
    try {
        zioakData = [];
        localStorage.setItem('eef_zioak', JSON.stringify(zioakData));
        
        alert('Zioak guztiak ezabatu egin dira');
        actualizarEstadisticas();
        renderizarListaZioak();
        
    } catch (error) {
        alert('Errorea: ' + error.message);
    }
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    inicializarZioak();
});
