const INITIAL_STATE = {
    nickname: '',
    manufacturer: '',
    model: '',
    fuel: '',
    screenFragment: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_addvehicle_nickname':
            return { 
                ...state, 
                nickname: action.payload
            };
        case 'modify_addvehicle_manufacturer':
            return { 
                ...state, 
                manufacturer: action.payload
            };
        case 'modify_addvehicle_model':
            return { 
                ...state, 
                model: action.payload
            };
        case 'modify_addvehicle_fuel':
            return { 
                ...state, 
                fuel: action.payload
            };
        case 'modify_addvehicle_screenfragment':
            return { 
                ...state, 
                screenFragment: action.payload
            };
        default:
            return state;
    }
};
