import { ReactNode, Reducer, createContext, useReducer } from 'react';
import { setAuthorization } from '../config/axios/interceptors';
import { authInitialState } from '../config/contants';
import { InitialAuth } from '../types/InitialAuth';
import { AuthAction, AuthReducer } from './AuthReducer';

interface AuthContextProps {
  authState: typeof authInitialState;
  signIn: (login: InitialAuth) => void;
  logout: () => void;
}

// we define what our context looks like
const AuthContextProps : AuthContextProps = {
  authState: authInitialState,
  signIn: () => { },
  logout: () => { },
};

// create the context
export const AuthContext = createContext<AuthContextProps>(AuthContextProps);

interface AuthProviderProps {
  children: ReactNode;
}

// State Provider Component
export const AuthProvider = ({ children } : AuthProviderProps) => {
  const [authState, dispatch] = useReducer<Reducer<InitialAuth, AuthAction>, InitialAuth>(
    AuthReducer,
    authInitialState,
    () => {
      // Función para inicializar el estado basado en localStorage
      const storedState = window.localStorage.getItem('@auth');
      const initialState : InitialAuth = storedState ? JSON.parse(storedState) : authInitialState;
      setAuthorization(initialState.token);
      return initialState;
    }
  );

  const signIn = (login: InitialAuth) => {
    dispatch({ type: 'signIn', payload: login });
  };


  const logout = () => {
    dispatch({ type: 'logout', payload: authInitialState });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
