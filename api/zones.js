import axios from "axios"
import { getBaseURL } from "./common";

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

const serializeZones = (zones) =>
    zones.map((zone) => ({
        zona: zone?.id ?? zone?.ID,
        tarifa: String(zone?.tarifa ?? 0),
    }));

export const getZones = async () => {
    try{
        const resp = await axios.get(`${getBaseURL()}/zonas?per_page=100`)
        if (resp?.status === 200)
        return resp?.data;
    }
    catch (error) {
        console.error('Error obteniendo zonas getzones:', error);
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

export const updateRepartidorZones = async (repartidorId, zones, token) => {
    try {
        if (!repartidorId) {
            throw new Error("Falta el ID del repartidor");
        }

        const resp = await axios.post(
            `${getBaseURL()}/repartidores/${repartidorId}`,
            {
                acf: {
                    zonas: serializeZones(zones),
                },
            },
            token
                ? {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                : undefined
        );

        if (resp?.status >= 200 && resp?.status < 300) {
            return resp?.data;
        }

        throw new Error("No se pudo actualizar el repartidor");
    } catch (error) {
        console.error('Error actualizando zonas del repartidor:', error);
        throw error;
    }
};
