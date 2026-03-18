<?xml version="1.0" encoding="UTF-8"?>
<!-- Taldeen orrialderako datuak transformatzeko XSLT-a -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <xsl:for-each select="taldeak/taldea">
      <div class="team-card">
        <div class="team-image-container">
          <h3 class="team-name"><xsl:value-of select="izena"/></h3>
          <img src="{irudia}" alt="{izena}" class="team-img"/>
        </div>
        <div class="team-info">
          <p><xsl:value-of select="deskribapena"/></p>
        </div>
        <div class="team-buttons">
          <button class="btn-team" onclick="window.open('{info_url}', '_blank')">Info Gehigarriak</button>
        </div>
      </div>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
