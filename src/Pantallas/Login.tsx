import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAlmacenSesion } from '../Guardar/GuardarSesion';
import { useAlmacenTema } from '../Guardar/GuardarTema';

export default function PantallaLogin() {
  //Formulario
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  //Funciones sesion
  const { iniciarSesion, error } = useAlmacenSesion();
  //Colores del tema
  const { colores, modoOscuro, alternarTema } = useAlmacenTema();

  return (
    <View style={[estilos.contenedor, { backgroundColor: colores.fondo }]}>

      {/*Boton claro/oscuro*/}
      <TouchableOpacity style={estilos.botonTema} onPress={alternarTema}>
        <Text style={{ fontSize: 24 }}>{modoOscuro ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      {/*Titulo*/}
      <Text style={[estilos.titulo, { color: colores.texto }]}>📊 MyWatchlist</Text>
      <Text style={[estilos.subtitulo, { color: colores.textoSecundario }]}>Inicia sesión para continuar</Text>

      {/*Usuario*/}
      <TextInput
        style={[estilos.input, { backgroundColor: colores.input, color: colores.texto, borderColor: colores.boton }]}
        placeholder="Usuario"
        placeholderTextColor={colores.textoSecundario}
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />

      {/*Contraseña*/}
      <TextInput
        style={[estilos.input, { backgroundColor: colores.input, color: colores.texto, borderColor: colores.boton }]}
        placeholder="Contraseña"
        placeholderTextColor={colores.textoSecundario}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} //Oculta los caracteres
      />

      {/*Mensaje error*/}
      {error.length > 0 && (
        <Text style={estilos.textoError}>{error}</Text>
      )}

      {/*Boton login*/}
      <TouchableOpacity style={estilos.botonLogin} onPress={() => iniciarSesion(usuario, password)}>
        <Text style={estilos.textoBoton}>Entrar</Text>
      </TouchableOpacity>

      {/*Info credenciales*/}
      <Text style={[estilos.pista, { color: colores.textoSecundario }]}>
        Usuario: admin / Contraseña: 1234
      </Text>

    </View>
  );
}


//Estilos-------------------------------------------------------------------------------------
const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  botonTema: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textoError: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  botonLogin: {
    backgroundColor: '#38bdf8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBoton: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pista: {
    textAlign: 'center',
    fontSize: 13,
  },
});