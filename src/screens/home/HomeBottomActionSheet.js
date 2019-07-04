/* eslint-disable max-len */
import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { ListItem } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import _ from 'lodash';

import Images from '../utils/AssetsManager';

import { modifyBacChangePosition, modifyFall, modifyGetPosition, modifyPosition } from '../../actions/HomeBottomActionSheetActions';

const { Value, block, cond, eq, call, ceil } = Animated;
const { 
    imgBugatti,
    imgSpider,
    imgKawasaki 
} = Images;

const myVHCs = [
    {
        image: { source: imgBugatti, size: 'medium' },
        name: 'Passeio com a família',
        subtitle: null
    },
    {
        image: { source: imgSpider, size: 'medium' },
        name: 'Só para fim de semana',
        subtitle: null
    },
    {
        image: { source: imgKawasaki, size: 'medium' },
        name: 'Curtir com os amigos',
        subtitle: 'fúria em duas rodas'
    }
];

class HomeBottomActionSheet extends React.PureComponent {
    constructor(props) {
        super(props);

        this.fall = new Value(1);
        this.position = 0;
    }

    componentDidMount = () => {
        if (this.props.modifyBacChangePosition) this.props.modifyBacChangePosition(this.bacChangePosition);
        if (this.props.modifyFall) this.props.modifyFall(this.fall);
        if (this.props.modifyGetPosition) this.props.modifyGetPosition(this.getPosition);
        if (this.props.modifyPosition) this.props.modifyPosition(this.position);
    }

    componentWillUnmount = () => {
        if (this.props.modifyFall) this.props.modifyFall(null);
    }

    getPosition = () => this.position

    checkPosition = ([value]) => {
        // close
        if (value === 1) {
            this.position = 0;
            if (this.props.onManualCloseAS) this.props.onManualCloseAS();
        // open
        } else {
            this.position = 1;
        }

        if (this.props.modifyPosition) this.props.modifyPosition(this.position);
    }

    bacChangePosition = (position) => {
        let pos = position;
        if (position < 0) {
            pos = 0;
        } else if (position > 1) {
            pos = 1;
        }
        if (this.bs) {
            this.bs.snapTo(pos);
            this.position = pos;
        }

        if (this.props.modifyPosition) this.props.modifyPosition(this.position);
    }

    
    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.panelTitle}>Super Máquinas</Text>
                <Text style={styles.panelSubtitle}>
                    Aqui estão os meus veículos para toda a vida
                </Text>
            </View>
        </View>
    )

    renderInner = () => (
        <View style={styles.panel}>
            {
                _.map(myVHCs, (item, index) => (
                    <View key={index} style={styles.panelButton}>
                        <ListItem
                            leftAvatar={item.image}
                            title={item.name}
                            subtitle={item.subtitle}
                            titleStyle={styles.panelButtonTitle}
                            subtitleStyle={styles.panelButtonSubTitle}
                            containerStyle={{ padding: 0, paddingRight: 10, backgroundColor: 'transparent' }}
                        />
                    </View>
                ))
            }
        </View>
    )

    render() {
        return (
            <React.Fragment>
                {
                    this.props.getAnimTabBarTranslateY() &&
                    (
                        <Animated.Code>
                            { () =>
                                block([
                                    cond(eq(this.fall, 1), call([this.fall], this.checkPosition)),
                                    cond(eq(ceil(this.fall), 0), call([this.fall], this.checkPosition))
                                ])
                            }
                        </Animated.Code>
                    )
                }
                <BottomSheet
                    ref={ref => (this.bs = ref)}
                    snapPoints={[0, '70%']}
                    renderContent={this.renderInner}
                    renderHeader={this.renderHeader}
                    initialSnap={0}
                    callbackNode={this.fall}
                />
            </React.Fragment>
        );
    }
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
    box: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    panel: {
        height: 600,
        padding: 20,
        backgroundColor: '#F5FCFF',
    },
    header: {
        backgroundColor: '#F5FCFF',
        shadowColor: '#000000',
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5
    },
    panelButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#318bfb',
        marginVertical: 10,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    panelButtonSubTitle: {
        color: 'white',
    },
    photo: {
        width: '100%',
        height: 225,
        marginTop: 30,
    },
    map: {
        height: '100%',
        width: '100%',
    },
});

const mapStateToProps = () => ({
});

export default connect(mapStateToProps, { 
    modifyBacChangePosition,
    modifyFall,
    modifyGetPosition,
    modifyPosition
})(HomeBottomActionSheet);
