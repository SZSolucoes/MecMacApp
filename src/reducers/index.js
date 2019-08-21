import { combineReducers } from 'redux';
import SystemEventsReducer from './SystemEventsReducer';
import UserReducer from './UserReducer';
import CustomHomeTabBarReducer from './CustomHomeTabBarReducer';
import HomeBottomActionSheetReducer from './HomeBottomActionSheetReducer';
import SignInReducer from './SignInReducer';
import HomeDrawerReducer from './HomeDrawerReducer';
import AddVehicleReducer from './AddVehicleReducer';
import ManutTabReducer from './ManutTabReducer';

export default combineReducers({
    SystemEventsReducer,
    UserReducer,
    CustomHomeTabBarReducer,
    HomeBottomActionSheetReducer,
    SignInReducer,
    HomeDrawerReducer,
    AddVehicleReducer,
    ManutTabReducer
});
