function getCurrentSession() {
    const session = localStorage.getItem("eef_session");
    return session ? JSON.parse(session) : null;
}

function isAdmin() {
    const session = getCurrentSession();
    return session && (session.role === "admin" || session.role === "moderador");
}

/**
 * XML edo XSLT fitxategi bat kargatzen du eta DOM dokumentua itzultzen du.
 * @param {string} url - Kargatu nahi den fitxategiaren URL-a.
 * @returns {Promise<Document>}
 */
async function loadXML(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "application/xml");
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

            // Parametro orokorrak: proiektuaren base prefijoa (../ Web/*-rako)
            const basePrefix = window.eefPaths?.base ?? "";
            xsltProcessor.setParameter(null, "base", basePrefix);

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
    const xmlBase = window.eefPaths?.xml || "XML/";
    const xsltBase = window.eefPaths?.xslt || "XSLT/";

    console.log("Detektatutako orria:", page || "erroa");

    if (page === "Berriak" + ext) {
        displayDynamicContent(xmlBase + "berriak.xml", xsltBase + "berriak.xsl", "news-container");
    } else if (page === "Hasiera" + ext || page === "index.html" || page === "" || page === "index.php") {
        // Hasiera orrialderako lehenengo 3 albisteak eta bideoa kargatzen ditugu
        displayDynamicContent(xmlBase + "berriak.xml", xsltBase + "berriak.xsl", "home-news-container", { limit: 3, showVideo: 'yes' });
    } else if (page === "Partidak" + ext) {
        displayDynamicContent(xmlBase + "Fitxaketak.xml", xsltBase + "Fitxaketak.xsl", "fitxaketak-container");
    } else if (page === "Sailkapena" + ext) {
        // Sailkapena starts empty on page load - only populated when admin saves Gurutzatzeak changes
        console.log("Sailkapena página cargada (vacía inicialmente)");
    } else if (page === "Gurutzatzeak" + ext) {
        // Gurutzatzeak starts empty - only admin can populate by editing and saving
        console.log("Gurutzatzeak página cargada (vacía inicialmente)");
    }
});
