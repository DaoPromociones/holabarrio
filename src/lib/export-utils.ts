import type { PuntoSeleccionado, InfoRuta } from "@/types/mapa-types"

// Función para generar archivo GPX
export function generarGPX(puntosSeleccionados: PuntoSeleccionado[], infoRuta: InfoRuta): string {
  const fecha = new Date().toISOString()
  const nombreRuta = `Ruta_Blanes_${new Date().toISOString().split("T")[0]}`

  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Mapa Urbano Blanes" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${nombreRuta}</name>
    <desc>Ruta generada en el Mapa Urbano de Blanes</desc>
    <time>${fecha}</time>
    <keywords>urbano,blanes,ruta,ciudad</keywords>
  </metadata>
  
  <!-- Waypoints individuales -->
`

  // Añadir waypoints
  puntosSeleccionados.forEach((punto, index) => {
    gpxContent += `  <wpt lat="${punto.lat}" lon="${punto.lng}">
    <name>Punto ${index + 1}: ${punto.name}</name>
    <desc>${punto.name} - Orden: ${punto.order}</desc>
    <type>waypoint</type>
  </wpt>
`
  })

  // Añadir track (ruta continua)
  gpxContent += `
  <!-- Track de la ruta -->
  <trk>
    <name>${nombreRuta}</name>
    <desc>Distancia total: ${(infoRuta.distancia / 1000).toFixed(2)} km, Tiempo estimado: ${infoRuta.tiempoEstimado} minutos</desc>
    <trkseg>
`

  // Añadir puntos del track
  infoRuta.puntos.forEach(([lat, lng]) => {
    gpxContent += `      <trkpt lat="${lat}" lon="${lng}">
        <time>${fecha}</time>
      </trkpt>
`
  })

  gpxContent += `    </trkseg>
  </trk>
  
  <!-- Ruta planificada -->
  <rte>
    <name>${nombreRuta}_Route</name>
    <desc>Ruta planificada con ${puntosSeleccionados.length} puntos</desc>
`

  // Añadir puntos de ruta
  puntosSeleccionados.forEach((punto, index) => {
    gpxContent += `    <rtept lat="${punto.lat}" lon="${punto.lng}">
      <name>Punto ${index + 1}</name>
      <desc>${punto.name}</desc>
    </rtept>
`
  })

  gpxContent += `  </rte>
</gpx>`

  return gpxContent
}

// Función para generar archivo KML
export function generarKML(puntosSeleccionados: PuntoSeleccionado[], infoRuta: InfoRuta): string {
  const nombreRuta = `Ruta_Blanes_${new Date().toISOString().split("T")[0]}`

  let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${nombreRuta}</name>
    <description>Ruta generada en el Mapa Urbano de Blanes
    
Información de la ruta:
- Distancia total: ${(infoRuta.distancia / 1000).toFixed(2)} km
- Tiempo estimado: ${infoRuta.tiempoEstimado} minutos (caminando)
- Número de puntos: ${puntosSeleccionados.length}
- Fecha de creación: ${new Date().toLocaleDateString()}
    </description>
    
    <!-- Estilos para los marcadores -->
    <Style id="waypoint-style">
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href>
        </Icon>
        <scale>1.0</scale>
      </IconStyle>
      <LabelStyle>
        <scale>1.0</scale>
      </LabelStyle>
    </Style>
    
    <Style id="route-style">
      <LineStyle>
        <color>ff0099ff</color>
        <width>4</width>
      </LineStyle>
    </Style>
    
    <!-- Carpeta para los waypoints -->
    <Folder>
      <name>Puntos de la Ruta</name>
      <description>Puntos seleccionados para la ruta</description>
`

  // Añadir placemarks para cada punto
  puntosSeleccionados.forEach((punto, index) => {
    kmlContent += `      <Placemark>
        <name>Punto ${index + 1}: ${punto.name}</name>
        <description><![CDATA[
          <h3>${punto.name}</h3>
          <p><strong>Orden en la ruta:</strong> ${punto.order}</p>
          <p><strong>Coordenadas:</strong> ${punto.lat.toFixed(6)}, ${punto.lng.toFixed(6)}</p>
          <p><strong>Tipo:</strong> Punto de interés urbano</p>
        ]]></description>
        <styleUrl>#waypoint-style</styleUrl>
        <Point>
          <coordinates>${punto.lng},${punto.lat},0</coordinates>
        </Point>
      </Placemark>
`
  })

  kmlContent += `    </Folder>
    
    <!-- Línea de la ruta -->
    <Placemark>
      <name>Línea de Ruta</name>
      <description>Trayecto completo de la ruta planificada</description>
      <styleUrl>#route-style</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
`

  // Añadir coordenadas de la línea (formato KML: lng,lat,alt)
  infoRuta.puntos.forEach(([lat, lng]) => {
    kmlContent += `          ${lng},${lat},0
`
  })

  kmlContent += `        </coordinates>
      </LineString>
    </Placemark>
    
    <!-- Información adicional -->
    <Placemark>
      <name>Información de la Ruta</name>
      <description><![CDATA[
        <h2>Resumen de la Ruta</h2>
        <table border="1" style="border-collapse: collapse;">
          <tr><td><strong>Distancia Total</strong></td><td>${(infoRuta.distancia / 1000).toFixed(2)} km</td></tr>
          <tr><td><strong>Tiempo Estimado</strong></td><td>${infoRuta.tiempoEstimado} minutos</td></tr>
          <tr><td><strong>Número de Puntos</strong></td><td>${puntosSeleccionados.length}</td></tr>
          <tr><td><strong>Velocidad Promedio</strong></td><td>5 km/h (caminando)</td></tr>
        </table>
        
        <h3>Secuencia de Puntos:</h3>
        <ol>
${puntosSeleccionados.map((p) => `          <li>${p.name}</li>`).join("\n")}
        </ol>
      ]]></description>
      <Point>
        <coordinates>${puntosSeleccionados[0]?.lng || 0},${puntosSeleccionados[0]?.lat || 0},0</coordinates>
      </Point>
    </Placemark>
    
  </Document>
</kml>`

  return kmlContent
}

// Función para descargar archivo
export function descargarArchivo(contenido: string, nombreArchivo: string, tipoMime: string): void {
  const blob = new Blob([contenido], { type: tipoMime })
  const url = URL.createObjectURL(blob)

  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.style.display = "none"

  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)

  // Limpiar el URL del objeto
  URL.revokeObjectURL(url)
}

// Función para exportar en formato GPX
export function exportarGPX(puntosSeleccionados: PuntoSeleccionado[], infoRuta: InfoRuta): void {
  if (puntosSeleccionados.length < 2) {
    alert("Necesitas al menos 2 puntos para exportar una ruta.")
    return
  }

  const contenidoGPX = generarGPX(puntosSeleccionados, infoRuta)
  const nombreArchivo = `ruta_blanes_${new Date().toISOString().split("T")[0]}.gpx`

  descargarArchivo(contenidoGPX, nombreArchivo, "application/gpx+xml")
}

// Función para exportar en formato KML
export function exportarKML(puntosSeleccionados: PuntoSeleccionado[], infoRuta: InfoRuta): void {
  if (puntosSeleccionados.length < 2) {
    alert("Necesitas al menos 2 puntos para exportar una ruta.")
    return
  }

  const contenidoKML = generarKML(puntosSeleccionados, infoRuta)
  const nombreArchivo = `ruta_blanes_${new Date().toISOString().split("T")[0]}.kml`

  descargarArchivo(contenidoKML, nombreArchivo, "application/vnd.google-earth.kml+xml")
}
