const INITIAL_STATE = {
    animatedVisible: null,
    getAnimTabBarTranslateY: () => false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_customhometabbar_animatedvisible':
            return { 
                ...state, 
                animatedVisible: action.payload 
            };
        case 'modify_customhometabbar_getanimtabbartranslatey':
            return { 
                ...state, 
                getAnimTabBarTranslateY: action.payload 
            };
        default:
            return state;
    }
};
