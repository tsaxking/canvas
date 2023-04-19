type Size = {
    width: number;
    height: number;
}

type DrawFunction = (canvas: Canvas) => void;

type CanvasOptions = {
    size: Size;
}
