import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Definir Cripto
type Cripto = {
  id: string;
  simbolo: string;
  nombre: string;
  precio: number;
  esFavorito: boolean;
  cambioPorcentaje: number;
};

//Datos de "Alamacen"
type AlmacenCripto = {
  listaCriptos: Cripto[];
  todasLasCriptos: Cripto[]; // Lista maestra con TODAS las criptos posibles
  cargarDatos: () => Promise<void>;
  guardarDatos: () => Promise<void>;
  alternarFavorito: (id: string) => void;
  actualizarPrecios: () => void;
  agregarCripto: (nuevaCripto: any) => void;
  eliminarDeWatchlist: (id: string) => void;
};

//TODAS las criptos
const todasLasCriptos: Cripto[] = [
  {id: '1',  simbolo: 'BTC',  nombre: 'Bitcoin',   precio: 64200, esFavorito: false, cambioPorcentaje: 0},
  {id: '2',  simbolo: 'ETH',  nombre: 'Ethereum',  precio: 3450,  esFavorito: false, cambioPorcentaje: 0},
  {id: '3',  simbolo: 'SOL',  nombre: 'Solana',    precio: 145,   esFavorito: false, cambioPorcentaje: 0},
  {id: '4',  simbolo: 'ADA',  nombre: 'Cardano',   precio: 0.45,  esFavorito: false, cambioPorcentaje: 0},
  {id: '5',  simbolo: 'BNB',  nombre: 'BNB',       precio: 390,   esFavorito: false, cambioPorcentaje: 0},
  {id: '6',  simbolo: 'XRP',  nombre: 'Ripple',    precio: 0.52,  esFavorito: false, cambioPorcentaje: 0},
  {id: '7',  simbolo: 'DOT',  nombre: 'Polkadot',  precio: 7.8,   esFavorito: false, cambioPorcentaje: 0},
  {id: '8',  simbolo: 'DOGE', nombre: 'Dogecoin',  precio: 0.12,  esFavorito: false, cambioPorcentaje: 0},
  {id: '9',  simbolo: 'LTC',  nombre: 'Litecoin',  precio: 85.00, esFavorito: false, cambioPorcentaje: 0},
  {id: '10', simbolo: 'TRX',  nombre: 'Tron',      precio: 0.11,  esFavorito: false, cambioPorcentaje: 0},
  {id: '11', simbolo: 'AVAX', nombre: 'Avalanche', precio: 35.50, esFavorito: false, cambioPorcentaje: 0},
  {id: '12', simbolo: 'LINK', nombre: 'Chainlink', precio: 14.20, esFavorito: false, cambioPorcentaje: 0},
  {id: '13', simbolo: 'MATIC',nombre: 'Polygon',   precio: 0.85,  esFavorito: false, cambioPorcentaje: 0},
  {id: '14', simbolo: 'UNI',  nombre: 'Uniswap',   precio: 7.50,  esFavorito: false, cambioPorcentaje: 0},
  {id: '15', simbolo: 'ATOM', nombre: 'Cosmos',    precio: 9.20,  esFavorito: false, cambioPorcentaje: 0},
  {id: '16', simbolo: 'NEAR', nombre: 'NEAR Protocol', precio: 5.80, esFavorito: false, cambioPorcentaje: 0},
  {id: '17', simbolo: 'FTM',  nombre: 'Fantom',    precio: 0.48,  esFavorito: false, cambioPorcentaje: 0},
  {id: '18', simbolo: 'ALGO', nombre: 'Algorand',  precio: 0.17,  esFavorito: false, cambioPorcentaje: 0},
  {id: '19', simbolo: 'VET',  nombre: 'VeChain',   precio: 0.035, esFavorito: false, cambioPorcentaje: 0},
  {id: '20', simbolo: 'ICP',  nombre: 'Internet Computer', precio: 11.20, esFavorito: false, cambioPorcentaje: 0},
];

//Watchlist inicial (15 primeras, demas en Search)
const datosIniciales: Cripto[] = todasLasCriptos.slice(0, 15).map((c) => ({
  ...c,
  esFavorito: c.id == '1', //BTC favorito por defecto
}));

//Alamacen global
export const useAlmacenCripto = create<AlmacenCripto>((set, get) => ({
  listaCriptos: datosIniciales,
  todasLasCriptos: todasLasCriptos,

  //Datos guardados
  cargarDatos: async () => {
    try {
      const datosGuardados = await AsyncStorage.getItem('mis_criptos');

      if (datosGuardados) {
        set({ listaCriptos: JSON.parse(datosGuardados) }); //Convertir datos guardados de texto a objetos y cargarlos
        console.log("✅ Datos cargados correctamente");
      }
    } catch (error) {
      console.log("❌ Error cargando datos:", error);
    }
  },

  //Guardar datos
  guardarDatos: async () => {
    try {
      const estadoActual = get().listaCriptos;
      await AsyncStorage.setItem('mis_criptos', JSON.stringify(estadoActual)); //Convierte el array de objetos a texto
      console.log("✅ Datos guardados en AsyncStorage");
    } catch (error) {
      console.log("❌ Error guardando datos:", error);
    }
  },

  //El '...crypto' es para copiar todos los datos de la cripto iguales, luego ponemos cual es que queremos "editar"
  alternarFavorito: (id: string) => {
    const listaActual = get().listaCriptos;
    const listaNueva: Cripto[] = [];

    //Recorremos toda la lista
    for (let i = 0; i < listaActual.length; i++) {
      const criptoActual = listaActual[i];

      if (criptoActual.id == id) {
        listaNueva.push({
          ...criptoActual,
          esFavorito: !criptoActual.esFavorito
        });
      } else {
        listaNueva.push(criptoActual);
      }
    }

    //Guardar nueva lista
    set({ listaCriptos: listaNueva });
    get().guardarDatos();
  },

  //Actualizar Precios
  actualizarPrecios: () => {
    const listaActual = get().listaCriptos;
    const listaNueva: Cripto[] = [];

    for (let i = 0; i < listaActual.length; i++) {
      const cripto = listaActual[i];
      //Cambio aleatorio
      const vela = Math.floor(Math.random() * 2) + 1; //Para asegurarnos que no de 0 (Floor para quitar los decimales)
      const porcentaje = (Math.random() * 4);
      let nuevoPrecio = 0, cambioFinal = 0;

      //Sumar/Restar precio
      if (vela == 1) {
        nuevoPrecio = cripto.precio * (1 + porcentaje / 100);
        cambioFinal = porcentaje;
      } else {
        nuevoPrecio = cripto.precio * (1 - porcentaje / 100);
        cambioFinal = -porcentaje;
      }

      listaNueva.push({
        ...cripto,
        precio: Number(nuevoPrecio.toFixed(2)), //Precio a texto con dos decimales
        cambioPorcentaje: Number(cambioFinal.toFixed(2))
      });
    }

    set({ listaCriptos: listaNueva });
  },

  //Añadir Cripto del Search
  agregarCripto: (nuevaCripto) => {
    const listaActual = get().listaCriptos;
    const listaNueva = [...listaActual, { ...nuevaCripto, esFavorito: false, cambioPorcentaje: 0 }];
    set({ listaCriptos: listaNueva });
    get().guardarDatos(); //Guardamos cambio
  },

  //Eliminar Cripto de Watchlist
  eliminarDeWatchlist: (id) => {
    const listaActual = get().listaCriptos;
    const listaNueva = listaActual.filter((c) => c.id != id);
    set({ listaCriptos: listaNueva });
    get().guardarDatos();
  },
}));