import { create } from 'zustand'; //almacen global

//Datos Usuario
const USUARIO_VALIDO = 'admin';
const PASSWORD_VALIDO = '1234';

type Sesion = {
  estaLogueado: boolean;
  error: string;
  iniciarSesion: (usuario: string, password: string) => void;
  cerrarSesion: () => void;
};

//Gaurdar sesion
export const useAlmacenSesion = create<Sesion>((set) => ({
  estaLogueado: false,
  error: '',

  //Comprueba Usuario y loguea
  iniciarSesion: (usuario: string, password: string) => {
    if (usuario == USUARIO_VALIDO && password == PASSWORD_VALIDO) {
      set({ estaLogueado: true, error: '' });
    } else {
      set({ error: 'Usuario o contraseña incorrectos' });
    }
  },

  //Cerrar la sesion
  cerrarSesion: () => {
    set({ estaLogueado: false, error: '' });
  },
}));