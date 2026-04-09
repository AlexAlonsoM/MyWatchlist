import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';     //Grafico
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAlmacenCripto } from '../Guardar/GuardarCripto';
import { useAlmacenTema } from '../Guardar/GuardarTema';

export default function PantallaDetalles() {
  const route = useRoute();
  const navigation = useNavigation();
  const { alternarFavorito, listaCriptos, eliminarDeWatchlist } = useAlmacenCripto();
  //Colores del tema
  const { colores } = useAlmacenTema();

  //Recibimos la cripto de Home ('?' evita error)
  const criptoRecibida = (route.params as any)?.cripto;

  //Buscamos cripto y tener sus datos
  const cripto = listaCriptos.find((c) => c.id == criptoRecibida?.id);

  if (!cripto) {
    return (
      <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>
        <Text style={{ color: colores.texto }}>No se encontro la cripto</Text>
      </View>
    );
  }

  //Generamos 10 precios simulados para el grafico
  const datosGrafico = [];
  for (let i = 0; i < 10; i++) {
    const vela = Math.floor(Math.random() * 2) + 1;
    const porcentaje = (Math.random() * 4);
    let precioPunto = 0;

    if (vela == 1) {
      precioPunto = cripto.precio * (1 + porcentaje / 100);
    } else {
      precioPunto = cripto.precio * (1 - porcentaje / 100);
    }

    datosGrafico.push({ value: Number(precioPunto.toFixed(2)) });
  }

  const colorCambio = cripto.cambioPorcentaje >= 0 ? '#00c853' : '#ff1744';
  const signo = cripto.cambioPorcentaje >= 0 ? '+' : '';

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>

      {/*Nombre y simbolo*/}
      <Text style={[estilos.titulo, { color: colores.texto }]}>{cripto.nombre}</Text>
      <Text style={[estilos.simbolo, { color: colores.textoSecundario }]}>{cripto.simbolo}</Text>

      {/*Precio y %*/}
      <Text style={estilos.precio}>${cripto.precio}</Text>
      <Text style={[estilos.cambio, { color: colorCambio }]}>
        {signo}{cripto.cambioPorcentaje}%
      </Text>

      {/*Grafico*/}
      <View style={estilos.graficoContainer}>
        <LineChart
          data={datosGrafico}   //Porcentaje de subida y bajada
          width={300}
          height={180}
          color="#38bdf8"
          thickness={2} // GROSOR linea del grafico.
          hideDataPoints={false}
          dataPointsColor="#38bdf8"
          backgroundColor="#1e293b"
          xAxisColor="#334155"
          yAxisColor="#334155"
          yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
          hideRules={false} //Cuadricula (Mostrar lineas estetico)
          rulesColor="#334155"
        />
      </View>

      {/*Boton favorito*/}
      <TouchableOpacity style={[estilos.botonFav, { backgroundColor: colores.tarjeta, borderColor: colores.boton }]} onPress={() => alternarFavorito(cripto.id)}>
        <Text style={[estilos.textoBoton, { color: colores.texto }]}>
          {cripto.esFavorito ? '❤️ Quitar de favoritos' : '🤍 Añadir a favoritos'}
        </Text>
      </TouchableOpacity>

      {/*Boton Eliminar Watchlist*/}
      <TouchableOpacity
        style={[estilos.botonFav, { backgroundColor: '#ef4444', borderColor: '#ef4444' }]}
        onPress={() => {
          eliminarDeWatchlist(cripto.id);
          navigation.goBack();
        }}
      >
        <Text style={estilos.textoBoton}>🗑️ Eliminar de Watchlist</Text>
      </TouchableOpacity>

      {/*Boton volver*/}
      <TouchableOpacity style={[estilos.botonVolver, { backgroundColor: colores.boton }]} onPress={() => navigation.goBack()}>
        <Text style={[estilos.textoBoton, { color: colores.texto }]}>← Volver</Text>
      </TouchableOpacity>

    </View>
  );
}


//Estilos-------------------------------------------------------------------------------------
const estilos = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  simbolo: { fontSize: 16, marginBottom: 12 },
  precio: { fontSize: 36, fontWeight: 'bold', color: '#38bdf8', marginBottom: 4 },
  cambio: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  graficoContainer: { backgroundColor: '#1e293b', padding: 10, borderRadius: 12, marginBottom: 30 },
  botonFav: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  botonVolver: {
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  textoBoton: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});