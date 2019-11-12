/* eslint-disable max-len */
import Animated, { Easing } from 'react-native-reanimated';

const {
  Value,
  Clock,
  cond,
  call,
  set,
  and,
  block,
  clockRunning,
  startClock,
  spring,
  timing,
  stopClock,
  SpringUtils
} = Animated;

export const runTiming = (value, dest, duration = 200, easing = Easing.inOut(Easing.ease), clockN, callBackFinish) => {
    if (!value) return;

    const clock = clockN || new Clock();
    const funcCallBack = callBackFinish || (() => {});

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
        cond(
            and(state.finished, clockRunning(clock)), 
            [
                set(state.finished, 0),
                stopClock(clock),  
                call([value], funcCallBack)
            ]
        ),
        state.position
    ]);
};

export const runSpring = (value, dest, speed = 12, blockFinish = [], clockN) => {
    if (!value) return;

    const clock = clockN || new Clock();
    
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
        cond(
            and(state.finished, clockRunning(clock)), 
            [
                set(state.finished, 0),
                stopClock(clock),  
                blockFinish
            ]
        ),
        state.position
    ]);
};

export const runTimingDefault = (value, dest, duration = 200, blockFinish = [], easing = Easing.inOut(Easing.ease)) => {
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
            set(config.toValue, dest),
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
        cond(state.finished, [stopClock(clock), blockFinish]),
        state.position
    ]);
};

export const runSpringDefault = (value, dest, speed = 12, blockFinish = []) => {
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
        speed,
        toValue: new Value(0)
    });

    return block([
        cond(
            clockRunning(clock), 
            set(config.toValue, dest),
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
        cond(state.finished, [stopClock(clock), blockFinish]),
        state.position
    ]);
};
