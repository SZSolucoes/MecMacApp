/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Icon } from 'react-native-elements';

const { Value, block, cond, eq, call, set } = Animated;

const TRIGGER_TYPE = {
    LIKE: 0,
    UNLIKE: 1,
    WARNING: 2
};

class FormCompleteActionsRow extends React.PureComponent {
    constructor(props) {
        super(props);

        this.controlAnimSelected = TRIGGER_TYPE.WARNING;

        this.animLikeValue = new Value(0);
        this.animUnLikeValue = new Value(0);
        this.animWarningValue = new Value(1);

        this.animTriggerType = new Value(-1);
    }

    onPressTouch = () => this.animTriggerType.setValue(this.getNextTriggerType())

    getNextTriggerType = () => {
        if (this.controlAnimSelected === TRIGGER_TYPE.LIKE) return TRIGGER_TYPE.UNLIKE;
        if (this.controlAnimSelected === TRIGGER_TYPE.UNLIKE) return TRIGGER_TYPE.WARNING;
        if (this.controlAnimSelected === TRIGGER_TYPE.WARNING) return TRIGGER_TYPE.LIKE;
    }

    setControlAnimValue = () => (this.controlAnimSelected = this.getNextTriggerType())

    render = () => (
        <View style={styles.mainView}>
            <Animated.Code>
                {
                    () =>
                        block([
                            cond(
                                eq(this.animTriggerType, TRIGGER_TYPE.LIKE),
                                [
                                    set(this.animWarningValue, 0),
                                    set(this.animUnLikeValue, 0),
                                    set(this.animLikeValue, 1),
                                    call([], () => this.setControlAnimValue()),
                                ],
                                cond(
                                    eq(this.animTriggerType, TRIGGER_TYPE.UNLIKE),
                                    [
                                        set(this.animWarningValue, 0),
                                        set(this.animLikeValue, 0),
                                        set(this.animUnLikeValue, 1),
                                        call([], () => this.setControlAnimValue()),
                                    ],
                                    cond(
                                        eq(this.animTriggerType, TRIGGER_TYPE.WARNING),
                                        [
                                            set(this.animLikeValue, 0),
                                            set(this.animUnLikeValue, 0),
                                            set(this.animWarningValue, 1),
                                            call([], () => this.setControlAnimValue())
                                        ]
                                    )
                                )
                            )
                        ])
                }
            </Animated.Code>
            <TouchableOpacity
                onPress={this.onPressTouch}
            >
                <View style={styles.mainView}>
                    <Animated.View
                        style={[{
                            ...StyleSheet.absoluteFillObject,
                            opacity: this.animLikeValue
                        }, styles.centerEnd]}
                    >
                        <Icon name={'thumb-up'} type={'material-community'} color={'green'} />
                    </Animated.View>
                    <Animated.View
                        style={[{
                            ...StyleSheet.absoluteFillObject,
                            opacity: this.animUnLikeValue
                        }, styles.centerEnd]}
                    >
                        <Icon name={'thumb-down'} type={'material-community'} color={'red'} />
                    </Animated.View>
                    <Animated.View
                        style={[{
                            ...StyleSheet.absoluteFillObject,
                            opacity: this.animWarningValue
                        }, styles.centerEnd]}
                    >
                        <Icon name={'alert'} type={'material-community'} color={'orange'} />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centerEnd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
});

export default FormCompleteActionsRow;
