"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Container {
    constructor() {
        this.elements = [];
    }
    addElement(element) {
        this.elements.push(element);
    }
    removeElement(element) {
        const index = this.elements.indexOf(element);
        if (index > -1)
            this.elements.splice(index, 1);
    }
    draw(canvas) {
        this.sort();
        this.elements.forEach((e, i) => {
            if (e instanceof CanvasImage && !e.image && !canvas.animating && i !== this.elements.length - 1) {
                console.warn('Image has not loaded, and animation is not running. This may cause the image to render over other elements');
            }
            canvas.context.save();
            e.draw(canvas);
            canvas.context.restore();
        });
    }
    sort() {
        // sort elements by z-index
        this.elements.sort((a, b) => {
            const aPos = a.position;
            const bPos = b.position;
            return aPos.z - bPos.z;
        });
    }
}
class Canvas extends Container {
    constructor(canvas, options) {
        super();
        this.animating = false;
        this.frames = 0;
        this.fps = 0;
        this.startDate = 0;
        this.canvas = canvas;
        this.size = options.size;
        this.context = canvas.getContext('2d') || new CanvasRenderingContext2D();
    }
    get size() {
        return { width: this.canvas.width, height: this.canvas.height };
    }
    set size(value) {
        this.canvas.width = value.width;
        this.canvas.height = value.height;
    }
    animate() {
        requestAnimationFrame(() => {
            this.draw(this);
            this.frames++;
            this.fps = Math.round(this.frames / ((Date.now() - this.startDate) / 1000));
            if (this.animating)
                this.animate();
        });
    }
    start() {
        this.startDate = Date.now();
        this.animating = true;
        this.animate();
    }
    stop() {
        this.animating = false;
    }
}
var _CanvasElement_position, _CanvasElement_visible;
class CanvasElement {
    constructor(position) {
        _CanvasElement_position.set(this, { x: 0, y: 0, z: 0 });
        _CanvasElement_visible.set(this, void 0);
        this.position = position;
        __classPrivateFieldSet(this, _CanvasElement_visible, true, "f");
    }
    get position() {
        return __classPrivateFieldGet(this, _CanvasElement_position, "f");
    }
    set position(value) {
        value = new ThreeDPoint(value);
        __classPrivateFieldSet(this, _CanvasElement_position, value, "f");
    }
    get visible() {
        return __classPrivateFieldGet(this, _CanvasElement_visible, "f");
    }
    set visible(value) {
        if (value)
            this.show();
        else
            this.hide();
    }
    hide() {
        __classPrivateFieldSet(this, _CanvasElement_visible, false, "f");
    }
    show() {
        __classPrivateFieldSet(this, _CanvasElement_visible, true, "f");
    }
    draw(canvas) {
        // draw this element
    }
    moveTo(point) {
        this.position = point;
    }
}
_CanvasElement_position = new WeakMap(), _CanvasElement_visible = new WeakMap();
class Circle extends CanvasElement {
    constructor(position, radius) {
        super(position);
        this.radius = radius;
    }
    draw(canvas) {
        // draw this element
        canvas.context.beginPath();
        canvas.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        canvas.context.stroke();
    }
    isIn(point) {
        const dist = Math.sqrt((point.x - this.position.x) ** 2 + (point.y - this.position.y) ** 2);
        return dist <= this.radius;
    }
    isOut(point) {
        return !this.isIn(point);
    }
}
class CanvasImage extends CanvasElement {
    constructor(src, position) {
        super(position);
        this.src = src;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                const image = new Image();
                image.src = this.src;
                image.onload = () => res(image);
                image.onerror = () => rej();
            }));
        });
    }
    draw(canvas) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.image)
                this.image = yield this.load();
            const pos = this.position;
            canvas.context.drawImage(this.image, pos.x, pos.y);
        });
    }
}
var _Polygon_points;
class Polygon extends CanvasElement {
    constructor(position, points) {
        super(position);
        _Polygon_points.set(this, []);
        this.points = points;
    }
    get points() {
        return __classPrivateFieldGet(this, _Polygon_points, "f");
    }
    set points(value) {
        if (!Array.isArray(value))
            throw new Error('Points must be an array of XYPoints.');
        value = value.map(p => new TwoDPoint(p));
        __classPrivateFieldSet(this, _Polygon_points, value, "f");
    }
    draw(canvas) {
        // draw this element
        const point1 = this.points[0];
        canvas.context.beginPath();
        canvas.context.moveTo(point1.x, point1.y);
        this.points.forEach((p, i) => {
            if (!i)
                return;
            canvas.context.lineTo(p.x, p.y);
        });
        canvas.context.lineTo(point1.x, point1.y);
        canvas.context.closePath();
        canvas.context.stroke();
    }
    isIn(point) {
        // test if point is inside the box using ray casting
        let inside = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const x1 = this.points[i].x;
            const y1 = this.points[i].y;
            const x2 = this.points[j].x;
            const y2 = this.points[j].y;
            const intersect = ((y1 > point.y) != (y2 > point.y)) && (point.x < (x2 - x1) * (point.y - y1) / (y2 - y1) + x1);
            if (intersect)
                inside = !inside;
        }
        // inside && !this.entered && this.onEnter();
        // !inside && this.entered && this.onExit();
        // this.entered = inside;
        return inside;
    }
    isOut(point) {
        return !this.isIn(point);
    }
}
_Polygon_points = new WeakMap();
class Rectangle extends CanvasElement {
    constructor(position, size) {
        super(position);
        this.size = size;
    }
    draw(canvas) {
        // draw this element
        canvas.context.beginPath();
        canvas.context.rect(this.position.x, this.position.y, this.size.width, this.size.height);
        canvas.context.stroke();
    }
    isIn(point) {
        const x = this.position.x;
        const y = this.position.y;
        const w = this.size.width;
        const h = this.size.height;
        return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
    }
    isOut(point) {
        return !this.isIn(point);
    }
}
class Square extends Rectangle {
    constructor(position, height) {
        super(position, { width: height, height: height });
    }
}
class SubCanvas {
    constructor(element, container) {
        this.element = element;
        this.container = container;
    }
    get position() {
        return this.element.position;
    }
    set position(value) {
        this.element.position = value;
        this.container.elements.forEach(e => {
            e.position = {
                x: this.position.x + e.position.x,
                y: this.position.y + e.position.y,
                z: this.position.z + e.position.z
            };
        });
    }
    moveTo(point) {
        this.position = point;
    }
    get visible() {
        return this.element.visible;
    }
    set visible(value) {
        this.element.visible = value;
    }
    hide() {
        this.element.hide();
        this.container.elements.forEach(e => {
            e.hide();
        });
    }
    show() {
        this.element.show();
        this.container.elements.forEach(e => {
            e.show();
        });
    }
    draw(canvas) {
        this.element.draw(canvas);
        this.container.draw(canvas);
    }
    addElement(element) {
        element.position = {
            x: this.position.x + element.position.x,
            y: this.position.y + element.position.y,
            z: this.position.z + element.position.z
        };
        this.container.addElement(element);
    }
    removeElement(element) {
        this.container.removeElement(element);
        element.position = {
            x: element.position.x - this.position.x,
            y: element.position.y - this.position.y,
            z: element.position.z - this.position.z
        };
    }
}
class TwoDPoint {
    constructor(point) {
        if (point.x < 0)
            point.x = 0;
        if (point.x > 1)
            point.x = 1;
        if (point.y < 0)
            point.y = 0;
        if (point.y > 1)
            point.y = 1;
        this.x = point.x;
        this.y = point.y;
    }
}
class ThreeDPoint {
    constructor(point) {
        if (point.x < 0)
            point.x = 0;
        if (point.x > 1)
            point.x = 1;
        if (point.y < 0)
            point.y = 0;
        if (point.y > 1)
            point.y = 1;
        if (point.z === undefined)
            point.z = 0;
        this.x = point.x;
        this.y = point.y;
        this.z = point.z;
    }
}
