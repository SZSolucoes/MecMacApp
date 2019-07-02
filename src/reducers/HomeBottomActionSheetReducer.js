const INITIAL_STATE = {
    bacChangePosition: () => false,
    fall: null,
    getPosition: () => false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_homebottomactionsheet_bacchangeposition':
            return { 
                ...state, 
                bacChangePosition: action.payload
            };
        case 'modify_homebottomactionsheet_fall':
            return { 
                ...state, 
                fall: action.payload
            };
        case 'modify_homebottomactionsheet_getposition':
            return { 
                ...state, 
                getPosition: action.payload
            };
        default:
            return state;
    }
};

