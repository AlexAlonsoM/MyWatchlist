import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import PantallaHome from '../Pantallas/Home';
import PantallaFavoritos from '../Pantallas/Favoritos';
import PantallaSearch from '../Pantallas/Search';
import PantallaDetalles from '../Pantallas/Detalles';
import PantallaLogin from '../Pantallas/Login';
import { useAlmacenSesion } from '../Guardar/GuardarSesion';
import { useAlmacenTema } from '../Guardar/GuardarTema';

//Objeto de navegacion
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); //Para que las pantallas se apilen unas encima de otras

function TabsNavigator() {
  const { colores } = useAlmacenTema();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colores.header, borderTopColor: '#334155', height: 60 },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      {/*Vista Principal*/}
      <Tab.Screen
        name="Watchlist"
        component={PantallaHome}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />

      {/*Vista Favoritos*/}
      <Tab.Screen
        name="Favoritos"
        component={PantallaFavoritos}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>❤️</Text>,
        }}
      />

      {/*Vista Search*/}
      <Tab.Screen
        name="Search"
        component={PantallaSearch}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  //Si esta logueado mostramos la app, si no el login
  const { estaLogueado, cerrarSesion } = useAlmacenSesion();
  const { colores, modoOscuro, alternarTema } = useAlmacenTema();

  //Si no esta logueado mostrar Login
  if (!estaLogueado) {
    return <PantallaLogin />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        //Header
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colores.header,
        },
        headerTintColor: colores.texto,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        //Boton modo claro/oscuro
        headerRight: () => (
          <Text style={{ fontSize: 22, marginRight: 10 }} onPress={alternarTema}>
            {modoOscuro ? '☀️' : '🌙'}
          </Text>
        ),
        //Boton cerrar sesion
        headerLeft: () => (
          <Text style={{ fontSize: 13, marginLeft: 10, color: '#ef4444', fontWeight: 'bold' }} onPress={cerrarSesion}>
            Salir
          </Text>
        ),
      }}
    >
      {/*Pantalla principal*/}
      <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ title: '📊 My Watchlist' }}
      />
      {/*Detalles (se abre encima)*/}
      <Stack.Screen
        name="Detalles"
        component={PantallaDetalles}
        options={{ title: 'Detalle' }}
      />
    </Stack.Navigator>
  );
}