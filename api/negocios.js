import apiClient from './apiClient';

const BASE_URL = 'https://adeev.com.mx/piter-admin/wp-json/wp/v2/negocios';

const DAYS_ES = ['Domingos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function parseHour(str) {
  if (!str) return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const meridiem = match[3].toLowerCase();
  if (meridiem === 'pm' && h !== 12) h += 12;
  if (meridiem === 'am' && h === 12) h = 0;
  return h * 60 + m;
}

export function getStoreStatus(horarios) {
  if (!Array.isArray(horarios) || horarios.length === 0) return null;

  const now = new Date();
  const todayName = DAYS_ES[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = horarios.find(
    (h) => h.dia?.trim().toLowerCase() === todayName.toLowerCase()
  );
  if (!todaySchedule) return 'Cerrado hoy';

  const open = parseHour(todaySchedule.hora_inicio);
  const close = parseHour(todaySchedule.hora_fin);
  if (open === null || close === null) return null;

  const isOpen = currentMinutes >= open && currentMinutes < close;
  const closeLabel = todaySchedule.hora_fin;
  return isOpen ? `Abierto · cierra ${closeLabel}` : `Cerrado · abre ${todaySchedule.hora_inicio}`;
}

export const getLocalById = async (localId) => {
  if (!localId) throw new Error('localId requerido');
  const data = await apiClient.get(
    `${BASE_URL}/${localId}?_fields=id,slug,name,acf`
  );
  return data;
};
