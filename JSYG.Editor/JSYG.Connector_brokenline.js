import JSYG from "../JSYG-wrapper/JSYG-wrapper.js";
import StdConstruct from "../JSYG.StdConstruct/JSYG.StdConstruct.js";

import { BoundingBox } from "../JSYG.BoundingBox/JSYG.BoundingBox.js";

import { Alignment } from "../JSYG.Alignment/JSYG.Alignment.js";
import { Container } from "../JSYG.Container/JSYG.Container.js";
import { Selection } from "../JSYG.Selection/JSYG.Selection.js";
import { Draggable } from "../JSYG.Draggable/JSYG.Draggable.js";
import { Resizable } from "../JSYG.Resizable/JSYG.Resizable.js";
import { Rotatable } from "../JSYG.Rotatable/JSYG.Rotatable.js";

import { Path } from "../JSYG.Path/JSYG.Path.js";
import { ShapeInfo, Intersection, Point2D, Matrix2D } from "kld-intersections";
//import { shape, intersect } from "svg-intersections";

function guid() {
    const timestamp = new Date().getTime().toString().substr(5, 20);
    const randomString = Math.random().toString(36).substr(2, 7); // ランダムな文字列
    return timestamp + "-" + randomString;
}

//JSYG.Connector_brokenline.js
export class ConnectorBL extends StdConstruct {
    constructor(editor, svg) {
        super();
        this.editor = editor;
        this.svg = svg;
	    console.log("create ConnectorBL");
    }

    connectCreate(from, to) {
        this.node1 = from;
        this.node2 = to;
        console.log("connector init: ", from.tagName, to.tagName);

        const svgNamespace = "http://www.w3.org/2000/svg";
        this.line = document.createElementNS(svgNamespace, "line");
        this.updateConnection("create");

        this.line.setAttributeNS(null, "stroke", "black");
        this.line.setAttributeNS(null, "strok-width", "3");

        this.svg.appendChild(this.line);
        //const id1= guid();
        //const id2= guid();

        let id1, id2;
        id1 = this.node1.getAttributeNS(null, "cid");
        if (!id1) id1 = guid();
        id2 = this.node2.getAttributeNS(null, "cid");
        if (!id2) id2 = guid();

        this.node1.setAttributeNS(null, "cid", id1);
        this.node2.setAttributeNS(null, "cid", id2);
        this.line.setAttributeNS(null, "from-id", id1);
        this.line.setAttributeNS(null, "to-id", id2);
    }

    connectLoadset(line, from, to) {
        console.log("connector loadset : ", line.tagName, from.tagName, to.tagName);
        this.line = line;
        this.node1 = from;
        this.node2 = to;
        //let fid = this.line.setAttributeNS(null, 'from-id', );
        //let tid = this.line.setAttributeNS(null, 'to-id', );
        //console.log("connector load: ", fid, tid );

        this.updateConnection("load");
    }
    getLine() {
        return this.line;
    }

    updateConnection(source) {
        console.log("updateConnection", source);

        let n1 = this.get_center_point(this.node1);
        let n2 = this.get_center_point(this.node2);
        const line = ShapeInfo.line(n1[1], n2[1]);

        var isc1 = Intersection.intersect(n1[0], line);
        var isc2 = Intersection.intersect(n2[0], line);
        this.line.setAttributeNS(null, "x1", isc1.points[0].x);
        this.line.setAttributeNS(null, "y1", isc1.points[0].y);
        this.line.setAttributeNS(null, "x2", isc2.points[0].x);
        this.line.setAttributeNS(null, "y2", isc2.points[0].y);
    }

