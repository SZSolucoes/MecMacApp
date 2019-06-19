/* eslint-disable no-undef */
export const getFacebookUserInfo = async (token) => await fetch(`https://graph.facebook.com/me?fields=name,email,picture.type(large)&access_token=${token}`)
    .then((response) => response.json())
    .catch(() => false)