<?xml version="1.0" encoding="UTF-8"?>
<!-- Sailkapen taula transformatzeko XSLT-a -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
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
        <xsl:for-each select="sailkapena/errenkada">
          <xsl:sort select="number(pnt)" data-type="number" order="descending"/>
          <tr class="standings-row">
            <xsl:if test="position() &lt;= 2">
              <xsl:attribute name="class">standings-row top-two</xsl:attribute>
            </xsl:if>
            <xsl:if test="position() = last()">
              <xsl:attribute name="class">standings-row last</xsl:attribute>
            </xsl:if>
            <td class="position"><xsl:value-of select="position()"/></td>
            <td class="team-cell">
              <img src="{$base}{irudia}" alt="{taldea}" class="standings-img"/>
              <span><xsl:value-of select="taldea"/></span>
            </td>
            <td class="editable" data-field="irab"><xsl:value-of select="irab"/></td>
            <td class="editable" data-field="gald"><xsl:value-of select="gald"/></td>
            <td class="editable" data-field="pf"><xsl:value-of select="pf"/></td>
            <td class="editable" data-field="kp"><xsl:value-of select="kp"/></td>
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
