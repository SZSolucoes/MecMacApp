import { combineReducers } from 'redux';
import SystemEventsReducer from './SystemEventsReducer';
import UserReducer from './UserReducer';
import CustomHomeTabBarReducer from './CustomHomeTabBarReducer';
import HomeBottomActionSheetReducer from './HomeBottomActionSheetReducer';

export default combineReducers({
    SystemEventsReducer,
    UserReducer,
    CustomHomeTabBarReducer,
    HomeBottomActionSheetReducer
});
