const INITIAL_STATE = {
    menuChoosed: 0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_homedrawer_menuchoosed':
            return { 
                ...state, 
                menuChoosed: action.payload
            };
        case 'modify_homedrawer_resetreducer':
            return { 
                ...state, 
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};
