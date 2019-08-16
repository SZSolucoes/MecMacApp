/* eslint-disable max-len */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Icon } from 'react-native-elements';
import { MANUT_ATRAS_TRIGGER_TYPE } from '../../utils/Constants';

const { Value, block, cond, eq, call, set } = Animated;

class FormCompleteActionsRow extends React.PureComponent {
    constructor(props) {
        super(props);

        this.controlAnimSelected = MANUT_ATRAS_TRIGGER_TYPE.WARNING;

        this.animLikeValue = new Value(0);
        this.animUnLikeValue = new Value(0);
        this.animWarningValue = new Value(1);

        this.animTriggerType = new Value(-1);
    }

    componentDidMount = () => this.updateInitialIcon()

    componentDidUpdate = (prevProps) => {
        if (prevProps.initialIcon !== this.props.initialIcon) {
            this.updateInitialIcon();
        }
    }

    onPressTouch = () => {
        if (!(this.props.blockChange || this.props.disableAnimChange)) {
            if (this.props.onPressTouchCallback) this.props.onPressTouchCallback(this.props.itemIndex, this.props.itemIndexInRow, this.getNextTriggerType());
            this.animTriggerType.setValue(this.getNextTriggerType());
        }
    }

    getNextTriggerType = () => {
        let next = this.controlAnimSelected;

        if (this.controlAnimSelected === MANUT_ATRAS_TRIGGER_TYPE.LIKE) {
            if (this.props.showTypes && !this.props.showTypes.includes('thumbsdown')) {
                next = MANUT_ATRAS_TRIGGER_TYPE.UNLIKE;
            } else {
                return MANUT_ATRAS_TRIGGER_TYPE.UNLIKE;
            }
        }

        if (this.controlAnimSelected === MANUT_ATRAS_TRIGGER_TYPE.UNLIKE || next === MANUT_ATRAS_TRIGGER_TYPE.UNLIKE) {
            if (this.props.showTypes && !this.props.showTypes.includes('alert')) {
                next = MANUT_ATRAS_TRIGGER_TYPE.WARNING;
            } else {
                return MANUT_ATRAS_TRIGGER_TYPE.WARNING;
            }
        }

        if (this.controlAnimSelected === MANUT_ATRAS_TRIGGER_TYPE.WARNING || next === MANUT_ATRAS_TRIGGER_TYPE.WARNING) {
            if (this.props.showTypes && !this.props.showTypes.includes('thumbsup')) {
                next = MANUT_ATRAS_TRIGGER_TYPE.LIKE;
            } else {
                return MANUT_ATRAS_TRIGGER_TYPE.LIKE;
            }
        }

        return next;
    }

    setControlAnimValue = () => {
        this.controlAnimSelected = this.getNextTriggerType();

        if (this.props.onChangeActionsRows && typeof this.props.itemIndex === 'number' && typeof this.props.itemIndexInRow === 'number') {
            this.props.onChangeActionsRows(this.props.itemIndex, this.controlAnimSelected, this.props.itemIndexInRow);
        }
    }

    updateInitialIcon = () => {
        if (this.props.initialIcon) {
            if (this.props.initialIcon === 'thumbsup') {
                this.animLikeValue.setValue(1);
                this.animUnLikeValue.setValue(0);
                this.animWarningValue.setValue(0);
    
                this.animTriggerType.setValue(-1);
    
                this.controlAnimSelected = MANUT_ATRAS_TRIGGER_TYPE.LIKE;
            } else if (this.props.initialIcon === 'thumbsdown') {
                this.animLikeValue.setValue(0);
                this.animUnLikeValue.setValue(1);
                this.animWarningValue.setValue(0);
    
                this.animTriggerType.setValue(-1);
    
                this.controlAnimSelected = MANUT_ATRAS_TRIGGER_TYPE.UNLIKE;
            } else if (this.props.initialIcon === 'alert') {
                this.animLikeValue.setValue(0);
                this.animUnLikeValue.setValue(0);
                this.animWarningValue.setValue(1);
    
                this.animTriggerType.setValue(-1);
    
                this.controlAnimSelected = MANUT_ATRAS_TRIGGER_TYPE.WARNING;
            }
        }
    }

    renderBasedType = (types) => {
        const views = [];

        if (types.includes('thumbsup')) {
            views.push(
                <Animated.View
                    style={[{
                        ...StyleSheet.absoluteFillObject,
                        opacity: this.animLikeValue
                    }, styles.centerEnd]}
                >
                    <Icon name={'thumb-up'} type={'material-community'} color={'green'} />
                </Animated.View>
            );
        }

        if (types.includes('thumbsdown')) {
            views.push(
                <Animated.View
                    style={[{
                        ...StyleSheet.absoluteFillObject,
                        opacity: this.animUnLikeValue
                    }, styles.centerEnd]}
                >
                    <Icon name={'thumb-down'} type={'material-community'} color={'red'} />
                </Animated.View>
            );
        } 

        if (types.includes('alert')) {
            views.push(
                <Animated.View
                    style={[{
                        ...StyleSheet.absoluteFillObject,
                        opacity: this.animWarningValue
                    }, styles.centerEnd]}
                >
                    <Icon name={'alert'} type={'material-community'} color={'orange'} />
                </Animated.View>
            );
        }

        return views;
    }

    render = () => (
        <View style={[styles.mainView, this.props.enableTrash ? { flexDirection: 'row' } : {}]}>
            {
                !this.props.disableAnimChange && (
                    <Animated.Code>
                        {
                            () =>
                                block([
                                    cond(
                                        eq(this.animTriggerType, MANUT_ATRAS_TRIGGER_TYPE.LIKE),
                                        [
                                            set(this.animWarningValue, 0),
                                            set(this.animUnLikeValue, 0),
                                            set(this.animLikeValue, 1),
                                            call([], () => this.setControlAnimValue()),
                                        ],
                                        cond(
                                            eq(this.animTriggerType, MANUT_ATRAS_TRIGGER_TYPE.UNLIKE),
                                            [
                                                set(this.animWarningValue, 0),
                                                set(this.animLikeValue, 0),
                                                set(this.animUnLikeValue, 1),
                                                call([], () => this.setControlAnimValue()),
                                            ],
                                            cond(
                                                eq(this.animTriggerType, MANUT_ATRAS_TRIGGER_TYPE.WARNING),
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
                )
            }
            <TouchableOpacity
                onPress={this.onPressTouch}
            >
                <View style={styles.mainView}>
                    {
                        this.props.showTypes ?
                        (
                            this.renderBasedType(this.props.showTypes)
                        )
                        :
                        (
                            <React.Fragment>
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
                            </React.Fragment>
                        )
                    }
                </View>
            </TouchableOpacity>
            {
                this.props.enableTrash && (
                    <TouchableOpacity
                        onPress={this.onPressTouch}
                    >
                        <View style={styles.mainView}>
                            <Animated.View
                                style={[{
                                    ...StyleSheet.absoluteFillObject,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }]}
                            >
                                <Icon name={'trash-can'} type={'material-community'} color={'black'} />
                            </Animated.View>
                        </View>
                    </TouchableOpacity>
                )
            }
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
