import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  register_state:null,
  loading: true,
  bankAdmin: null,
  update_password_message:null
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
      bankAdmin: action.payload.bankAdmin?action.payload.bankAdmin:null,
      register_state:null
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
      bankAdmin: action.payload.bankAdmin?action.payload.bankAdmin:null
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      register_state: action.payload.register_state,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
      bankAdmin:null,
    };
  }
  if (action.type === 'UPDATE_USER_ACCOUNT') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'UPDATE_PASSWORD') {
    return {
      ...state,
      update_password_message: action.payload.update_password_message.message,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const { user, bankAdmin } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            bankAdmin:{
              ...bankAdmin
            },
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
            bankAdmin:null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
          bankAdmin:null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // // LOGIN
  // const admin_login = useCallback(async (email, password) => {
  //   const data = {
  //     email,
  //     password,
  //   };

  //   const response = await axios.post(endpoints.auth.login, data);

  //   const { accessToken, user } = response.data;

  //   if (user.role === "user") {
  //     throw new Error('Invalid user type! Please use user login');
  //   }

  //   setSession(accessToken);

  //   dispatch({
  //     type: 'LOGIN',
  //     payload: {
  //       user: {
  //         ...user,
  //         accessToken,
  //       },
  //     },
  //   });
  // }, []);

  // USER LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);
    const { accessToken, user,bankAdmin } = response.data;

    if (user.role === "admin") {
      // bankAdmin = null
    }

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        bankAdmin:{
          ...bankAdmin
        },
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (userDetails) => {
    const newUser = {
      email: userDetails.email?userDetails.email:'',
      displayName: userDetails.displayName?userDetails.displayName:'',
      branchName: userDetails.branchName?userDetails.branchName:'',
      branchCode: userDetails.branchCode?userDetails.branchCode:'',
      role: userDetails.role?userDetails.role:'user',
      category: userDetails.category?userDetails.category:''
    };

    const response = await axios.post(endpoints.auth.register, newUser);

    const { success, message, data } = response.data;

    dispatch({
      type: 'REGISTER',
      payload: {
        register_state: {
          success,message,data
        },
      },
    });
  }, []);

  // UPDATE PASSWORD
  const update_password = useCallback(async (password) => {

    const response = await axios.put(endpoints.user.update_password, password);

    console.log(response.data);
    const { success, message } = response.data;

    dispatch({
      type: 'UPDATE_PASSWORD',
      payload: {
        update_password_message: {
          success,
          message,
        },
      },
    });
  }, []);

  // UPDATE PASSWORD
  const update_user_account = useCallback(async (updeateUser) => {
    const updatedUser = {
      branchCode:updeateUser.branchCode,
      branchName:updeateUser.branchName
    }
    const response = await axios.put(endpoints.user.update_account, updeateUser);
    const user = response.data.data;

    dispatch({
      type: 'UPDATE_USER_ACCOUNT',
      payload: {
        user: {
          ...user,
       },
      },
    });
  }, []);
  

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      bankAdmin: state.bankAdmin,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      update_password_message:state.update_password_message,
      register_state: state.register_state,
      //
      login,
      register,
      update_user_account,
      update_password,
      logout,
      
    }),
    [ 
      login, 
      update_user_account, 
      update_password, 
      logout, 
      register, 
      state.user, 
      state.bankAdmin, 
      state.update_password_message,
      state.register_state,
      status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
