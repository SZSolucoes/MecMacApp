const INITIAL_STATE = {
    animatedVisible: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_customhometabbar_animatedvisible':
            return { 
                ...state, 
                animatedVisible: action.payload 
            };
        default:
            return state;
    }
};
