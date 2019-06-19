import React from 'react';
import { Appbar } from 'react-native-paper';
import { 
    View,
    Text,
    StyleSheet
} from 'react-native';
import { colorAppForeground, colorAppPrimary } from '../utils/Constants';

export default class ProfileScreenFragment extends React.Component {
    render = () => (
        <View style={styles.mainView}>
            <Appbar style={{ backgroundColor: colorAppPrimary }}>
                <Appbar.BackAction onPress={() => this.props.backToProfile()} />
            </Appbar>
            <Text onPress={() => this.props.backToProfile()}>Profile Fragment</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colorAppForeground
    },
});
