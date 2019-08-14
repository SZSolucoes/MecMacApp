/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import { defaultTextHeader } from '../utils/Styles';
import { homeVehicleUpBar } from '../utils/Constants';

class HomeAppHeader extends React.PureComponent {
    onPressDrawerIcon = () => {
        if (this.props.onBeforeOpenDrawer) this.props.onBeforeOpenDrawer();
        this.props.navigation.openDrawer();
    }
    
    render = () => (
        <Appbar.Header style={{ backgroundColor: 'white', overflow: 'hidden', height: homeVehicleUpBar, elevation: 0 }}>
            <View style={{ width: '100%', justifyContent: 'center', paddingLeft: 10 }}>
                <ListItem
                    leftAvatar={{ 
                        icon: {
                            name: 'ios-car',
                            type: 'ionicon',
                            size: 34,
                            color: 'black'
                        },
                        overlayContainerStyle: {
                            backgroundColor: 'white',
                            borderWidth: 0.8
                        },
                        editButton: {
                            size: 14,
                            color: 'black',
                            name: 'ios-menu',
                            type: 'ionicon',
                            style: styles.iconDrawer,
                            underlayColor: 'white'
                        },
                        showEditButton: true,
                        activeOpacity: 1,
                        onPress: this.onPressDrawerIcon,
                        onEditPress: this.onPressDrawerIcon
                    }}
                    rightIcon={this.props.rightIcon}
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                    titleStyle={this.props.titleStyle || defaultTextHeader}
                    containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                />
            </View>
        </Appbar.Header>
    )
}

const styles = StyleSheet.create({
    iconDrawer: {
        backgroundColor: 'white', 
        borderColor: 'grey', 
        borderWidth: 0.5, 
        width: 18, 
        height: 18, 
        borderRadius: 9
    }
});

export default HomeAppHeader;
