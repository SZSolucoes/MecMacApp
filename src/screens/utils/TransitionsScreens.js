/* eslint-disable no-unused-vars */
import { Animated, Easing } from 'react-native';

const transitionSpecTransitions = {
    default: {
        duration: 1000,
        easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
        timing: Animated.timing
    }
};

const screenInterpolatorTransitions = {
    TransitionBottomToTop: (sceneProps) => {
        const { position, scene } = sceneProps;
        const { index } = scene;
    
        const inputRange = [index - 1, index, index + 1];
        const opacity = position.interpolate({
            inputRange,
            outputRange: [0.8, 1, 1],
        });
    
        const scaleY = position.interpolate({
            inputRange,
            outputRange: ([0.8, 1, 1]),
        });
    
        return {
            opacity,
            transform: [
                { scaleY }
            ]
        };
    },
    TransitionRightToLeft: (sceneProps) => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;
        const width = layout.initWidth;

        return {
            transform: [{
                translateX: position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [width, 0, -width],
                }),
            }]
        };
    },
    TransitionFade: (sceneProps) => {
        const { position, scene } = sceneProps;
    
        const index = scene.index;
    
        const translateX = 0;
        const translateY = 0;
    
        const opacity = position.interpolate({
            inputRange: [index - 0.7, index, index + 0.7],
            outputRange: [0.3, 1, 0.3]
        });
    
        return {
            opacity,
            transform: [{ translateX }, { translateY }]
        };
    }
};

export default (transitionType) => ({
        //transitionSpec: transitionSpecTransitions.default,
        screenInterpolator: (sceneProps) => {
            const params = sceneProps.scene.route.params || {}; 
            const transition = transitionType || params.transition || 'default';

            return {
                default: {},
                TransitionFade: screenInterpolatorTransitions.TransitionFade(sceneProps)
            }[transition];
        }
    }
);
