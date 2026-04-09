import { create } from 'zustand';

//Colores para cada modo
type Tema = {
  modoOscuro: boolean;
  colores: {
    fondo: string;
    tarjeta: string;
    texto: string;
    textoSecundario: string;
    header: string;
    boton: string;
    input: string;
  };
  alternarTema: () => void;
};

//Modo oscuro
const coloresOscuro = {
  fondo: 'black',
  tarjeta: '#333333',
  texto: 'white',
  textoSecundario: '#cccccc',
  header: '#1e293b',
  boton: '#334155',
  input: '#333333',
};

//Modo claro
const coloresClaro = {
  fondo: '#f1f5f9',
  tarjeta: '#ffffff',
  texto: '#0f172a',
  textoSecundario: '#475569',
  header: '#e2e8f0',
  boton: '#cbd5e1',
  input: '#ffffff',
};

//Almacen del tema
export const useAlmacenTema = create<Tema>((set, get) => ({
  modoOscuro: true,
  colores: coloresOscuro,

  //Cambio entre oscuro y claro
  alternarTema: () => {
    const estaOscuro = get().modoOscuro;
    set({
      modoOscuro: !estaOscuro,
      colores: estaOscuro ? coloresClaro : coloresOscuro,
    });
  },
}));