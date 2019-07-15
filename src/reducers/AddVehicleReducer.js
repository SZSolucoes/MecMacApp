const INITIAL_STATE = {
    nickname: '',
    manufacturer: '',
    manufacturerValue: '',
    model: '',
    modelValue: '',
    fuel: '',
    fuelValue: '',
    screenFragment: '',
    manufacturers: [],
    models: [],
    vehicleTypeSelected: 0
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
        case 'modify_addvehicle_clearmmc':
            return { 
                ...state, 
                manufacturer: '',
                model: '',
                fuel: ''
            };
        default:
            return state;
    }
};
