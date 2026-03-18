<?xml version="1.0" encoding="UTF-8"?>
<!-- Fitxaketen orrialderako datuak transformatzeko XSLT-a -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:param name="base" select="''"/>
  <xsl:template match="/">
    <div class="fitxaketak-wrapper">
      <xsl:for-each select="fitxaketak/fitxaketa">
        <div class="fitxaketa-card">
          <div class="fitxaketa-info">
            <h2 class="player-name"><xsl:value-of select="izena"/></h2>
            <p class="player-desc"><xsl:value-of select="informazioa"/></p>
            <p class="player-pos"><strong>Posizioa: </strong><xsl:value-of select="posizioa"/></p>
            <p class="player-goals"><strong>Golak: </strong><xsl:value-of select="golak"/></p>
            <p class="player-price"><strong>Prezioa: </strong><xsl:value-of select="prezioa"/></p>
          </div>
          <div class="fitxaketa-teams">
            <div class="team">
              <img src="{$base}{jatorriaIrudia}" alt="{jatorria}" title="{jatorria}"/>
            </div>
            <div class="arrow">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
            <div class="team">
              <img src="{$base}{helburuaIrudia}" alt="{helburua}" title="{helburua}"/>
            </div>
          </div>
        </div>
      </xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>
