export function getTarifaForZone(storedZones, zoneId, zoneName) {
  if (!storedZones?.length) return null;

  if (zoneId != null) {
    const match = storedZones.find((z) => z.id === zoneId || z.id === Number(zoneId));
    if (match) return match.tarifa;
  }

  if (zoneName) {
    const match = storedZones.find(
      (z) => z.name?.toLowerCase() === zoneName.toLowerCase()
    );
    if (match) return match.tarifa;
  }

  return null;
}
