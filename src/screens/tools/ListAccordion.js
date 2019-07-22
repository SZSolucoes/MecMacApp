/* eslint-disable max-len */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { runSpring } from '../utils/ReanimatedUtils';

const { Value, block, cond, eq, call } = Animated;

class ListAccordion extends React.PureComponent {
    constructor(props) {
        super(props);

        this.mainRef = React.createRef();

        this.viewHeightContent = 0;
        this.lockedAnim = false;

        this.animToggle = new Value(-1);

        this.state = {
            expanded: this.props.expanded || false,
        };
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.resetExpandedSwitch !== this.props.resetExpandedSwitch) {
            this.setState({ expanded: false });
        }
    }

    onPressListAccordion = () => {
        //if (this.props.doScrollTo && !this.state.expanded) this.props.doScrollTo(this.mainRef);
        if (this.props.onPress) this.props.onPress();

        if (!this.lockedAnim && this.props.expanded === undefined) {
            this.lockedAnim = true;

            this.setState(state => ({
                expanded: !state.expanded,
            }));
        }
    };

    unlockAnim = () => (this.lockedAnim = false)

    render = () => {
        const {
            left,
            title,
            description,
            children,
            titleStyle,
            iconColor,
            titleColorExpanded,
            descriptionStyle,
            descriptionColor,
            style,
            borderStylesContainer,
            borderStyles = borderStylesContainer || {}
        } = this.props;

        const expanded =
        this.props.expanded !== undefined
            ? this.props.expanded
            : this.state.expanded;

        return (
            <View ref={this.mainRef}>
                <TouchableOpacity
                    onPress={this.onPressListAccordion}
                    activeOpacity={1}
                >
                    <View style={[styles.row, style]}>
                        {
                            left ? left() : null
                        }
                        <View style={styles.content}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.title,
                                    titleColorExpanded ? {
                                        color: expanded ? (titleColorExpanded || 'black') : (titleStyle.color || 'black'),
                                    } : {},
                                    titleStyle,
                                ]}
                            >
                                {title}
                            </Text>
                            {description && (
                                <Text
                                numberOfLines={2}
                                style={[
                                    styles.description,
                                    {
                                    color: descriptionColor,
                                    },
                                    descriptionStyle,
                                ]}
                                >
                                    {description}
                                </Text>
                            )}
                        </View>
                        <View style={description && styles.multiline}>
                            <List.Icon
                                size={24}
                                color={iconColor || 'black'} 
                                icon={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <Animated.Code
                    key={expanded}
                >
                    {
                        () =>
                            block([
                                cond(
                                    eq(expanded, true), 
                                    runSpring(this.animToggle, this.viewHeightContent),
                                    runSpring(this.animToggle, 0)
                                ),
                                call([], this.unlockAnim)
                            ])
                    }
                </Animated.Code>
                <Animated.View
                    style={{
                        height: this.animToggle, 
                        opacity: Animated.interpolate(this.animToggle, {
                            inputRange: [0, this.viewHeightContent / 1.5, this.viewHeightContent],
                            outputRange: [0, 0.5, 1],
                            extrapolate: Animated.Extrapolate.CLAMP
                        }), 
                        overflow: 'hidden'
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            paddingVertical: 5,
                            paddingHorizontal: 15
                        }}
                        onLayout={e => (this.viewHeightContent = e.nativeEvent.layout.height)}
                    >
                        <View
                            style={{
                                ...borderStyles
                            }}
                        >
                            {
                                React.Children.map(children, child => {
                                    if (
                                        left &&
                                        React.isValidElement(child) &&
                                        !child.props.left &&
                                        !child.props.right
                                    ) {
                                        return React.cloneElement(child, {
                                        style: child.props.style,
                                        });
                                    }

                                    return child;
                                })
                            }
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiline: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ListAccordion;
