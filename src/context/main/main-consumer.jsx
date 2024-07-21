import PropTypes from 'prop-types';

import { SplashScreen } from 'src/components/loading-screen';

import { MainContext } from './main-context';

// ----------------------------------------------------------------------

export function MainConsumer({ children }) {
  return (
    <MainContext.Consumer>
      {(main) => (main.loading ? <SplashScreen /> : children)}
    </MainContext.Consumer>
  );
}

MainConsumer.propTypes = {
  children: PropTypes.node,
};
