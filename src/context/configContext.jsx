import React, { useState, useEffect, useContext, createContext } from 'react';

import axios, { endpoints } from 'src/utils/axios';
const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({ currencySymbol: '$', locale: 'en-US' }); // Default values

  useEffect(() => {
    // const fetchConfig = async () => {
    //   try {
    //     const config = await axios.get(endpoints.config.get_config);
    //     console.log("fetchConfig", config.data);

    //     setConfig(config.data);
    //   } catch (error) {
    //     console.error('Failed to fetch config:', error);
    //   }
    // };

    // fetchConfig();

    const config = {
      currency:  "LKR",
      currencySymbol:"Rs.",
      locale: "en-GB",
      countryCode: "LK",
      decimals: 2,
      // propertyStateEnabled: process.env.PROPERTY_STATE_ENABLED == "true",
      // testModeEnabled: process.env.TEST_MODE_ENABLED == "true",
    };

    setConfig(config)
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => useContext(ConfigContext);
