// Variable global para almacenar usuarios cargados del XML
let VALID_ACCOUNTS = {};

/**
 * Helpers de rutas para soportar:
 * - páginas en raíz (*.html)
 * - páginas PHP dentro de /Web (*.php)
 */
function eefIsWebContext() {
    const path = window.location.pathname || "";
    return path.endsWith(".php") || path.includes("/Web/");
}

function eefBasePrefix() {
    // Si la página está en /Web/*, los recursos están un nivel arriba
    return eefIsWebContext() ? "../" : "";
}

// Exponer rutas normalizadas para el resto de scripts
window.eefPaths = {
    base: eefBasePrefix(),
    xml: eefBasePrefix() + "XML/",
    xslt: eefBasePrefix() + "XSLT/",
    php: eefBasePrefix() + "php/",
    script: eefBasePrefix() + "script/",
    web: eefIsWebContext() ? "" : "Web/"
};

/**
 * Carga los usuarios desde el archivo XML
 */
async function cargarUsuarios() {
    try {
        const xmlPath = window.eefPaths.xml + 'erabiltzaileak.xml';
        const response = await fetch(xmlPath);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        
        // Parsear usuarios del XML
        const usuarios = xmlDoc.querySelectorAll('erabiltzaile');
        VALID_ACCOUNTS = {};
        
        usuarios.forEach(user => {
            const izena = user.querySelector('izena')?.textContent;
            const pasahitza = user.querySelector('pasahitza')?.textContent;
            const rola = user.querySelector('rola')?.textContent;
            
            if (izena && pasahitza && rola) {
                VALID_ACCOUNTS[izena] = {
                    password: pasahitza,
                    role: rola
                };
            }
        });
        
        console.log('Erabiltzaileak kargatu egin dira:', Object.keys(VALID_ACCOUNTS));
    } catch (error) {
        console.error('Errorea erabiltzaileak kargatzerakoan:', error);
        // Fallback a usuarios hardcodeados por seguridad
        VALID_ACCOUNTS = {
            admin: { password: "admin", role: "admin" },
            guest: { password: "guest", role: "guest" }
        };
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Mesedez bete erabiltzailea eta pasahitza.");
        return;
    }

    const account = VALID_ACCOUNTS[username];

    if (!account || account.password !== password) {
        alert("Erabiltzailea edo pasahitza okerra.");
        return;
    }

    const sessionData = {
        username: username,
        role: account.role,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem("eef_session", JSON.stringify(sessionData));
    // Si está en Sarrera.html o Sarrera.php, redirigir a Hasiera; si no, recargar la página actual
    const currentPage = window.location.pathname.split("/").pop();
    const isPhp = currentPage.endsWith('.php') || window.location.pathname.includes('/Web/');
    const ext = isPhp ? '.php' : '.html';
    
    if (currentPage === "Sarrera.html" || currentPage === "Sarrera.php" || currentPage === "") {
        window.location.href = "Hasiera" + ext;
    } else {
        window.location.reload();
    }
}

function getCurrentSession() {
    const session = localStorage.getItem("eef_session");
    return session ? JSON.parse(session) : null;
}

function isLoggedIn() {
    return getCurrentSession() !== null;
}

function isAdmin() {
    const session = getCurrentSession();
    return session && (session.role === "admin" || session.role === "moderador");
}

function logout() {
    const isPhp = window.location.pathname.endsWith('.php') || window.location.pathname.includes('/Web/');
    const ext = isPhp ? '.php' : '.html';
    localStorage.removeItem("eef_session");
    window.location.href = "Sarrera" + ext;
}

function injectUserHeader() {
    const session = getCurrentSession();
    const header = document.querySelector(".header");

    if (!header) return;

    // Eliminar cualquier user-info existente
    const existingUserInfo = header.querySelector(".user-info");
    if (existingUserInfo) {
        existingUserInfo.remove();
    }

    let userInfoHTML = "";

    if (session) {
        let rolText = "Bisitaria";
        let badgeHTML = "";
        
        if (session.role === "admin") {
            rolText = "Administratzailea";
            badgeHTML = '<span class="admin-badge">ADMIN</span>';
        } else if (session.role === "moderador") {
            rolText = "Moderatzailea";
            badgeHTML = '<span class="admin-badge">MODERADOR</span>';
        }
        
        userInfoHTML = `
            <div class="user-info">
                <span class="user-role" data-role="${session.role}">
                    ${rolText}
                </span>
                <span class="user-name">${session.username}</span>
                ${badgeHTML}
                <button class="btn-logout" onclick="logout()" title="Saioa itxi">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
    } else {
        const isPhp = window.location.pathname.endsWith('.php') || window.location.pathname.includes('/Web/');
        const ext = isPhp ? '.php' : '.html';
        userInfoHTML = `
            <div class="user-info">
                <a href="Sarrera${ext}" class="btn-login-link">Saioa Hasi</a>
            </div>
        `;
    }

    const headerTop = header.querySelector(".header-top");
    if (headerTop) {
        headerTop.insertAdjacentHTML("beforeend", userInfoHTML);
    } else {
        header.insertAdjacentHTML("beforeend", userInfoHTML);
    }
}

function showAdminPanel() {
    if (isAdmin()) {
        const adminPanels = document.querySelectorAll(".admin-panel");
        adminPanels.forEach(panel => {
            panel.classList.add("visible");
        });
        
        // Mostrar botones de edición solo para admin
        const adminOnlyButtons = document.querySelectorAll(".admin-only");
        adminOnlyButtons.forEach(btn => {
            btn.style.display = "block";
        });
    }
}

function toggleRestrictedLinks() {
    const logged = isLoggedIn();
    const isAdminUser = isAdmin();
    const session = getCurrentSession();
    const isPhp = window.location.pathname.endsWith('.php') || window.location.pathname.includes('/Web/');
    const ext = isPhp ? '.php' : '.html';
    
    // Buscar todos los enlaces en la navegación
    const navLinks = document.querySelectorAll(".nav-links a");
    
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        
        // Gurutzatzeak, Partizipak, Partidak - para admin y moderador
        const adminPages = ["Gurutzatzeak" + ext, "Partizipak" + ext, "Partidak" + ext];
        if (adminPages.includes(href) && !isAdminUser) {
            link.parentElement.style.display = "none";
        } else if (adminPages.includes(href) && isAdminUser) {
            link.parentElement.style.display = "";
        }
        
        // Zioak - solo para erabiltzaile arruntak (ez admin, ez moderatzaile)
        if (href === "Zioak" + ext) {
            if (
                !logged ||
                (session && (session.role === "admin" || session.role === "moderador"))
            ) {
                link.parentElement.style.display = "none";
            } else {
                link.parentElement.style.display = "";
            }
        }
    });
}

function protectRestrictedPages() {
    // Proteger acceso directo a páginas restringidas
    const path = window.location.pathname;
    const page = path.split("/").pop();
    const session = getCurrentSession();
    const isPhp = path.endsWith('.php') || path.includes('/Web/');
    const ext = isPhp ? '.php' : '.html';
    
    // Zioak - solo para guest (logged in pero no admin y no moderador)
    if (page === "Zioak" + ext) {
        if (!isLoggedIn()) {
            window.location.href = "Sarrera" + ext;
            return;
        }
        if (session && (session.role === "admin" || session.role === "moderador")) {
            // Admin eta moderatzaileak ezin dute bidali (bandejara/hasierara doa)
            window.location.href = "Admin-Zioak" + ext;
            return;
        }
    }
    
    // Zioak-Guest - solo para guest (logged in pero no admin)
    if (page === "Zioak-Guest" + ext) {
        if (!isLoggedIn()) {
            window.location.href = "Sarrera" + ext;
            return;
        }
        if (session && session.role === "admin") {
            // Admin no tiene acceso
            window.location.href = "Admin-Zioak" + ext;
            return;
        }
    }
    
    // Admin-Zioak - solo para admin (no moderador, no guest)
    if (page === "Admin-Zioak" + ext) {
        if (!session || session.role !== "admin") {
            window.location.href = "Hasiera" + ext;
            return;
        }
    }
    
    // Gurutzatzeak, Partizipak, Partidak - para admin y moderador
    const adminPages = ["Gurutzatzeak" + ext, "Partizipak" + ext, "Partidak" + ext];
    if (adminPages.includes(page) && !isAdmin()) {
        // No es admin ni moderador, redirigir a inicio
        window.location.href = "Hasiera" + ext;
    }
}

/**
 * Redirige a la página de quejas según el rol del usuario
 * - Admin: Admin-Zioak (bandeja de entrada)
 * - Guest: Zioak (enviar quejas)
 * - No autenticado: Sarrera (login)
 */
function irAQuejas(event) {
    // Permitir usarlo desde <a href="..."> como fallback sin recargar
    try {
        event?.preventDefault?.();
        event?.stopPropagation?.();
    } catch (_) {
        // noop
    }

    const session = getCurrentSession();
    const isPhp = window.location.pathname.endsWith('.php') || window.location.pathname.includes('/Web/');
    const ext = isPhp ? '.php' : '.html';
    
    if (!session) {
        // No está autenticado
        window.location.href = "Sarrera" + ext;
        return;
    }
    
    if (session.role === "admin") {
        // Admin ve la bandeja de entrada
        window.location.href = "Admin-Zioak" + ext;
    } else {
        // Guest (y moderador) pueden enviar quejas
        window.location.href = "Zioak" + ext;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Cargar usuarios desde XML antes de hacer cualquier otra cosa
    await cargarUsuarios();
    
    injectUserHeader();
    showAdminPanel();
    toggleRestrictedLinks();
    protectRestrictedPages();
});
