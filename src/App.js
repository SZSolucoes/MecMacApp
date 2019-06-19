import React from 'react';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { GoogleSignin } from 'react-native-google-signin';

import Reducers from './reducers';
import Routes from './Routes';

export const store = createStore(Reducers, {}, applyMiddleware(ReduxThunk));

class App extends React.Component {
    componentDidMount = () => {
        GoogleSignin.configure();
    }
    
    render = () => (
        <Provider store={store}>
            <Routes />
        </Provider>
    )
}

export default App;
