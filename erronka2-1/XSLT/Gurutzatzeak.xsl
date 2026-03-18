<?xml version="1.0" encoding="UTF-8"?>
<!-- Tabla de cruces transformada a HTML -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  
  <!-- Variable global para los equipos únicos -->
  <xsl:variable name="uniqueTeams" select="//enfrentamiento/equipo1[not(. = preceding::*/equipo1)]"/>
  
  <xsl:template match="/">
    <div class="cruces-container">
      <table class="cruces-table">
        <thead>
          <tr>
            <th class="equipo-header">Taldea</th>
            <th class="vs-equipo">Ameztoi Z.</th>
            <th class="vs-equipo">Berango U.</th>
            <th class="vs-equipo">Aloña M.</th>
            <th class="vs-equipo">Irauli-B.</th>
            <th class="vs-equipo">Kukullaga</th>
            <th class="vs-equipo">San Adrian</th>
          </tr>
        </thead>
        <tbody>
          <!-- Fila Ameztoi Zarautz ZKE -->
          <tr>
            <td class="equipo-name">Ameztoi Z.</td>
            <td class="resultado diagonal">-</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Ameztoi Zarautz ZKE</xsl:with-param>
              <xsl:with-param name="eq2">Berango Urduliz Eskubaloia</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Ameztoi Zarautz ZKE</xsl:with-param>
              <xsl:with-param name="eq2">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Ameztoi Zarautz ZKE</xsl:with-param>
              <xsl:with-param name="eq2">Irauli-Bosteko</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Ameztoi Zarautz ZKE</xsl:with-param>
              <xsl:with-param name="eq2">Kukullaga Etxebarri</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Ameztoi Zarautz ZKE</xsl:with-param>
              <xsl:with-param name="eq2">San Adrian</xsl:with-param>
            </xsl:call-template>
          </tr>
          
          <!-- Fila Berango Urduliz Eskubaloia -->
          <tr>
            <td class="equipo-name">Berango U.</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Berango Urduliz Eskubaloia</xsl:with-param>
              <xsl:with-param name="eq2">Ameztoi Zarautz ZKE</xsl:with-param>
            </xsl:call-template>
            <td class="resultado diagonal">-</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Berango Urduliz Eskubaloia</xsl:with-param>
              <xsl:with-param name="eq2">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Berango Urduliz Eskubaloia</xsl:with-param>
              <xsl:with-param name="eq2">Irauli-Bosteko</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Berango Urduliz Eskubaloia</xsl:with-param>
              <xsl:with-param name="eq2">Kukullaga Etxebarri</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Berango Urduliz Eskubaloia</xsl:with-param>
              <xsl:with-param name="eq2">San Adrian</xsl:with-param>
            </xsl:call-template>
          </tr>
          
          <!-- Fila Construcciones Ugarte Aloña Mendi K.E -->
          <tr>
            <td class="equipo-name">Aloña M.</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
              <xsl:with-param name="eq2">Ameztoi Zarautz ZKE</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
              <xsl:with-param name="eq2">Berango Urduliz Eskubaloia</xsl:with-param>
            </xsl:call-template>
            <td class="resultado diagonal">-</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
              <xsl:with-param name="eq2">Irauli-Bosteko</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
              <xsl:with-param name="eq2">Kukullaga Etxebarri</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
              <xsl:with-param name="eq2">San Adrian</xsl:with-param>
            </xsl:call-template>
          </tr>
          
          <!-- Fila Irauli-Bosteko -->
          <tr>
            <td class="equipo-name">Irauli-B.</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Irauli-Bosteko</xsl:with-param>
              <xsl:with-param name="eq2">Ameztoi Zarautz ZKE</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Irauli-Bosteko</xsl:with-param>
              <xsl:with-param name="eq2">Berango Urduliz Eskubaloia</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Irauli-Bosteko</xsl:with-param>
              <xsl:with-param name="eq2">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
            </xsl:call-template>
            <td class="resultado diagonal">-</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Irauli-Bosteko</xsl:with-param>
              <xsl:with-param name="eq2">Kukullaga Etxebarri</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Irauli-Bosteko</xsl:with-param>
              <xsl:with-param name="eq2">San Adrian</xsl:with-param>
            </xsl:call-template>
          </tr>
          
          <!-- Fila Kukullaga Etxebarri -->
          <tr>
            <td class="equipo-name">Kukullaga</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Kukullaga Etxebarri</xsl:with-param>
              <xsl:with-param name="eq2">Ameztoi Zarautz ZKE</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Kukullaga Etxebarri</xsl:with-param>
              <xsl:with-param name="eq2">Berango Urduliz Eskubaloia</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Kukullaga Etxebarri</xsl:with-param>
              <xsl:with-param name="eq2">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Kukullaga Etxebarri</xsl:with-param>
              <xsl:with-param name="eq2">Irauli-Bosteko</xsl:with-param>
            </xsl:call-template>
            <td class="resultado diagonal">-</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">Kukullaga Etxebarri</xsl:with-param>
              <xsl:with-param name="eq2">San Adrian</xsl:with-param>
            </xsl:call-template>
          </tr>
          
          <!-- Fila San Adrian -->
          <tr>
            <td class="equipo-name">San Adrian</td>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">San Adrian</xsl:with-param>
              <xsl:with-param name="eq2">Ameztoi Zarautz ZKE</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">San Adrian</xsl:with-param>
              <xsl:with-param name="eq2">Berango Urduliz Eskubaloia</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">San Adrian</xsl:with-param>
              <xsl:with-param name="eq2">Construcciones Ugarte Aloña Mendi K.E</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">San Adrian</xsl:with-param>
              <xsl:with-param name="eq2">Irauli-Bosteko</xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="resultado">
              <xsl:with-param name="eq1">San Adrian</xsl:with-param>
              <xsl:with-param name="eq2">Kukullaga Etxebarri</xsl:with-param>
            </xsl:call-template>
            <td class="resultado diagonal">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  </xsl:template>
  
  <xsl:template name="resultado">
    <xsl:param name="eq1"/>
    <xsl:param name="eq2"/>
    <xsl:choose>
      <xsl:when test="//enfrentamiento[equipo1=$eq1 and equipo2=$eq2]">
        <xsl:variable name="g1" select="//enfrentamiento[equipo1=$eq1 and equipo2=$eq2]/goles1"/>
        <xsl:variable name="g2" select="//enfrentamiento[equipo1=$eq1 and equipo2=$eq2]/goles2"/>
        <xsl:variable name="estado">
          <xsl:choose>
            <xsl:when test="$g1 > $g2">victoria</xsl:when>
            <xsl:when test="$g1 &lt; $g2">derrota</xsl:when>
            <xsl:otherwise>empate</xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <td class="resultado {$estado}" data-g1="{$g1}" data-g2="{$g2}" data-eq1="{$eq1}" data-eq2="{$eq2}">
          <xsl:value-of select="$g1"/>-<xsl:value-of select="$g2"/>
        </td>
      </xsl:when>
      <xsl:otherwise>
        <td class="resultado pendiente" data-eq1="{$eq1}" data-eq2="{$eq2}">0-0</td>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>
