/**
 * geocoder.js — City name → lat/lon/timezone using OpenStreetMap Nominatim (free)
 */

export async function searchCity(query) {
  if (!query || query.length < 2) return []
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&featuretype=city`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  return data.map(r => ({
    displayName: r.display_name,
    shortName: r.name,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
  }))
}

/**
 * Get UTC offset in hours for a lat/lon using the browser's Intl API
 * (approximation — uses a lookup table for common Myanmar/Asian cities)
 */
export function getTzOffset(lat, lon, dateStr) {
  // Use a known date to check DST via browser
  const date = new Date(dateStr + 'T12:00:00Z')
  // Try to determine timezone from coordinates (coarse lookup)
  // Myanmar is always UTC+6:30 (no DST)
  if (lon > 92 && lon < 102 && lat > 9 && lat < 29) return 6.5  // Myanmar
  if (lon > 66 && lon < 97  && lat > 8 && lat < 36) return 5.5  // India
  if (lon > 99 && lon < 106 && lat > 5 && lat < 22) return 7.0  // Thailand
  if (lon > 100 && lon < 122 && lat > 1 && lat < 7) return 8.0  // Singapore/Malaysia
  if (lon > 70 && lon < 80  && lat > 24 && lat < 38) return 5.0 // Pakistan
  if (lon > 89 && lon < 94  && lat > 20 && lat < 27) return 6.0 // Bangladesh
  // Default: use browser's local timezone offset
  const offsetMin = -date.getTimezoneOffset()
  return offsetMin / 60
}
