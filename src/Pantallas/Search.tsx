import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAlmacenCripto } from '../Guardar/GuardarCripto';
import { useAlmacenTema } from '../Guardar/GuardarTema';

export default function PantallaSearch() {
  //Guardar lo que se escribe y actualizar al escribir
  const [textoBusqueda, setTextoBusqueda] = useState('');
  //Cogemos la lista y la lista completa
  const { listaCriptos, todasLasCriptos, agregarCripto } = useAlmacenCripto();
  //Colores del tema
  const { colores } = useAlmacenTema();

  //Criptos que NO estan ya en la watchlist (Recorre la watclist para ver que no estan alli)
  const todasDisponibles = todasLasCriptos.filter((cripto) => {
    return !listaCriptos.some((miCripto) => miCripto.id == cripto.id);
  });

  //Buscar criptos que coincidan con el texto y no esten ya en la watchlist
  const resultados = todasLasCriptos.filter((cripto) => {
    const coincide = cripto.simbolo.toLowerCase().includes(textoBusqueda.toLowerCase()) || cripto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    const yaLoTengo = listaCriptos.some((miCripto) => miCripto.id == cripto.id);

    return coincide && !yaLoTengo;
  });

  //Componente de tarjeta cripto
  const renderTarjeta = ({ item }: { item: any }) => (
    <View style={[estilos.tarjetaResultado, { backgroundColor: colores.tarjeta }]}>
      <View>
        <Text style={[estilos.simbolo, { color: colores.texto }]}>{item.simbolo}</Text>
        <Text style={[estilos.nombre, { color: colores.textoSecundario }]}>{item.nombre}</Text>
      </View>
      {/*Metodo de GuardarCripto para añadir a la Watchlist*/}
      <TouchableOpacity style={estilos.botonAñadir} onPress={() => agregarCripto(item)}>
        <Text style={estilos.textoBoton}>+ Añadir</Text>
      </TouchableOpacity>
    </View>
  );

  let contenido;

  if (textoBusqueda.length == 0) {
    //Si no hay texto mostrar todas las disponibles para añadir
    if (todasDisponibles.length == 0) {
      contenido = (
        <Text style={{ color: colores.textoSecundario, textAlign: 'center', marginTop: 20 }}>
          Ya tienes todas las criptos en tu watchlist
        </Text>
      );
    } else {
      contenido = (
        <FlatList
            data={todasDisponibles}
            keyExtractor={(item) => item.id}
            renderItem={renderTarjeta}
        />
      );
    }
  } else if (resultados.length == 0) {
    //Con texto pero sin resultados
    contenido = (
      <Text style={{ color: colores.textoSecundario, textAlign: 'center', marginTop: 20 }}>
        No se encontraron resultados
      </Text>
    );
  } else {
    //Con texto y con resultados
    contenido = (
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={renderTarjeta}
      />
    );
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      <TextInput
        style={[estilos.input, { backgroundColor: colores.input, color: colores.texto }]}
        placeholder="Ejemplo: BTC, Bitcoin..."
        placeholderTextColor={colores.textoSecundario}
        value={textoBusqueda}
        onChangeText={setTextoBusqueda}
      />

      {contenido}
    </View>
  );
}


//Estilos-------------------------------------------------------------------------------------
const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 16 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  tarjetaResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  simbolo: { fontSize: 18, fontWeight: 'bold' },
  nombre: {},
  botonAñadir: {
    backgroundColor: '#38bdf8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  textoBoton: { color: 'black', fontWeight: 'bold' },
});