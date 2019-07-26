const INITIAL_STATE = {
    nickname: '',
    nicknameHasUpdated: false,
    manufacturer: '',
    manufacturerValue: '',
    year: '',
    yearValue: '',
    model: '',
    modelValue: '',
    fuel: [],
    fuelValue: '',
    screenFragment: '',
    manufacturers: [],
    models: [],
    years: [],
    vehicleTypeSelected: 0,
    bannerVisible: false,
    bannerText: '',
    quilometers: '',
    alertVisible: false,
    alertTitle: '',
    alertMessage: '',
    alertShowCancelButton: true,
    alertShowConfirmButton: true,
    alertConfirmFunction: null,
    alertCancelFunction: null,
    isFetching: false,
    actionsRows: [],
    isLoadingComplete: false,
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
        case 'modify_addvehicle_year':
            return { 
                ...state, 
                year: action.payload
            };
        case 'modify_addvehicle_yearvalue':
            return { 
                ...state, 
                yearValue: action.payload
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
                fuel: [...action.payload]
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
        case 'modify_addvehicle_fragyears':
            return { 
                ...state, 
                years: [...action.payload]
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
        case 'modify_addvehicle_isfetching':
            return { 
                ...state, 
                isFetching: action.payload
            };
        case 'modify_addvehicle_actionsrows':
            return { 
                ...state, 
                actionsRows: [...action.payload]
            };
        case 'modify_addvehicle_isloadingcomplete':
            return { 
                ...state, 
                isLoadingComplete: action.payload
            };
        case 'modify_addvehicle_alertshowcancelbutton':
            return { 
                ...state, 
                alertShowCancelButton: action.payload
            };
        case 'modify_addvehicle_alertshowconfirmbutton':
            return { 
                ...state, 
                alertShowConfirmButton: action.payload
            };
        case 'modify_addvehicle_alertinit':
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
