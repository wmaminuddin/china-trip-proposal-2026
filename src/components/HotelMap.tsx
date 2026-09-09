import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { HotelCityBlock } from '../data/hotels'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const venueIcon = L.divIcon({
  className: 'hotel-map-venue-icon',
  html: '<span>V</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
})

interface Props {
  block: HotelCityBlock
}

export function HotelMap({ block }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const map = L.map(el, {
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: true,
      zoomControl: true,
      attributionControl: true,
      maxZoom: 19,
      minZoom: 3,
    })
    mapRef.current = map

    // OpenStreetMap raster tiles — no API key, full zoom coverage.
    // Street labels may be Chinese in China; hotel/venue popups stay English.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    const points: L.LatLngExpression[] = []

    if (block.venueLat != null && block.venueLng != null) {
      const venueLatLng: L.LatLngExpression = [block.venueLat, block.venueLng]
      points.push(venueLatLng)
      L.marker(venueLatLng, { icon: venueIcon })
        .addTo(map)
        .bindPopup(
          `<strong>Venue · ${block.city}</strong><br/>${block.venue.split('—')[0].trim()}`,
        )
    }

    for (const h of block.hotels) {
      const latLng: L.LatLngExpression = [h.lat, h.lng]
      points.push(latLng)
      const approxNote = h.approx ? '<br/><em>Approximate pin</em>' : ''
      L.marker(latLng, { icon: DefaultIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${h.name}</strong><br/>${h.stars}★ · ${h.brand}<br/>${h.travelToVenue}${approxNote}`,
        )
    }

    if (points.length === 1) {
      map.setView(points[0], 14)
    } else if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 14 })
    }

    const invalidate = () => map.invalidateSize()
    const t = window.setTimeout(invalidate, 80)
    window.addEventListener('resize', invalidate)

    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', invalidate)
      map.remove()
      mapRef.current = null
    }
  }, [block])

  return (
    <div className="hotel-map-wrap no-print">
      <div
        ref={containerRef}
        className="hotel-map"
        role="application"
        aria-label={`Map of hotels near ${block.city} venue. Use +/− or scroll to zoom.`}
        tabIndex={0}
      />
      <p className="hotel-map-legend">
        <span className="hotel-map-legend-venue">V</span> Venue · blue pins = hotels · Scroll or use
        +/− to zoom · Hotel names in English (street labels may be local) · Pins are indicative
      </p>
    </div>
  )
}