    //updateConnection_routate(source) {
    updateConnection_(source) {
        console.log("updateConnection", source);

        let n1 = this.get_center_point(this.node1);
        let n2 = this.get_center_point(this.node2);
        const line = ShapeInfo.line(n1[1], n2[1]);
        var isc1 = Intersection.intersect(n1[0], line);
        var isc2 = Intersection.intersect(n2[0], line);

        if (n1[2] != 0) {
            if (this.node1.tagName == "rect") {
                if (source == "dragging") {
                    this.node1.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    return;
                }
                isc1 = this.rotate_intersect_rect(n1[1], n2[1], this.node1, n1[2], n1[3], n1[4]);
                //console.log(n1[2], "status", isc1.status)
            }
            if (this.node1.tagName == "ellipse") {
                if (source == "dragging") {
                    this.node1.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    return;
                }
                isc1 = this.rotate_intersect_ellipse(n1[1], n2[1], this.node1, n1[2], n1[3]);
                //console.log(n1[2], "status", isc1.status)
            }
            if (this.node1.tagName == "polygon") {
                if (source == "dragging") {
                    this.node1.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    return;
                }
                isc1 = this.rotate_intersect_polygon(n1[1], n2[1], this.node1, n1[2], n1[3]);
                //console.log(n1[2], "status", isc1.status)
            }
        }

        if (n2[2] != 0) {
            if (this.node2.tagName == "rect") {
                if (source == "dragging") {
                    this.node2.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    return;
                }
                isc2 = this.rotate_intersect_rect(n1[1], n2[1], this.node2, n2[2], n2[3]);
                //console.log(n1[2], "status", isc2.status)
            }
            if (this.node2.tagName == "ellipse") {
                if (source == "dragging") {
                    this.node2.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    return;
                }
                isc2 = this.rotate_intersect_ellipse(n1[1], n2[1], this.node2, n2[2], n2[3]);
                //console.log(n1[2], "status", isc2.status)
            }
        }

        //console.log("isc1", isc1.points.length)
        //console.log("isc2", isc2.points.length)
        //console.log(n2[2])

        this.line.setAttributeNS(null, "x1", isc1.points[0].x);
        this.line.setAttributeNS(null, "y1", isc1.points[0].y);
        this.line.setAttributeNS(null, "x2", isc2.points[0].x);
        this.line.setAttributeNS(null, "y2", isc2.points[0].y);
    }

    rotate_intersect_rect(line_point1, line_point2, rect_, r, angle_, mtx) {
        const line = {
            p1: new Point2D(parseFloat(line_point1[0]), parseFloat(line_point1[1])),
            p2: new Point2D(parseFloat(line_point2[0]), parseFloat(line_point2[1])),
        };

        let rect_x = parseFloat(rect_.getAttributeNS(null, "x"));
        let rect_y = parseFloat(rect_.getAttributeNS(null, "y"));
        let rect_width = parseFloat(rect_.getAttributeNS(null, "width"));
        let rect_height = parseFloat(rect_.getAttributeNS(null, "height"));

        //console.log("rect", rect_x, rect_y, rect_width, rect_height);

        const rect = {
            topLeft: new Point2D(rect_x, rect_y),
            bottomRight: new Point2D(rect_x + rect_width, rect_y + rect_height),
        };

        // convert rectangle corners to polygon (list of points)
        const poly = [rect.topLeft, new Point2D(rect.bottomRight.x, rect.topLeft.y), rect.bottomRight, new Point2D(rect.topLeft.x, rect.bottomRight.y)];

        // find center point of rectangle
        const center = rect.topLeft.lerp(rect.bottomRight, 0.5);
        //const center =  new Point2D(rect_x + rect_width/2,  rect_y + rect_height/2)

        // define rotation in radians
        //const angle = r * Math.PI / 180.0;

        // create matrix for rotating around center of rectangle
        const rotation = Matrix2D.rotationAt(angle_, center);

        // create new rotated polygon
        const rotatedPoly = poly.map((p) => p.transform(rotation));

        // find intersections
        const result = Intersection.intersectLinePolygon(line.p1, line.p2, rotatedPoly);

        return result;
    }

    rotate_intersect_polygon(line_point1, line_point2, polygon_, r, angle_, mtx) {
        console.log("rotate_intersect_polygon");

        const line = {
            p1: new Point2D(parseFloat(line_point1[0]), parseFloat(line_point1[1])),
            p2: new Point2D(parseFloat(line_point2[0]), parseFloat(line_point2[1])),
        };

        let points_str = polygon_.getAttributeNS(null, "points");

        var list = points_str.split(" ");
        let points_array = [];
        for (let i = 0; i < list.length; i = i + 2) {
            let point = [parseFloat(list[i]), parseFloat(list[i + 1])];
            points_array.push(point);
        }

        let poly = [];
        for (let i = 0; i < points_array.length; i++) {
            let p = new Point2D(points_array[i][0], points_array[i][1]);
            poly.push(p);
        }

        //const center = rect.topLeft.lerp(rect.bottomRight, 0.5);
        //const center =  new Point2D(rect_x + rect_width/2,  rect_y + rect_height/2)

        // define rotation in radians
        //const angle = r * Math.PI / 180.0;

        // create matrix for rotating around center of rectangle
        let b = polygon_.getBBox();
        let center = new Point2D(b.x + b.width / 2, b.y + b.height / 2);
        //let center = new Point2D(b.x , b.y );

        const rotation = Matrix2D.rotationAt(angle_, center);

        // create new rotated polygon
        const rotatedPoly = poly.map((p) => p.transform(rotation));

        // find intersections
        const result = Intersection.intersectLinePolygon(line.p1, line.p2, rotatedPoly);

        return result;
    }

