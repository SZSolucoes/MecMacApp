/* eslint-disable max-len */

export const modifyNickname = (value) => ({ type: 'modify_addvehicle_nickname', payload: value });
export const modifyManufacturer = (value) => ({ type: 'modify_addvehicle_manufacturer', payload: value });
export const modifyManufacturerValue = (value) => ({ type: 'modify_addvehicle_manufacturervalue', payload: value });
export const modifyModel = (value) => ({ type: 'modify_addvehicle_model', payload: value });
export const modifyModelValue = (value) => ({ type: 'modify_addvehicle_modelvalue', payload: value });
export const modifyFuel = (value) => ({ type: 'modify_addvehicle_fuel', payload: value });
export const modifyFuelValue = (value) => ({ type: 'modify_addvehicle_fuelvalue', payload: value });
export const modifyScreenFragment = (value) => ({ type: 'modify_addvehicle_screenfragment', payload: value });
export const modifyManufacturers = (value) => ({ type: 'modify_addvehicle_fragmanufacturers', payload: value });
export const modifyModels = (value) => ({ type: 'modify_addvehicle_fragmodels', payload: value });
export const modifyVehicleTypeSelected = (value) => ({ type: 'modify_addvehicle_fragvehicletypeselected', payload: value });
export const modifyClearMMC = () => ({ type: 'modify_addvehicle_clearmmc' });
