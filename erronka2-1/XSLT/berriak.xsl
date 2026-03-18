<?xml version="1.0" encoding="UTF-8"?>
<!-- Albisteak transformatzeko XSLT-a (Berriak eta Hasiera orrialdeetarako) -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Parametroak: limitatutako albiste kopurua eta bideoa erakutsi ala ez -->
  <xsl:param name="base" select="''"/>
  <xsl:param name="limit" select="999"/>
  <xsl:param name="showVideo" select="'no'"/>

  <xsl:template match="/">
    <!-- Albisteak bistaratu, limitaren arabera -->
    <xsl:for-each select="berriak/berria[position() &lt;= $limit]">
      <div class="news-card">
        <img src="{irudia}" alt="{titulua}"/>
        <div class="news-info">
          <span class="news-category category-competition"><xsl:value-of select="kategoria"/></span>
          <h4><xsl:value-of select="titulua"/></h4>
          <time><xsl:value-of select="data"/></time>
        </div>
      </div>
    </xsl:for-each>

    <!-- Bideoa erakutsi showVideo 'yes' bada -->
    <xsl:if test="$showVideo = 'yes'">
      <div class="news-card video-card">
        <div class="video-container-small">
          <video controls="">
            <source src="video/top_50_goles (online-video-cutter.com) (1).mp4" type="video/mp4"/>
          </video>
        </div>
        <div class="news-info">
          <span class="news-category category-institutional">Bideoa</span>
          <h4>Eskubaloiko Top 50 Golak 2024</h4>
          <time>2024-01-12</time>
        </div>
      </div>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