    rotate_intersect_ellipse(line_point1, line_point2, ellipse_, r, angle_) {
        const line = {
            p1: new Point2D(parseFloat(line_point1[0]), parseFloat(line_point1[1])),
            p2: new Point2D(parseFloat(line_point2[0]), parseFloat(line_point2[1])),
        };

        let cx = parseFloat(ellipse_.getAttributeNS(null, "cx"));
        let cy = parseFloat(ellipse_.getAttributeNS(null, "cy"));
        let rx = parseFloat(ellipse_.getAttributeNS(null, "rx"));
        let ry = parseFloat(ellipse_.getAttributeNS(null, "ry"));

        const ellipse = {
            center: new Point2D(cx, cy),
            //center: new Point2D(line_point1[0], line_point1[1]),
            radiusX: rx,
            radiusY: ry,
            angle: angle_,
        };

        // rotate the line into the ellipse's axis-aligned coordinate system
        const radians = (ellipse.angle * Math.PI) / 180.0;
        //const radians = ellipse.angle * 180.0 / Math.PI;

        const rotation = Matrix2D.rotation(-radians);
        //const rotation = Matrix2D.rotation(-r*10);
        //const rotation = Matrix2D.rotationAt(ellipse.angle, ellipse.center);

        const rotatedLine = {
            p1: line.p1.transform(rotation),
            p2: line.p2.transform(rotation),
        };

        // find intersections
        const result = Intersection.intersectEllipseLine(ellipse.center, ellipse.radiusX, ellipse.radiusY, rotatedLine.p1, rotatedLine.p2);

        return result;
    }

    get_center_point(node) {
        if (node.tagName == "rect") {
            var x = parseFloat(node.getAttributeNS(null, "x"));
            var y = parseFloat(node.getAttributeNS(null, "y"));
            var w = parseFloat(node.getAttributeNS(null, "width"));
            var h = parseFloat(node.getAttributeNS(null, "height"));
            var t = node.getAttributeNS(null, "transform");
            var r = 0;
            var angle = 0;
            if (t) {
                var tv = t.slice(7).slice(0, -1).split(" ");
                r = (Math.atan2(tv[1], tv[0]) * 180) / Math.PI;
                angle = Math.atan2(tv[1], tv[0]);
            }
            var cx = x + w / 2;
            var cy = y + h / 2;

            const rect = ShapeInfo.rectangle([x, y], [w, h]);
            //return [rect, [cx, cy], r, angle, mtx]
            return [rect, [cx, cy], r, angle];
        } else if (node.tagName == "circle") {
            var cx = parseFloat(node.getAttributeNS(null, "cx"));
            var cy = parseFloat(node.getAttributeNS(null, "cy"));
            var r = parseFloat(node.getAttributeNS(null, "r"));
            var t = node.getAttributeNS(null, "transform");
            const circle = ShapeInfo.circle(cx, cy, r);
            return [circle, [cx, cy], 0, 0];
        } else if (node.tagName == "ellipse") {
            var cx = parseFloat(node.getAttributeNS(null, "cx"));
            var cy = parseFloat(node.getAttributeNS(null, "cy"));
            var rx = parseFloat(node.getAttributeNS(null, "rx"));
            var ry = parseFloat(node.getAttributeNS(null, "ry"));
            var t = node.getAttributeNS(null, "transform");
            var r = 0;
            var angle = 0;
            if (t) {
                var tv = t.slice(7).slice(0, -1).split(" ");
                r = Math.atan2(parseFloat(tv[1]), parseFloat(tv[0])) * (180 / Math.PI);
                //angle = Math.atan2(parseFloat(tv[1]), parseFloat(tv[0]))
                //angle = Math.round(Math.asin(parseFloat(tv[1])) * (180/Math.PI));
                angle = Math.atan2(tv[1], tv[0]);
            }

            const ellipse = ShapeInfo.ellipse([cx, cy], rx, ry);
            return [ellipse, [cx, cy], r, angle];
        } else if (node.tagName == "polygon") {
            var points_str = node.getAttributeNS(null, "points");
            var t = node.getAttributeNS(null, "transform");
            var list = points_str.split(" ");
            let points_array = [];
            for (let i = 0; i < list.length; i = i + 2) {
                let point = [parseFloat(list[i]), parseFloat(list[i + 1])];
                points_array.push(point);
            }
            let center = this.polygon_center(points_array);
            var t = node.getAttributeNS(null, "transform");
            var r = 0;
            var angle = 0;
            if (t) {
                var tv = t.slice(7).slice(0, -1).split(" ");
                r = (Math.atan2(tv[1], tv[0]) * 180) / Math.PI;
                angle = Math.atan2(tv[1], tv[0]);
            }
            console.log("polygon", r);

            const polygon = ShapeInfo.polygon(points_array);
            return [polygon, center, r, angle];
        } else {
            throw ("connection node type", node.tagName);
        }
    }
}
