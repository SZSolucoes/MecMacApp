import { combineReducers } from 'redux';
import SystemEventsReducer from './SystemEventsReducer';
import CustomHomeTabBarReducer from './CustomHomeTabBarReducer';

export default combineReducers({
    SystemEventsReducer,
    CustomHomeTabBarReducer
});
