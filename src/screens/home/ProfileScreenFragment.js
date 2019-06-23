import React from 'react';
import { Appbar } from 'react-native-paper';
import { 
    View,
    Text,
    StyleSheet
} from 'react-native';
import { colorAppForeground } from '../utils/Constants';

export default class ProfileScreenFragment extends React.Component {
    render = () => (
        <View style={styles.mainView}>
            <Appbar.Header style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction onPress={() => this.props.backToProfile()} />
            </Appbar.Header>
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
