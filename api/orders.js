import apiClient from "./apiClient";
import { getFirebaseIdToken } from "./authToken";

const GET_ORDERS_BY_ZONE_URL =
  process.env.EXPO_PUBLIC_GET_ORDERS_BY_ZONE_URL ||
  "https://getordersdeliverycreatedbyzone-aoz4dvh7za-uc.a.run.app";

const normalizeOrder = (item) => ({
  id: item?.id ?? item?.orderId ?? item?.order_id ?? Math.random(),
  restaurant:
    item?.restaurante ??
    item?.restaurant ??
    item?.nombre_restaurante ??
    item?.store ??
    "Restaurante",
  address:
    item?.direccion ??
    item?.address ??
    item?.domicilio ??
    item?.delivery_address ??
    "",
  pickupOrigin:
    item?.zona ??
    item?.zone ??
    item?.pickup_zone ??
    item?.zona_nombre ??
    "",
  distance: item?.distancia ?? item?.distance ?? "",
  time: item?.tiempo ?? item?.time ?? item?.eta ?? "",
  total:
    item?.total != null
      ? `$${item.total}`
      : item?.monto != null
      ? `$${item.monto}`
      : "",
  items: Array.isArray(item?.productos)
    ? item.productos.map((p) =>
        typeof p === "string" ? p : p?.nombre ?? p?.name ?? JSON.stringify(p)
      )
    : Array.isArray(item?.items)
    ? item.items.map((p) =>
        typeof p === "string" ? p : p?.nombre ?? p?.name ?? JSON.stringify(p)
      )
    : [],
  latitude:
    item?.lat ?? item?.latitude ?? item?.latitud ?? 20.502,
  longitude:
    item?.lng ?? item?.longitude ?? item?.longitud ?? -100.144,
  raw: item,
});

export const getOrdersByZones = async ({ zonaIds = [], limit = 20 } = {}) => {
  const token = await getFirebaseIdToken();

  const data = await apiClient.post(
    GET_ORDERS_BY_ZONE_URL,
    { zonas: zonaIds, limit },
    { headers: { Authorization: `Bearer ${token}` } }
  );
/*
  console.log(`
curl -X POST "${GET_ORDERS_BY_ZONE_URL}" \
-H "Authorization: Bearer ${token}" \
-H "Content-Type: application/json" \
-d '${JSON.stringify({
  zonas: zonaIds,
  limit,
})}'
`);*/
console.log('#data', data)

  return data?.orders;
  
  //return raw.map(normalizeOrder);
};
