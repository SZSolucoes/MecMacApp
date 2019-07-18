export const interpolate = (value, s1, s2, t1, t2, slope) => {
    const slopeA = slope || 0.5;

    const b1 = (t) => (t * t);
    const b2 = (t) => 2 * t * (1 - t);
    const b3 = (t) => (1 - t) * (1 - t);

    if (value < Math.min(s1, s2)) {
        return Math.min(s1, s2) === s1 ? t1 : t2;
    }

    if (value > Math.max(s1, s2)) {
        return Math.max(s1, s2) === s1 ? t1 : t2;
    }

    const valueA = s2 - value;

    const C1 = { x: s1, y: t1 };
    const C3 = { x: s2, y: t2 }; 
    const C2 = {
        x: C3.x,
        y: C1.y + (Math.abs(slopeA) * (C3.y - C1.y))
    };

    //Find out how far the value is on the curve
    const percent = valueA / (C3.x - C1.x);

    return (C1.y * b1(percent)) + (C2.y * b2(percent)) + (C3.y * b3(percent));
};
