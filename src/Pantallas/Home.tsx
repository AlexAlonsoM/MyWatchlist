import { useEffect, useState } from 'react';  //Para cargar datos al inicio
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { TarjetaCrypto } from '../Components/TarjetaCrypto';
import { useAlmacenCripto } from '../Guardar/GuardarCripto';
import { useAlmacenTema } from '../Guardar/GuardarTema';
import { useNavigation } from '@react-navigation/native';

export default function PantallaHome() {
  //Datos y funciones del "Guardar"
  const { listaCriptos, cargarDatos, alternarFavorito, actualizarPrecios } = useAlmacenCripto();
  //Objeto de navegacion actual dentro del componente (metodos como navigate() o goBack())
  const navigation = useNavigation();
  //Colores del tema
  const { colores, modoOscuro } = useAlmacenTema();

  //Por que columna ordenar
  const [ordenActual, setOrdenActual] = useState('nombre');

  //Obtener lista ordenada
  const obtenerListaOrdenada = () => {
    const listaCopia = [...listaCriptos];

    if (ordenActual == 'nombre') {
      return listaCopia.sort((a, b) => a.simbolo.localeCompare(b.simbolo));
    }
    else if (ordenActual == 'precio') {
      return listaCopia.sort((a, b) => b.precio - a.precio);
    }
    else if (ordenActual == 'cambio') {
      return listaCopia.sort((a, b) => b.cambioPorcentaje - a.cambioPorcentaje);
    }

    return listaCopia;
  };

  const listaParaMostrar = obtenerListaOrdenada(); //Lista final

  //Cargar datos cuando se abra la app
  useEffect(() => {
    cargarDatos();

    //Actualizamos los precios
    const intervalo = setInterval(() => {
      actualizarPrecios();
    }, 5000);

    //Paramos el intervalo para que no se acumulen varios a la vez
    return () => clearInterval(intervalo);
  }, []);

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <StatusBar barStyle={modoOscuro ? 'light-content' : 'dark-content'} backgroundColor={colores.fondo} />

      {/*Botonos para ordenar*/}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
        <TouchableOpacity
          style={[estilos.botonOrden, { backgroundColor: colores.boton }, ordenActual == 'nombre' && estilos.botonActivo]}
          onPress={() => setOrdenActual('nombre')}
        >
          <Text style={[estilos.textoBotonOrden, { color: colores.texto }]}>A-Z</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botonOrden, { backgroundColor: colores.boton }, ordenActual == 'precio' && estilos.botonActivo]}
          onPress={() => setOrdenActual('precio')}
        >
          <Text style={[estilos.textoBotonOrden, { color: colores.texto }]}>Precio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilos.botonOrden, { backgroundColor: colores.boton }, ordenActual == 'cambio' && estilos.botonActivo]}
          onPress={() => setOrdenActual('cambio')}
        >
          <Text style={[estilos.textoBotonOrden, { color: colores.texto }]}>% Cambio</Text>
        </TouchableOpacity>
      </ScrollView>

      {/*Si la lista esta vacia, mostramos un mensaje de carga (Por si carga la vista antes que los datos-Api de internet no funciona)*/}
      {listaCriptos.length == 0 ? (
        <Text style={{ color: colores.texto, textAlign: 'center', marginTop: 50 }}>Cargando datos...</Text>
      ) : (
        <FlatList
          data={listaParaMostrar} //Array de objetos que vamos a mostar (Ordenado)
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => ( //Recorremos todas las criptos
            //Hacer clicable la cripto (TouchableOpacity)
            <TouchableOpacity onPress={() => (navigation as any).navigate('Detalles', { cripto: item })}>
              {/*Componente (Cripto)*/}
              <TarjetaCrypto
                simbolo={item.simbolo}
                nombre={item.nombre}
                precio={item.precio}
                esFavorito={item.esFavorito}
                onPulsarFav={() => alternarFavorito(item.id)} //Funcion para cambiar favorito
                cambioPorcentaje={item.cambioPorcentaje}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}


//Estilos-------------------------------------------------------------------------------------
const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
  },
  botonOrden: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#475569',
  },
  botonActivo: {
    backgroundColor: '#38bdf8',
    borderColor: '#38bdf8',
  },
  textoBotonOrden: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});