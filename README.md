# 📊 MyWatchlist

Aplicación móvil desarrollada en React Native que simula una watchlist de instrumentos financieros (criptomonedas).

Video demostrativo: https://youtu.be/wUTQImqedIE

---

## 🚀 Instrucciones de instalación

### Requisitos
- Node.js 18+
- Aplicación Expo Go en el móvil (o un emulador Android/iOS)

### Instalar y ejecutar

1. Clona o descomprime el proyecto
2. Instala las dependencias:
   npm install
3. Instala las dependencias de Expo:
   npx expo install
4. Inicia la aplicación:
   npx expo start --clear
5. Escanea el código QR con Expo Go (Android) o la app Cámara (iOS)

### Credenciales de acceso
- **Usuario:** admin
- **Contraseña:** 1234

---

## 📦 Dependencias utilizadas

| `expo` | Framework base |
| `@react-native-async-storage/async-storage` | Persistencia local de datos |
| `@react-navigation/native` | Contenedor de navegación |
| `@react-navigation/bottom-tabs` | Navegador con pestañas inferiores |
| `@react-navigation/native-stack` | Navegador en pila (pantalla de detalles) |
| `react-native-screens` | Requerido por React Navigation |
| `react-native-safe-area-context` | Requerido por React Navigation |
| `react-native-gifted-charts` | Gráfico de líneas en la pantalla de detalles |
| `react-native-linear-gradient` | Requerido por gifted-charts |
| `zustand` | Gestión del estado global |

---


### Estructura de componentes

........................

### Persistencia
AsyncStorage guarda la watchlist completa (incluyendo favoritos) bajo la clave `mis_criptos`. Se carga al abrir la app y se guarda automáticamente tras cada cambio (añadir, eliminar, cambiar favorito).

### Simulación de precios
Cada 5 segundos todos los precios varían aleatoriamente entre un -4% y un +4%. El porcentaje de cambio se almacena por instrumento y se muestra en verde (positivo) o rojo (negativo).

---

## ⚠️ Limitaciones conocidas

- Las credenciales de login están escritas directamente en el código (`admin` / `1234`), no hay autenticación real
- Los precios son simulados de forma aleatoria, no se obtienen de una API real
- El gráfico de la pantalla de detalles genera datos aleatorios cada vez que se abre, por lo que no refleja un historial de precios real
- La lista maestra de criptomonedas está limitada a 20 instrumentos escritos a mano en el código

---

## 🔮 Cómo mejoraría el proyecto con más tiempo

Si dispusiera de más tiempo, la primera prioridad sería conectar la aplicación a una API pública real para obtener precios en vivo e historial de precios. Esto sustituiría la simulación aleatoria y convertiría el gráfico de la pantalla de detalles en algo realmente útil, mostrando la evolución real del precio de cada instrumento a lo largo del tiempo.

Actualmente, los datos se guardan localmente en el dispositivo. Migraría a una BBDD en la nube. Esto permitiría implementar un sistema de autenticación real, de modo que cada usuario pueda iniciar sesión desde cualquier dispositivo y encontrar su watchlist y favoritos sincronizados.

Implementaría notificaciones  para avisar al usuario cuando una cripto de su watchlist supere o baje de un precio objetivo definido.

Añadiría el detalle para convertir el valor de la cripto, permitiendo al usuario simular cuántas unidades podría comprar con un presupuesto específico.
