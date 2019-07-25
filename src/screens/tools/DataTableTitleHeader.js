/* eslint-disable max-len */
import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text, DefaultTheme } from 'react-native-paper';
import color from 'color';
import { Tooltip } from 'react-native-elements';

class DataTableTitleHeader extends React.PureComponent {
    renderToolTip = () => {
        const {
            numeric,
            children,
            style,
            iconRight,
            numberOfLines,
            tooltipCompContent
        } = this.props;

        const textColor = color(DefaultTheme.colors.text)
        .alpha(0.6)
        .rgb()
        .string();

        return (
            <View style={[styles.container, numeric && styles.right, style]}>
                <Tooltip popover={tooltipCompContent}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={[styles.cell, { color: textColor }]}
                            numberOfLines={numberOfLines}
                        >
                            {children}
                        </Text>
                        { !!iconRight && iconRight(textColor, styles.icon) }
                    </View>
                </Tooltip>
            </View>
        );
    }

    renderDefault = () => {
        const {
            numeric,
            children,
            onPress,
            style,
            iconRight,
            numberOfLines
        } = this.props;

        const textColor = color(DefaultTheme.colors.text)
        .alpha(0.6)
        .rgb()
        .string();

        return (
            <TouchableWithoutFeedback disabled={!onPress} onPress={onPress}>
                <View style={[styles.container, numeric && styles.right, style]}>
                    <Text
                        style={[styles.cell, { color: textColor }]}
                        numberOfLines={numberOfLines}
                    >
                        {children}
                    </Text>
                    { !!iconRight && iconRight(textColor, styles.icon) }
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render = () => {
        const {
            tooltipCompContent
        } = this.props;

        if (tooltipCompContent) return this.renderToolTip();

        return this.renderDefault();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        paddingVertical: 12,
    },
    right: {
        justifyContent: 'flex-end',
    },
    cell: {
        height: 24,
        lineHeight: 24,
        fontSize: 12,
        fontWeight: '500',
        alignItems: 'center'
    },
    sorted: {
        marginLeft: 8,
    },
    icon: {
        height: 24,
        justifyContent: 'center',
    },
});

export default DataTableTitleHeader;
