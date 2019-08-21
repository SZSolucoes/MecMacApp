const INITIAL_STATE = {
    alertVisible: false,
    alertTitle: '',
    alertMessage: '',
    alertShowCancelButton: true,
    alertShowConfirmButton: true,
    alertConfirmFunction: null,
    alertCancelFunction: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_manuttab_alertvisible':
            return { 
                ...state, 
                alertVisible: action.payload
            };
        case 'modify_manuttab_alerttitle':
            return { 
                ...state, 
                alertTitle: action.payload
            };
        case 'modify_manuttab_alertmessage':
            return { 
                ...state, 
                alertMessage: action.payload
            };
        case 'modify_manuttab_alertconfirmfunction':
            return { 
                ...state, 
                alertConfirmFunction: action.payload
            };
        case 'modify_manuttab_alertcancelfunction':
            return { 
                ...state, 
                alertCancelFunction: action.payload
            };
        case 'modify_manuttab_alertshowcancelbutton':
            return { 
                ...state, 
                alertShowCancelButton: action.payload
            };
        case 'modify_manuttab_alertshowconfirmbutton':
            return { 
                ...state, 
                alertShowConfirmButton: action.payload
            };
        case 'modify_manuttab_alertinit':
            return { 
                ...state, 
                alertVisible: false,
                alertTitle: '',
                alertMessage: '',
                alertShowCancelButton: true,
                alertShowConfirmButton: true,
                alertConfirmFunction: null,
                alertCancelFunction: null
            };
        case 'modify_manuttab_resetreducer':
            return {
                ...state,
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};
