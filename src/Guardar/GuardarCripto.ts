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
  idApi: string; //ID que usa CoinGecko para buscar esta cripto
};

//Datos de "Alamacen"
type AlmacenCripto = {
  listaCriptos: Cripto[];
  todasLasCriptos: Cripto[]; //Lista maestra con TODAS las criptos posibles
  errorRed: string; //Mensaje de error si no hay internet
  cargarDatos: () => Promise<void>;
  guardarDatos: () => Promise<void>;
  alternarFavorito: (id: string) => void;
  obtenerPreciosApi: () => Promise<void>;
  obtenerHistorialApi: (idApi: string) => Promise<number[]>; //Para el grafico de Detalles
  agregarCripto: (nuevaCripto: any) => void;
  eliminarDeWatchlist: (id: string) => void;
};

//TODAS las criptos
const todasLasCriptos: Cripto[] = [
  {id: '1',  simbolo: 'BTC',  nombre: 'Bitcoin',   precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'bitcoin'},
  {id: '2',  simbolo: 'ETH',  nombre: 'Ethereum',  precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'ethereum'},
  {id: '3',  simbolo: 'SOL',  nombre: 'Solana',    precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'solana'},
  {id: '4',  simbolo: 'ADA',  nombre: 'Cardano',   precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'cardano'},
  {id: '5',  simbolo: 'BNB',  nombre: 'BNB',       precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'binancecoin'},
  {id: '6',  simbolo: 'XRP',  nombre: 'Ripple',    precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'ripple'},
  {id: '7',  simbolo: 'DOT',  nombre: 'Polkadot',  precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'polkadot'},
  {id: '8',  simbolo: 'DOGE', nombre: 'Dogecoin',  precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'dogecoin'},
  {id: '9',  simbolo: 'LTC',  nombre: 'Litecoin',  precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'litecoin'},
  {id: '10', simbolo: 'TRX',  nombre: 'Tron',      precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'tron'},
  {id: '11', simbolo: 'AVAX', nombre: 'Avalanche', precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'avalanche-2'},
  {id: '12', simbolo: 'LINK', nombre: 'Chainlink', precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'chainlink'},
  {id: '13', simbolo: 'MATIC',nombre: 'Polygon',   precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'matic-network'},
  {id: '14', simbolo: 'UNI',  nombre: 'Uniswap',   precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'uniswap'},
  {id: '15', simbolo: 'ATOM', nombre: 'Cosmos',    precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'cosmos'},
  {id: '16', simbolo: 'NEAR', nombre: 'NEAR Protocol', precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'near'},
  {id: '17', simbolo: 'FTM',  nombre: 'Fantom',    precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'fantom'},
  {id: '18', simbolo: 'ALGO', nombre: 'Algorand',  precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'algorand'},
  {id: '19', simbolo: 'VET',  nombre: 'VeChain',   precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'vechain'},
  {id: '20', simbolo: 'ICP',  nombre: 'Internet Computer', precio: 0, esFavorito: false, cambioPorcentaje: 0, idApi: 'internet-computer'},
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
  errorRed: '', //Sin error al inicio

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

  //Pide precios reales a CoinGecko y actualiza la lista
  obtenerPreciosApi: async () => {
    try {
      const listaActual = get().listaCriptos;

      //Juntamos todos los idApi de las criptos que tenemos en la watchlist
      const ids = listaActual.map((c) => c.idApi).join(',');

      //Llamada a la API de CoinGecko
      //price_change_percentage_24h -> nos da el % de cambio en las ultimas 24h
      const respuesta = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`
      );

      //Si la respuesta no es correcta
      if (!respuesta.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      //Convertimos la respuesta a JSON
      const datosApi = await respuesta.json();

      //Actualizamos solo precio y cambioPorcentaje de cada cripto
      const listaNueva = listaActual.map((cripto) => {
        //Buscamos en los datos de la API la cripto que corresponde
        const datoApi = datosApi.find((d: any) => d.id == cripto.idApi);

        if (datoApi) {
          return {
            ...cripto,
            precio: datoApi.current_price,
            cambioPorcentaje: Number(datoApi.price_change_percentage_24h?.toFixed(2) ?? 0),
          };
        }

        //Si no encontramos el dato, dejamos la cripto igual
        return cripto;
      });

      set({ listaCriptos: listaNueva, errorRed: '' }); //Limpiamos el error si habia uno antes
    } catch (error) {
      console.log("❌ Error obteniendo precios de la API:", error);
      set({ errorRed: 'Sin conexión. No se pueden actualizar los precios.' });
    }
  },

  //Pide el historial de precios de los ultimos 7 dias para el grafico
  obtenerHistorialApi: async (idApi: string) => {
    try {
      //7 dias de historial, precio en USD
      const respuesta = await fetch(
        `https://api.coingecko.com/api/v3/coins/${idApi}/market_chart?vs_currency=usd&days=7`
      );

      if (!respuesta.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const datos = await respuesta.json();

      //La API devuelve: { prices: [[timestamp, precio], [timestamp, precio], ...] }
      //Solo necesitamos los precios, no los timestamps
      const soloPrecios: number[] = datos.prices.map((punto: number[]) => punto[1]);

      return soloPrecios;
    } catch (error) {
      console.log("❌ Error obteniendo historial:", error);
      return []; //Si falla devolvemos array vacio
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