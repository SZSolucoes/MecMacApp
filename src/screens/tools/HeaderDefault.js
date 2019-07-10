/* eslint-disable max-len */
import React from 'react';
import { Appbar } from 'react-native-paper';

const HeaderDefault = (props) => (
    <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
        <Appbar.BackAction {...(props.backActionProps ? props.backActionProps : {})} />
        <Appbar.Content title={props.title || ''} titleStyle={{ fontFamily: 'OpenSans-Regular' }} />
    </Appbar.Header>
);

export default HeaderDefault;
