const INITIAL_STATE = {
    userInfo: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_userreducer_userinfo':
            return { 
                ...state, 
                userInfo: { ...action.payload } 
            };
        default:
            return state;
    }
};
