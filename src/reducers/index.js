import { combineReducers } from 'redux';
import SystemEventsReducer from './SystemEventsReducer';
import UserReducer from './UserReducer';
import CustomHomeTabBarReducer from './CustomHomeTabBarReducer';
import HomeBottomActionSheetReducer from './HomeBottomActionSheetReducer';
import SignInReducer from './SignInReducer';

export default combineReducers({
    SystemEventsReducer,
    UserReducer,
    CustomHomeTabBarReducer,
    HomeBottomActionSheetReducer,
    SignInReducer
});
