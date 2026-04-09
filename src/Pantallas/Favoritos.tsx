import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TarjetaCrypto } from '../Components/TarjetaCrypto';
import { useAlmacenCripto } from '../Guardar/GuardarCripto';
import { useAlmacenTema } from '../Guardar/GuardarTema';

export default function PantallaFavoritos() {
  //Lista favoritos
  const { listaCriptos, alternarFavorito } = useAlmacenCripto();
  //Guardar solo favoritos
  const listaFavoritos = listaCriptos.filter((item) => item.esFavorito);
  //Colores del tema
  const { colores } = useAlmacenTema();

  let contenido;

  if (listaFavoritos.length == 0) {
    contenido = (
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Text style={{ color: colores.textoSecundario, fontSize: 16 }}>No tienes favoritos</Text>
      </View>
    );
  } else {
    contenido = (
      <FlatList
        data={listaFavoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          //Componente (Cripto)
          <TarjetaCrypto
            simbolo={item.simbolo}
            nombre={item.nombre}
            precio={item.precio}
            esFavorito={item.esFavorito}
            onPulsarFav={() => alternarFavorito(item.id)} //Funcion para cambiar favorito
            cambioPorcentaje={item.cambioPorcentaje}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  }

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
      {contenido}
    </View>
  );
}


//Estilos-------------------------------------------------------------------------------------
const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
});