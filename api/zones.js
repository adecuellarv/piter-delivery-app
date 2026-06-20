import axios from "axios"
import { getBaseURL } from "./common";
import { getFirebaseAuth } from "../config/firebase";

const UPDATE_ZONAS_REPARTIDOR_URL =
    process.env.EXPO_PUBLIC_UPDATE_ZONAS_REPARTIDOR_URL;

const normalizeZone = (item) => {
    const zona = item?.zona ?? item;
    const tarifa = item?.tarifa ?? zona?.acf?.tarifa ?? zona?.acf?.precio ?? 0;

    if (!zona) {
        return null;
    }

    return {
        id: zona?.ID ?? zona?.id,
        name: zona?.post_title ?? zona?.title?.rendered ?? zona?.name ?? "Zona sin nombre",
        slug: zona?.post_name ?? zona?.slug,
        orders: zona?.count ?? 0,
        tarifa: Number(tarifa),
        minTarifa: Number(zona?.acf?.tarifa_minima ?? zona?.acf?.min_tarifa ?? 0),
        raw: zona,
    };
};

const serializeZones = (zones = []) =>
    zones.map((zone) => ({
        zona: zone?.id ?? zone?.ID,
        tarifa: String(zone?.tarifa ?? 0),
    }));

export const getZones = async () => {
    try {
        const resp = await axios.get(
            `${getBaseURL()}/zonas?tipos=8&_fields=id,title.rendered,meta.rating_average,meta.rating_count,acf`
        );
        if (resp?.status === 200) return resp?.data ?? [];
        return [];
    } catch (error) {
        console.error("Error obteniendo zonas:", error);
        throw error;
    }
}

export const getRepartidorZones = async (repartidorId) => {

    try {
        if (!repartidorId) {
            return [];
        }

        const resp = await axios.get(
            `${getBaseURL()}/repartidores/${repartidorId}?_fields=id,count,name,slug,acf`
        );

        if (resp?.status === 200) {
            return (resp?.data?.acf?.zonas ?? [])
                .map(normalizeZone)
                .filter(Boolean);
        }

        return [];
    } catch (error) {
        console.error('Error obteniendo zonas del repartidor:', error);
        throw error;
    }
};

export const updateRepartidorZones = async (repartidorId, zones, sessionToken) => {
  try {
    if (!UPDATE_ZONAS_REPARTIDOR_URL) {
      throw new Error("Falta configurar EXPO_PUBLIC_UPDATE_ZONAS_REPARTIDOR_URL");
    }

    if (!repartidorId) {
      throw new Error("No se encontró el ID del repartidor");
    }

    if (!Array.isArray(zones)) {
      throw new Error("Las zonas a actualizar no son válidas");
    }

    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    const token = currentUser ? await currentUser.getIdToken(true) : sessionToken;

    if (!token) {
      throw new Error("No hay usuario autenticado");
    }

    const resp = await axios.post(
      UPDATE_ZONAS_REPARTIDOR_URL,
      {
        id: repartidorId,
        zonas: serializeZones(zones),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("#resp", resp.status, resp.data);

    return resp.data;
  } catch (error) {
    console.error(
      "Error actualizando zonas del repartidor:",
      error?.response?.data || error
    );
    throw error;
  }
};
