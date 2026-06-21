const EARTH_RADIUS_KM = 6371;
const ROAD_FACTOR = 1.3; // straight-line to road distance approximation
const AVG_SPEED_KMH = 25; // urban delivery speed

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(a));
}

export function calcSegment(lat1, lng1, lat2, lng2) {
  const straightKm = haversineKm(lat1, lng1, lat2, lng2);
  const km = Math.round(straightKm * ROAD_FACTOR * 10) / 10;
  const min = Math.max(1, Math.round((km / AVG_SPEED_KMH) * 60));
  return { km, min };
}

export function calcRouteDistances(driverLat, driverLng, storeLat, storeLng, clientLat, clientLng) {
  const driverToLocal = calcSegment(driverLat, driverLng, storeLat, storeLng);
  const localToClient = calcSegment(storeLat, storeLng, clientLat, clientLng);
  const totalKm = Math.round((driverToLocal.km + localToClient.km) * 10) / 10;
  const totalMin = driverToLocal.min + localToClient.min;
  return {
    driverToLocal,
    localToClient,
    total: { km: totalKm, min: totalMin },
  };
}

export function extractClientCoords(order) {
  const lat =
    order.deliveryAddress?.lat ??
    order.deliveryAddress?.latitude ??
    order.clientAddress?.lat ??
    order.clientAddress?.latitude ??
    order.customer?.lat ??
    order.customer?.latitude ??
    order.destination?.lat ??
    order.destination?.latitude ??
    order.address?.lat ??
    order.address?.latitude ??
    null;

  const lng =
    order.deliveryAddress?.lng ??
    order.deliveryAddress?.longitude ??
    order.clientAddress?.lng ??
    order.clientAddress?.longitude ??
    order.customer?.lng ??
    order.customer?.longitude ??
    order.destination?.lng ??
    order.destination?.longitude ??
    order.address?.lng ??
    order.address?.longitude ??
    null;

  return lat != null && lng != null ? { lat, lng } : null;
}
