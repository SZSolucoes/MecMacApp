import React from 'react';
import { 
    View,
    StyleSheet,
} from 'react-native';
import { Swiper } from 'react-native-awesome-viewpager';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';

import { colorAppForeground } from '../utils/Constants';
import ProfileScreenFragment from './ProfileScreenFragment';

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    backToProfile = () => this.swiperRef && this.swiperRef.setPage(0)

    render = () => (
        <Swiper
            ref={ref => (this.swiperRef = ref)}
            autoplay={false}
            interval={5000}
            onPageScroll={() => false}
            onPageScrollStateChanged={() => false}
            onPageSelected={() => false}
            scrollEnabled={false}
            indicator={false}
            style={styles.mainView}
        >
            <View style={{ flex: 1 }}>
                <List.Section>
                    <List.Subheader>Some title</List.Subheader>
                    <List.Item
                        title="First Item"
                        left={() => <List.Icon icon="folder" />}
                    />
                    <List.Item
                        title="Second Item"
                        titleStyle={{ color: 'black' }}
                        left={() => <List.Icon color="#000" icon="folder" />}
                        right={() => <Icon color="#000" name="ios-arrow-forward" type={'ionicon'} />}
                    />
                </List.Section>
            </View>
            <ProfileScreenFragment backToProfile={this.backToProfile} />
        </Swiper>
            
    )
}

const styles = StyleSheet.create({
    mainView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colorAppForeground
    }
});
