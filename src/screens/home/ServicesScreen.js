/* eslint-disable max-len */
import React from 'react';
import {
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { colorAppForeground } from '../utils/Constants';

export default class ServicesScreen extends React.PureComponent {
    static navigationOptions = {
        header: null
    };

    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
                <Appbar.Content title={'Serviços'} titleStyle={{ fontFamily: 'OpenSans-Regular' }} />
            </Appbar.Header>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    }
});
