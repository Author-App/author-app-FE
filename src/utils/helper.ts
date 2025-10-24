export const roundPercentage = (value: number): number => {
    return Math.round(value);
};

export const percentageToDecimal = (percentage: number): number => {
    if (isNaN(percentage)) return 0;
    const value = percentage / 100;
    return Math.min(Math.max(value, 0), 1); // clamps between 0 and 1
};