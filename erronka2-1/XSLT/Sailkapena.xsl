<?xml version="1.0" encoding="UTF-8"?>
<!-- 
  Euskal Eskubaloi Federazioa - Sailkapenen XSLT Transformazioa
  
  XSLT honek sailkapenen XML datuak HTML taula formatura biurtzen ditu.
  Funtzioak:
  - Sailkapen taula sortzea (standings-table)
  - Taldeen ordenamendua automatikoa
  - Kalkulu automatikoak (PT, Puntuak)
  - CSS klaseak aplikatzea
  - Editagarritasun atributuak gehitzea
  
  Egitura:
  - #: Posizio zenbakia (1, 2, 3...)
  - Taldea: Taldearen izena eta logoa
  - Irab.: Irabazitako partidak
  - Gald.: Galduko partidak
  - PF: Puntuak Favor (markatutako golak)
  - KP: Puntuak Kontra (jasoako golak)
  - PT: Partida totalak (irabaziak + galduak)
  - Punt.: Puntuazio totala (PF - KP)
  
  Kalkuluak:
  - PT = irabaziak + galduak
  - Punt. = PF - KP
  
  Erabilera:
  - Sailkapena orrian erabiltzen da
  - Admin-ek taula editatzeko aukera du
  - JavaScript-ekin interakzioak gaitzeko
  - CSS klaseekin estiloak aplikatzeko
  
  Output-a: HTML taula (standings-table)
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Bide-oinarri parametroa irudientzat -->
  <xsl:param name="base" select="''"/>
  
  <xsl:template match="/">
    <table class="standings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Taldea</th>
          <th>Irab.</th>
          <th>Gald.</th>
          <th>PF</th>
          <th>KP</th>
          <th>PT</th>
          <th>Punt.</th>
        </tr>
      </thead>
      <tbody>
        <!-- Taulako errenkadak prozesatu -->
        <xsl:for-each select="sailkapena/errenkada">
          <!-- Puntuazioaren arabera ordenatu (beherantz) -->
          <xsl:sort select="number(pnt)" data-type="number" order="descending"/>
          <tr class="standings-row">
            <!-- Lehen bi errenkadei estilo berezia -->
            <xsl:if test="position() &lt;= 2">
              <xsl:attribute name="class">standings-row top-two</xsl:attribute>
            </xsl:if>
            <!-- Azken errenkadari estilo berezia -->
            <xsl:if test="position() = last()">
              <xsl:attribute name="class">standings-row last</xsl:attribute>
            </xsl:if>
            
            <!-- Posizioa -->
            <td class="position"><xsl:value-of select="position()"/></td>
            
            <!-- Taldea (irudia + izena) -->
            <td class="team-cell">
              <img src="{$base}{irudia}" alt="{taldea}" class="standings-img"/>
              <span><xsl:value-of select="taldea"/></span>
            </td>
            
            <!-- Eremu editagarriak -->
            <td class="editable" data-field="irab"><xsl:value-of select="irab"/></td>
            <td class="editable" data-field="gald"><xsl:value-of select="gald"/></td>
            <td class="editable" data-field="pf"><xsl:value-of select="pf"/></td>
            <td class="editable" data-field="kp"><xsl:value-of select="kp"/></td>
            
            <!-- Kalkulatutako eremuak -->
            <td class="calculated" data-calc="pt">
              <xsl:value-of select="number(irab) + number(gald)"/>
            </td>
            <td class="calculated points" data-calc="punt">
              <xsl:value-of select="number(pf) - number(kp)"/>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
