const INITIAL_STATE = {
    menuChoosed: 'main',
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_homedrawer_menuchoosed':
            return { 
                ...state, 
                menuChoosed: action.payload
            };
        default:
            return state;
    }
};
