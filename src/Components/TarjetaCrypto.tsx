import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAlmacenTema } from '../Guardar/GuardarTema';

//Almacena la cripto (Datos que se van a mostrar en la vista)
type DefTips = {
  simbolo: string;
  nombre: string;
  precio: number;
  esFavorito?: boolean; //Para que no de error '?' (Hacerlo opcional)
  onPulsarFav?: () => void; //Funcion
  cambioPorcentaje?: number;
};

export const TarjetaCrypto = ({
  simbolo,
  nombre,
  precio,
  esFavorito = false, //Si no lo recibe, false por defecto
  onPulsarFav,
  cambioPorcentaje = 0
}: DefTips) => {

  //Colores tema
  const { colores } = useAlmacenTema();
  //Porcentaje color
  const colorCambio = cambioPorcentaje >= 0 ? 'green' : 'red';

  return (
    <View style={[estilos.tarjeta, { backgroundColor: colores.tarjeta }]}>
      {/*Lado Izquierdo: Simbolo y Nombre*/}
      <View>
        <Text style={[estilos.simbolo, { color: colores.texto }]}>{simbolo}</Text>
        <Text style={[estilos.nombre, { color: colores.textoSecundario }]}>{nombre}</Text>
      </View>

      {/*Lado Derecho: Precio y Boton favorito*/}
      <View style={estilos.contenedorDerecho}>
        <Text style={[estilos.precio, { color: colores.texto }]}>{precio}$</Text>
        <Text style={{ color: colorCambio, fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>  {/*Porcentaje de cambio*/}
          {cambioPorcentaje}%
        </Text>

        <TouchableOpacity style={[estilos.botonFav, { backgroundColor: colores.boton }]} onPress={onPulsarFav}>
          <Text style={{ fontSize: 16 }}>
            {esFavorito ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


//Estilos-------------------------------------------------------------------------------------
const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  simbolo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nombre: {
    fontSize: 14,
  },
  contenedorDerecho: {
    alignItems: 'flex-end',
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  botonFav: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoFav: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});