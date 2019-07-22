/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated from 'react-native-reanimated';

class OverlayTouchable extends React.PureComponent {
    render = () => {
        const {
            pointerEventsState,
            animValueFade,
            onTouch
        } = this.props;

        if (!(pointerEventsState && animValueFade && onTouch)) return [];

        return (
            <Animated.View
                pointerEvents={pointerEventsState === 0 ? 'none' : 'auto'}
                style={{ 
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor:
                    Animated.color(0, 0, 0, 
                        Animated.interpolate(
                            animValueFade, {
                                inputRange: [0, 0.7, 1],
                                outputRange: [0, 0.2, 0.4],
                                extrapolate: Animated.Extrapolate.CLAMP
                            }
                        )
                    )
                }}
                children={(
                    <TouchableWithoutFeedback
                        onPress={() => onTouch && onTouch()}
                    >
                        <View style={{ width: '100%', height: '100%' }} />
                    </TouchableWithoutFeedback>
                )}
            />
        );
    } 
}

export default OverlayTouchable;
