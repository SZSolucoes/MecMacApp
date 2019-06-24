/* eslint-disable max-len */
import React from 'react';
import { Appbar } from 'react-native-paper';
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';

export default class ProfileScreenFragment extends React.Component {
    render = () => (
        <SafeAreaView style={styles.mainView}>
            <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: 60, elevation: 0 }}>
                <Appbar.BackAction onPress={() => this.props.backToProfile()} />
                <Appbar.Content title={'Profile Frag'} titleStyle={{ fontFamily: 'OpenSans-Regular' }} />
            </Appbar.Header>
            <Text onPress={() => this.props.backToProfile()}>Profile Fragment</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
});
