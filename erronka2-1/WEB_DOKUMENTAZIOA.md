# Euskal Eskubaloi Federazioa - Web Guneari Buruzko Dokumentazioa

## Sarrera

Web hau Euskal Eskubaloi Federazioaren (EEF) web gune ofiziala da. PHP, HTML, CSS, JavaScript eta XML teknologietan oinarritzen da. Web guneak eskubaloiari buruzko informazioa ematen du: berriak, sailkapenak, partidak, egutegia, taldeak eta arbitrajea.

## Arkitektura Orokorra

Web guneak MVC (Model-View-Controller) antzeko egitura du, non:
- **Model**: XML fitxategiak datuak gordetzeko
- **View**: PHP fitxategiak HTML bista erakusteko
- **Controller**: PHP script-ak eta JavaScript-ak datuak kudeatzeko

## Direktorio Egitura

```
erronka2-1/
├── index.php                 # Sarrera puntua
├── WEB_DOKUMENTAZIOA.md      # Dokumentazio hau
├── Web/                      # Web orri nagusiak
├── php/                      # PHP API script-ak
├── XML/                      # Datu-basea (XML fitxategiak)
├── CSS/                      # Estilo fitxategiak
├── script/                   # JavaScript fitxategiak
├── includes/                 # Header eta footer komunak
├── Irudiak/                  # Irudiak
├── XSD/                      # XML eskemak
├── XSLT/                     # XML transformazioak
└── video/                    # Bideoak
```

## Sistema Orokorraren Funzionamendua

### Datuen Zirkuitua
1. **Erabiltzailea** → Web orria bisitatzen du
2. **PHP orria** → XML fitxategietatik datuak irakurtzen ditu
3. **JavaScript** → Datuak prozesatzen eta bistaratzen ditu
4. **Administratzailea** → PHP script-en bidez datuak eguneratzen ditu
5. **XML fitxategiak** → Datuak gordetzen ditu

### Fitxategi Nagusien Funtzioak

#### 1. Sarrera Puntua
- `index.php`: Web guneko ateburu nagusia

#### 2. Orri Nagusiak (`Web/`)
- `Hasiera.php`: Hasiera orria, berriak, slider-a
- `Berriak.php`: Berri guztien zerrenda
- `Sailkapena.php`: Ligako sailkapenak
- `Gurutzatzeak.php`: Partiden gurutzatzeak
- `Egutegia.php`: Partiden egutegia
- `Partidak.php`: Partiden fitxaketak
- `Taldeak.php`: Taldeen zerrenda
- `Taldea.php`: Talde bakoitzaren xehetasunak
- `Zioak.php`: Kexak eta iradokizunak
- `Admin-Zioak.php`: Kexen kudeaketa

#### 3. PHP API (`php/`)
- `eguneratu-*.php`: Datuak eguneratzeko script-ak
- `gorde-*.php`: Datuak gordetzeko script-ak
- `balidatu.php`: Datuak balidatzeko funtzioak

#### 4. Datu Basea (`XML/`)
- `berriak.xml`: Berrien datuak
- `Sailkapena.xml`: Sailkapenaren datuak
- `Taldeak.xml`: Taldeen datuak
- `Gurutzatzeak.xml`: Gurutzatzeen datuak
- `Fitxaketak.xml`: Fitxaketen datuak
- `Zioak.xml`: Kexen datuak
- `erabiltzaileak.xml`: Erabiltzaileen datuak

#### 5. JavaScript (`script/`)
- `main.js`: Funtzio orokorrak
- `slider.js`: Irudi slider-a
- `*-manager.js`: Kudeaketa moduluak
- `autentifikazioa.js`: Saio-hasiera
- `mod-funtzioak.js`: Moderazioa

#### 6. Estiloak (`CSS/`)
- `CSS.css`: Estilo nagusi guztiak

#### 7. Modulu Komunak (`includes/`)
- `header.php`: Goiburuko nabigazioa
- `footer.php`: Oin-ohar orokorra

## Teknologiak

- **Backend**: PHP 7.0+
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Datuen biltegiratze**: XML
- **Estiloak**: CSS Grid, Flexbox
- **Ikonoak**: Font Awesome
- **Tipografia**: Inter font-familia

## Segurtasun Neurriak

1. **Balidazioa**: Datu guztiak balidatzen dira `balidatu.php` fitxategian
2. **Sanitizazioa**: `htmlspecialchars()` erabiltzen da XSS erasoak saihesteko
3. **Backup-ak**: XML fitxategien kopia automatikoak egiten dira
4. **Session-ak**: Saio-kudeaketa segurua
5. **HTTP metodoak**: POST erabiltzen da datuak eguneratzeko

## Erabiltzaile Motak

1. **Bisitaria arrunta**: Berriak, sailkapenak, partidak ikusten ditu
2. **Administratzailea**: Datu guztiak kudeatzen ditu
3. **Moderatzailea**: Kexak eta iradokizunak kudeatzen ditu

## Garapenerako Gomendioak

1. **XML egitura mantendu**: Datuak XML fitxategietan gordetzen dira
2. **PHP script-ak erabili**: Datuak eguneratzeko
3. **JavaScript erabili**: Interakzio dinamikoak lortzeko
4. **CSS erabili**: Diseinu errespontsiboa lortzeko
5. **Backup-ak egin**: Datuak galdu aurretik segurtasun kopiak egin

## Ondorioak

Web gune hau eskubaloi federazioarentzat diseinatuta dago, eta berezko ezaugarriak ditu:
- Euskarazko interfazea
- Datuak kudeatzeko sistema erraza
- Diseinu modernoa eta errespontsiboa
- Segurtasun neurriak
- Administratzaileentzako tresnak

Sistema hau erraza da mantentzeko eta hedatzeko, XML egitura argia duelako eta PHP script-ak modularak direlako.
