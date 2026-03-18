/**
 * Euskal Eskubaloi Federazioa - Funtzio Orokorra
 * 
 * JavaScript fitxategi honek web guneko funtzio orokorrak ditu:
 * - XML fitxategiak kargatzea
 * - XSLT transformazioak
 * - Eduki dinamikoa bistaratzea
 * - Slider-a kudeatzea
 * - Nabigazioa
 * 
 * Optimizaciones:
 * - Lazy loading
 * - Cache de XML/XSLT
 * - Async/await mejorado
 * - Error handling
 * 
 * @author EEF
 * @version 1.1 - Optimized
 */

// Cache para XML y XSLT
const xmlCache = new Map();
const xsltCache = new Map();
const CACHE_DURATION = 300000; // 5 minutos

/**
 * XML edo XSLT fitxategi bat kargatzen du eta DOM dokumentua itzultzen du.
 * Optimizado con cache y error handling.
 * @param {string} url - Kargatu nahi den fitxategiaren URL-a.
 * @returns {Promise<Document>}
 */
async function loadXML(url) {
    // Verificar cache primero
    const cached = xmlCache.get(url);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return cached.data;
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        
        // Guardar en cache
        xmlCache.set(url, {
            data: xmlDoc,
            timestamp: Date.now()
        });
        
        return xmlDoc;
    } catch (error) {
        console.error('Error loading XML:', error);
        throw error;
    }
}

/**
 * XML bat transformatzen du XSLT erabiliz eta emaitza edukiontzi batean txertatzen du.
 * @param {string} xmlUrl - XML fitxategiaren URL-a.
 * @param {string} xsltUrl - XSLT fitxategiaren URL-a.
 * @param {string} containerId - Emaitza txertatuko den HTML elementuaren ID-a.
 * @param {Object} params - XSLT-ari pasatu nahi zaizkion parametroak (aukerakoa).
 */
async function displayDynamicContent(xmlUrl, xsltUrl, containerId, params = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const xml = await loadXML(xmlUrl);
        const xslt = await loadXML(xsltUrl);

        if (window.XSLTProcessor) {
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xslt);

            // Pasatako parametroak XSLT prozesadorean ezarri
            Object.entries(params).forEach(([name, value]) => {
                xsltProcessor.setParameter(null, name, value);
            });

            const resultDocument = xsltProcessor.transformToFragment(xml, document);
            container.innerHTML = "";
            container.appendChild(resultDocument);
        } else {
            // Nabigatzaile zaharragoentzako euskarria (IE), beharrezkoa balitz,
            // gaur egun XSLTProcessor oso hedatua dagoen arren.
            console.error("XSLTProcessor ez da nabigatzaile honetan onartzen.");
        }
    } catch (error) {
        console.error("Errorea edukia kargatzean edo transformatzean:", error);
    }
}

// Hasieratze automatikoa uneko orrialdearen arabera
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const ext = (page && page.endsWith(".php")) || path.includes("/Web/") ? ".php" : ".html";
    const xmlBase = window.eefPaths?.xml || "../XML/";
    const xsltBase = window.eefPaths?.xslt || "../XSLT/";

    console.log("Detektatutako orria:", page || "erroa");

    // Optimización: Carga diferida para mejor rendimiento
    const loadContent = async () => {
        try {
            if (page === "Berriak" + ext) {
                await displayDynamicContent(xmlBase + "berriak.xml", xsltBase + "berriak.xsl", "news-container");
            } else if (page === "Hasiera" + ext || page === "index.html" || page === "" || page === "index.php") {
                // Hasiera orrialderako lehenengo 3 albisteak eta bideoa kargatzen ditugu
                await displayDynamicContent(xmlBase + "berriak.xml", xsltBase + "berriak.xsl", "home-news-container", { limit: 3, showVideo: 'yes' });
            } else if (page === "Fitxaketak" + ext) {
                await displayDynamicContent(xmlBase + "Fitxaketak.xml", xsltBase + "Fitxaketak.xsl", "fitxaketak-container");
            } else if (page === "Taldeak" + ext) {
                await displayDynamicContent(xmlBase + "Taldeak.xml", xsltBase + "Taldeak.xsl", "teams-container");
            } else if (page === "Sailkapena" + ext) {
                await displayDynamicContent(xmlBase + "Sailkapena.xml", xsltBase + "Sailkapena.xsl", "standings-container");
            }
        } catch (error) {
            console.error('Error cargando contenido dinámico:', error);
            // El fallback se maneja en las páginas individuales
        }
    };

    // Cargar contenido con un pequeño retraso para no bloquear el renderizado
    setTimeout(loadContent, 100);
});
