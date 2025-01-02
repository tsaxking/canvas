export const copy = (from: any, to: any) => {
    Object.assign(to, JSON.parse(JSON.stringify(from)));
    return to;
};
