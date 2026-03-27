<?xml version="1.0" encoding="UTF-8"?>
<!-- 
  Euskal Eskubaloi Federazioa - Berrien XSLT Transformazioa
  
  XSLT honek berrien XML datuak HTML formatura biurtzen ditu.
  Funtzioak:
  - Berri txartelak sortzea (news-card)
  - Irudiak bistaratzea
  - Kategorien arabera koloreak ezartzea
  - Datak formatatzea
  - Bideoa txertatzea (aukerakoa)
  
  Parametroak:
  - base: Bide-oinarria (irudientzat)
  - limit: Bistaratuko berrien kopuru maximoa
  - showVideo: Bideoa erakutsi ala ez (yes/no)
  
  Erabilera:
  - Berriak orrian erabiltzen da
  - Hasiera orrian (3 berri + bideoa)
  - CSS klaseekin estiloak aplikatzeko
  
  Output-a: HTML txartelak (news-card)
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!-- Parametroak: limitatutako albiste kopurua eta bideoa erakutsi ala ez -->
  <xsl:param name="base" select="''"/>
  <xsl:param name="limit" select="999"/>
  <xsl:param name="showVideo" select="'no'"/>

  <xsl:template match="/">
    <!-- Albisteak bistaratu, limitaren arabera -->
    <xsl:for-each select="berriak/berria[position() &lt;= $limit]">
      <div class="news-card">
        <img src="{concat($base, irudia)}" alt="{titulua}"/>
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
            <source src="{concat($base, 'video/top_50_goles_(online-video-cutter.com).mp4')}" type="video/mp4"/>
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
