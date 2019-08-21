/* eslint-disable max-len */

export const modifyAlertVisible = (value) => ({ type: 'modify_manuttab_alertvisible', payload: value });
export const modifyAlertTitle = (value) => ({ type: 'modify_manuttab_alerttitle', payload: value });
export const modifyAlertMessage = (value) => ({ type: 'modify_manuttab_alertmessage', payload: value });
export const modifyAlertConfirmFunction = (value) => ({ type: 'modify_manuttab_alertconfirmfunction', payload: value });
export const modifyAlertCancelFunction = (value) => ({ type: 'modify_manuttab_alertcancelfunction', payload: value });
export const modifyAlertInit = () => ({ type: 'modify_manuttab_alertinit' });
export const modifyAlertShowCancelButton = (value) => ({ type: 'modify_manuttab_alertshowcancelbutton', payload: value });
export const modifyAlertShowConfirmButton = (value) => ({ type: 'modify_manuttab_alertshowconfirmbutton', payload: value });
