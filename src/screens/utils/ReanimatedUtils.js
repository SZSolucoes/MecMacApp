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
  stopClock
} = Animated;

export const runTiming = (value, dest) => {
    const clock = new Clock();
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    };
  
    const config = {
        duration: 5000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease),
    };
  
    return block([
        cond(clockRunning(clock), [
            set(config.toValue, dest),
        ], [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        timing(clock, state, config),
        cond(state.finished, stopClock(clock)),
        state.position,
    ]);
};

export const runSpring = (value, dest) => {
    const clock = new Clock();
    const state = {
        finished: new Value(0),
        velocity: new Value(0),
        position: new Value(0),
        time: new Value(0),
    };
  
    const config = {
        toValue: new Value(0),
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
    };
  
    return block([
      cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.velocity, 0),
            set(config.toValue, dest),
            startClock(clock),
      ]),
      spring(clock, state, config),
      cond(state.finished, stopClock(clock)),
      set(value, state.position),
    ]);
};
