class Square extends Rectangle {
    constructor(position: XYZPoint, height: number) {
        super(position, {width: height, height: height});
    }
}