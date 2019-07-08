const INITIAL_STATE = {
    handleFacebookLogout: async () => false,
    handleGoogleLogout: async () => false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_signinreducer_handlefacebooklogout':
            return { 
                ...state, 
                handleFacebookLogout: action.payload
            };
        case 'modify_signinreducer_handlegooglelogout':
            return { 
                ...state, 
                handleGoogleLogout: action.payload
            };
        default:
            return state;
    }
};
