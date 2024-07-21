import { useContext } from 'react';

import { MainContext } from '../main/main-context';
// import { AuthContext } from '../context/auth0/auth-context';
// import { AuthContext } from '../context/amplify/auth-context';
// import { AuthContext } from '../context/firebase/auth-context';
// import { AuthContext } from '../context/supabase/auth-context';

// ----------------------------------------------------------------------

export const useMainContext = () => {
  const context = useContext(MainContext);

  if (!context) throw new Error('useMainContext context must be use inside AuthProvider');

  return context;
};
