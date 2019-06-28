import { combineReducers } from 'redux';
import SystemEventsReducer from './SystemEventsReducer';
import CustomHomeTabBarReducer from './CustomHomeTabBarReducer';
import UserReducer from './UserReducer';

export default combineReducers({
    SystemEventsReducer,
    CustomHomeTabBarReducer,
    UserReducer
});
