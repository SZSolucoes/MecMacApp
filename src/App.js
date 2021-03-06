import React from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import Reducers from './reducers';
import Routes from './Routes';
import { initConfigs } from './screens/utils/InitConfigs';

export const store = createStore(Reducers, {}, applyMiddleware(ReduxThunk));

initConfigs();

class App extends React.Component {
    render = () => (
        <Provider store={store}>
            <Routes />
        </Provider>
    )
}

export default App;
