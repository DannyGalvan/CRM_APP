import { setAuthorization } from '../config/axios/interceptors';
import { InitialAuth } from '../types/InitialAuth';

// generates the state of the application based on the action type

export interface AuthAction {
  type: "signIn" | "logout";
  payload: InitialAuth;
}

export const AuthReducer = (state : InitialAuth, action : AuthAction) => {
  let newState : InitialAuth;
  switch (action.type) {
    case 'signIn':
      newState = {
        ...state,
        ...action.payload,
      };
      setAuthorization(action.payload.token);
      window.localStorage.setItem('@auth', JSON.stringify(newState));
      return newState;
    case 'logout':
      window.localStorage.clear();
      setAuthorization('');
      newState = {
        ...state,
        ...action.payload,
      };
      return newState;
    default:
      return state;
  }
};
