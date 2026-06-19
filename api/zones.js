import axios from "axios"
import { getBaseURL } from "./common";


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