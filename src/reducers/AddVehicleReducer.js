const INITIAL_STATE = {
    nickname: '',
    nicknameHasUpdated: false,
    manufacturer: '',
    manufacturerValue: '',
    model: '',
    modelValue: '',
    fuel: '',
    fuelValue: '',
    screenFragment: '',
    manufacturers: [],
    models: [],
    vehicleTypeSelected: 0,
    bannerVisible: false,
    bannerText: '',
    quilometers: '',
    alertVisible: false,
    alertTitle: '',
    alertMessage: '',
    alertConfirmFunction: null,
    alertCancelFunction: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_addvehicle_nickname':
            return { 
                ...state, 
                nickname: action.payload
            };
        case 'modify_addvehicle_nicknamehasupdated':
            return { 
                ...state, 
                nicknameHasUpdated: action.payload
            };
        case 'modify_addvehicle_manufacturer':
            return { 
                ...state, 
                manufacturer: action.payload
            };
        case 'modify_addvehicle_manufacturervalue':
            return { 
                ...state, 
                manufacturerValue: action.payload
            };
        case 'modify_addvehicle_model':
            return { 
                ...state, 
                model: action.payload
            };
        case 'modify_addvehicle_modelvalue':
            return { 
                ...state, 
                modelValue: action.payload
            };
        case 'modify_addvehicle_fuel':
            return { 
                ...state, 
                fuel: action.payload
            };
        case 'modify_addvehicle_fuelvalue':
            return { 
                ...state, 
                fuelValue: action.payload
            };
        case 'modify_addvehicle_screenfragment':
            return { 
                ...state, 
                screenFragment: action.payload
            };
        case 'modify_addvehicle_fragmanufacturers':
            return { 
                ...state, 
                manufacturers: [...action.payload]
            };
        case 'modify_addvehicle_fragmodels':
            return { 
                ...state, 
                models: [...action.payload]
            };
        case 'modify_addvehicle_fragvehicletypeselected':
            return { 
                ...state, 
                vehicleTypeSelected: action.payload
            };
        case 'modify_addvehicle_bannervisible':
            return { 
                ...state, 
                bannerVisible: action.payload
            };
        case 'modify_addvehicle_bannertext':
            return { 
                ...state, 
                bannerText: action.payload
            };
        case 'modify_addvehicle_quilometers':
            return { 
                ...state, 
                quilometers: action.payload
            };
        case 'modify_addvehicle_alertvisible':
            return { 
                ...state, 
                alertVisible: action.payload
            };
        case 'modify_addvehicle_alerttitle':
            return { 
                ...state, 
                alertTitle: action.payload
            };
        case 'modify_addvehicle_alertmessage':
            return { 
                ...state, 
                alertMessage: action.payload
            };
        case 'modify_addvehicle_alertconfirmfunction':
            return { 
                ...state, 
                alertConfirmFunction: action.payload
            };
        case 'modify_addvehicle_alertcancelfunction':
            return { 
                ...state, 
                alertCancelFunction: action.payload
            };
        case 'modify_addvehicle_clearmmc':
            return { 
                ...state, 
                manufacturer: '',
                model: '',
                fuel: ''
            };
        case 'modify_addvehicle_resetreducer':
            return {
                ...state,
                ...INITIAL_STATE
            };
        default:
            return state;
    }
};
