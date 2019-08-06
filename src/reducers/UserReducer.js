const INITIAL_STATE = {
    userInfo: {},
    vehicleSelected: {
        uniqueId: null,
        manufacturer: null,
        model: null,
        year: null,
        price: null,
        fuel: null,
        fipe_ref: null,
        nickname: null,
        quilometers: null
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'modify_userreducer_userinfo':
            return { 
                ...state, 
                userInfo: { ...action.payload } 
            };
        case 'modify_userreducer_vehicleselected':
            return { 
                ...state, 
                vehicleSelected: { ...action.payload } 
            };
        default:
            return state;
    }
};
