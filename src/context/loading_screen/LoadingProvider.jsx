import PropTypes from 'prop-types';
import { useMemo, useState, useContext, useCallback, createContext } from 'react';


const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)

  const setLoadingState = useCallback((status) => {
    setLoading(status);
  }, []);

  const setErrorState = useCallback((status) => {
    setError(status);
    if (status) {
      setLoading(!status);
    }
  }, []);

  const contextValue = useMemo(() => ({ loading, setLoadingState, setErrorState, error }), [loading, setLoadingState, setErrorState, error]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);

LoadingProvider.propTypes = {
  children: PropTypes.node,
};
