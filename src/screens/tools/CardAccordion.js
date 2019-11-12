/* eslint-disable max-len */
import React from 'react';
import { View } from 'react-native';
import { Card } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import _ from 'lodash';

import { runSpring } from '../utils/ReanimatedUtils';

const { Value, event, cond, eq, block, set, or, call } = Animated;

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
        this.animToggle = new Value(3);

        this.animValueFooter = new Value(0);
        this.animTtriggerFooter = new Value(0);

        this.valueZero = new Value(0);
        this.valueOne = new Value(1);

        this.stateAccordion = 0; // Fechado 0, Aberto 1

        this.debouncedUpdateHeight = _.debounce(this.updateAnimated, 1000);

        this.state = {
            viewHeight: 0,
            hasError: false,
            textFooter: 'Salvando...'
        };
    }

    onLayoutUpdate = (newHeight) => this.debouncedUpdateHeight(newHeight)

    openAccordion = () => this.animToggle.setValue(3);

    showFooter = () => this.animTtriggerFooter.setValue(1);

    closeAccordion = () => this.animToggle.setValue(4);

    changeTextFooter = (value) => this.setState({ textFooter: value, hasError: false });

    changeTextFooterWithError = (value) => this.setState({ textFooter: value, hasError: true });

    hideFooter = () => this.animTtriggerFooter.setValue(0);

    runAccordionControl = () => {
        setTimeout(this.runAccordionControlTimeout, 500);
    }

    runAccordionControlTimeout = () => {
        if (this.stateAccordion) {
            this.openAccordion();
        } else {
            this.closeAccordion();
        }
    }

    updateAnimated = (newHeight) => {
        this.setState(
            { viewHeight: newHeight },
            this.runAccordionControl
        );
    }

    updateAccordionState = ([value]) => (this.stateAccordion = value)

    render = () => {
        const {
            title,
            titleStyle,
            titleLeftComponent,
            content,
            children,
            keyCard
        } = this.props;

        return (
            <Card style={{ marginHorizontal: 10, marginTop: 10 }}>
                <Animated.Code
                    key={`${keyCard}${this.state.viewHeight}`}
                >
                    {
                        () =>
                            block([
                                cond(
                                    or(
                                        eq(this.animToggleState, State.END),
                                        eq(this.animToggle, 3),
                                        eq(this.animToggle, 4)
                                    ),
                                    cond(
                                        or(eq(this.animToggle, 1), eq(this.animToggle, 4)),
                                        runSpring(
                                            this.animValue, 
                                            0, 
                                            12, 
                                            [
                                                set(this.animToggleState, State.UNDETERMINED), 
                                                set(this.animToggle, 0), 
                                                call([this.valueZero], this.updateAccordionState)
                                            ]),
                                        runSpring(
                                            this.animValue, 
                                            this.state.viewHeight, 
                                            12, 
                                            [
                                                set(this.animToggleState, State.UNDETERMINED), 
                                                set(this.animToggle, 1), 
                                                call([this.valueOne], this.updateAccordionState)
                                            ])
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

                            this.onLayoutUpdate(heightNew);
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
                        {
                            !!this.props.renderFooter && (
                                <React.Fragment>
                                    {
                                        this.props.enableFooterAnim && (
                                            <Animated.Code
                                                key={`${keyCard}footer`}
                                            >
                                                {
                                                    () =>
                                                        block([
                                                            cond(
                                                                eq(this.animTtriggerFooter, 0),
                                                                runSpring(this.animValueFooter, 0, 12),
                                                                runSpring(this.animValueFooter, 200, 12)
                                                            )
                                                        ])
                                                }
                                            </Animated.Code>
                                        )
                                    }
                                    <Animated.View
                                        style={{
                                            ...(this.props.footerHeight ? { 
                                                height: this.props.footerHeight,
                                                overflow: 'hidden',
                                                opacity: this.props.enableFooterAnim ? 
                                                    Animated.interpolate(this.animValueFooter, {
                                                        inputRange: [0, 200],
                                                        outputRange: [0, 1],
                                                        extrapolate: Animated.Extrapolate.CLAMP
                                                    }) : 1
                                            } : {}),
                                        }}
                                    >
                                        {
                                            typeof this.props.renderFooter === 'function' ? 
                                            this.props.renderFooter()
                                            :
                                            <this.props.renderFooter text={this.state.textFooter} hasError={this.state.hasError} />
                                        }
                                    </Animated.View>
                                </React.Fragment>
                            )
                        }
                    </View>
                </Animated.View>
            </Card>
        );
    }
}

export default CardAccordion;
