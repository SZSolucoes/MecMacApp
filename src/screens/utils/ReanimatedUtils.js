import Animated, { Easing } from 'react-native-reanimated';

const {
  Value,
  Clock,
  cond,
  set,
  block,
  clockRunning,
  startClock,
  spring,
  timing,
  stopClock,
  SpringUtils
} = Animated;

export const runTiming = (value, dest, duration = 200, easing = Easing.inOut(Easing.ease)) => {
    if (!value) return;

    const clock = new Clock();
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    };
  
    const config = {
        duration,
        toValue: new Value(0),
        easing
    };
  
    return block([
        cond(
            clockRunning(clock), 
                set(value, state.position), 
            [
                set(state.finished, 0),
                set(state.time, 0),
                set(state.position, value),
                set(state.frameTime, 0),
                set(config.toValue, dest),
                startClock(clock)
            ]
        ),
        timing(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position
    ]);
};

export const runSpring = (value, dest, speed = 12) => {
    if (!value) return;
    
    const clock = new Clock();
    const state = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0),
    };
  
    const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
        ...SpringUtils.makeDefaultConfig(),
        bounciness: 0,
        speed
    });

    return block([
        cond(
            clockRunning(clock), 
                set(value, state.position), 
            [
                set(state.finished, 0),
                set(state.time, 0),
                set(state.position, value),
                set(state.velocity, 0),
                set(config.toValue, dest),
                startClock(clock),
            ]
        ),
        spring(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position
    ]);
};
