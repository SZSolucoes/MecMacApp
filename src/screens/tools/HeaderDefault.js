/* eslint-disable max-len */
import React from 'react';
import { Appbar } from 'react-native-paper';
import { DimissedKeyboardView } from '../utils/Keyboad';

const HeaderDefault = (props) => (
    <DimissedKeyboardView>
        <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
            { props.backComponent || (<Appbar.BackAction {...(props.backActionProps ? props.backActionProps : {})} />) }
            <Appbar.Content title={props.title || ''} titleStyle={{ fontFamily: 'OpenSans-Regular' }} />
        </Appbar.Header>
    </DimissedKeyboardView>
);

export default React.memo(HeaderDefault);
