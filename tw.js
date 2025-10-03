// src/tw.ts
import { create } from 'twrnc';

// Puedes extender colores/espaciados; si necesitas algo puntual usa valores arbitrarios: bg-[#C86F4F], rounded-[16px], etc.
const tw = create({
  theme: {
    extend: {
      colors: {
        primary: '#0F62FE',
        accent:  '#5E6AD2',
        coffee:  '#C86F4F',
        ink:     '#3D3D3D',
      },
      // Nota: en RN conviene usar valores arbitrarios cuando el token no existe: rounded-[16px]
    },
  },
});

export default tw;
