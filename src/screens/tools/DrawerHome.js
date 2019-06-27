/* eslint-disable max-len */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Drawer } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import Ripple from 'react-native-material-ripple';
import { colorAppPrimary } from '../utils/Constants';
import { defaultTextHeader } from '../utils/Styles';

class DrawerHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItemMenu: 'home'
        };
    }

    render() {
        return (
            <ScrollView>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{ padding: 15, backgroundColor: colorAppPrimary }}>
                        <ListItem
                            leftAvatar={{ 
                                source: { uri: null },
                                editButton: {
                                    style: styles.iconDrawer,
                                    underlayColor: 'white'
                                },
                                showEditButton: true,
                                activeOpacity: 1,
                                onPress: () => this.onPressDrawerIcon(),
                                onEditPress: () => this.onPressDrawerIcon()
                            }}
                            title={'Roney Maia'}
                            titleStyle={[defaultTextHeader, { color: 'white' }]}
                            subtitle={'roneymaia@gmail.com'}
                            subtitleStyle={{ color: 'white' }}
                            containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                        />
                    </View>
                    <Drawer.Section title="Some title">
                        <ListItem
                            Component={(props) => <Ripple rippleColor={colorAppPrimary} {...props} style={styles.listItem} />}
                            leftAvatar={{ 
                                source: { uri: null },
                            }}
                            title={'Home'}
                            titleStyle={styles.listItemTitle}
                            containerStyle={{ padding: 0, backgroundColor: 'transparent' }}
                        />
                    </Drawer.Section>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        padding: 10
    },
    listItemTitle: {
        fontFamily: 'OpenSans-SemiBold', 
        fontSize: 14, 
        color: 'black'
    }
});

export default DrawerHome;

