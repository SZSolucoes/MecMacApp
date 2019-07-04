/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import Animated from 'react-native-reanimated';

const { Value, set, block } = Animated;

class HomeOverlayTouchable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.animBg = new Value(1);
    }
    render = () => (
            <Animated.View
                pointerEvents={this.props.positionHomeBottomActionSheet === 0 ? 'none' : 'auto'}
                style={{ 
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor:
                    Animated.color(0, 0, 0, 
                        Animated.interpolate(
                            this.animBg, {
                                inputRange: [0, 1],
                                outputRange: [0.6, 0],
                                extrapolate: Animated.Extrapolate.CLAMP
                            }
                        )
                    )
                }}
                children={(
                    <TouchableWithoutFeedback
                        onPress={() => this.props.onPressActionChooseVHC()}
                    >
                        <View style={{ width: '100%', height: '100%' }}>
                        {
                            this.props.fallHomeBottomActionSheet &&
                            (
                                <Animated.Code>
                                    {
                                        () =>
                                            block([
                                                set(this.animBg, this.props.fallHomeBottomActionSheet)
                                            ])
                                    }
                                </Animated.Code>
                            )
                        }
                        </View>
                    </TouchableWithoutFeedback>
                )}
            />
    );

}

const mapStateToProps = state => ({
    fallHomeBottomActionSheet: state.HomeBottomActionSheetReducer.fall,
    positionHomeBottomActionSheet: state.HomeBottomActionSheetReducer.position
});

export default connect(mapStateToProps)(HomeOverlayTouchable);
