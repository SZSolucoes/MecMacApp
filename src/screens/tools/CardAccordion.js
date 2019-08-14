/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Card } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

import { runSpring } from '../utils/ReanimatedUtils';

const { Value, event, cond, eq, block, set, or } = Animated;

class CardAccordion extends React.PureComponent {
    constructor(props) {
        super(props);

        this.animToggleState = new Value(-1);
        this.onStateChange = event([
            {
                nativeEvent: { state: this.animToggleState }
            }
        ]);

        this.animValue = new Value(-1);
        this.animToggle = new Value(1);

        this.state = {
            viewHeight: 0
        };
    }

    openAccordion = () => this.animToggle.setValue(3);

    render = () => {
        const {
            title,
            titleStyle,
            titleLeftComponent,
            content,
            children
        } = this.props;

        return (
            <Card style={{ marginHorizontal: 10, marginTop: 10 }}>
                <Animated.Code
                    key={this.state.viewHeight}
                >
                    {
                        () =>
                            block([
                                cond(
                                    or(
                                        eq(this.animToggleState, State.END),
                                        eq(this.animToggle, 3)
                                    ),
                                    cond(
                                        eq(this.animToggle, 1),
                                        runSpring(this.animValue, 0, 12, [set(this.animToggleState, State.UNDETERMINED), set(this.animToggle, 0)]),
                                        runSpring(this.animValue, this.state.viewHeight, 12, [set(this.animToggleState, State.UNDETERMINED), set(this.animToggle, 1)])
                                    )
                                )
                            ])
                    }
                </Animated.Code>
                <TapGestureHandler
                    maxDurationMs={10000} 
                    onHandlerStateChange={this.onStateChange}
                >
                    <Animated.View>
                        <Card.Title
                            style={{ height: null, padding: 5 }}
                            title={title || 'asd'}
                            titleStyle={titleStyle || { fontSize: 16 }}
                            left={titleLeftComponent}
                            leftStyle={{ width: null, height: null }}
                            right={() =>
                                <Animated.View
                                    style={{
                                        transform: [{
                                            rotateZ: Animated.concat(
                                                Animated.interpolate(this.animValue, {
                                                    inputRange: [-1, 0, this.state.viewHeight || 50],
                                                    outputRange: [(content || children) ? 180 : 0, 0, 180],
                                                    extrapolate: Animated.Extrapolate.CLAMP
                                                }), 
                                                'deg'
                                            )
                                        }]
                                    }}
                                >
                                    <Icon 
                                        name={'keyboard-arrow-down'}
                                        color={'gray'}
                                        containerStyle={{ 
                                            width: 50
                                        }}
                                    />
                                </Animated.View>
                            }
                        />
                    </Animated.View>
                </TapGestureHandler>
                <Animated.View
                    style={{
                        height: this.animValue,
                        overflow: 'hidden'
                    }}
                >
                    <View
                        onLayout={e => {
                            const heightNew = e.nativeEvent.layout.height;

                            this.setState({ viewHeight: heightNew }, () => this.animValue.setValue(heightNew));
                        }}
                    >
                        {
                            !!(content || children) &&
                            (
                                <Card.Content>
                                    {content || children}
                                    <View style={{ marginTop: 15 }} />
                                </Card.Content>
                            )
                        }
                    </View>
                </Animated.View>
            </Card>
        );
    }
}

export default CardAccordion;
