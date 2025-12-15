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

export class ConnectorPATH_VV extends StdConstruct {
    constructor(editor, svg) {
        super();
        this.editor = editor;
        this.svg = svg;
			this.rotate_recover = false;
	    console.log("ConnectorBL");
    }

    connectCreate(from, to) {
        this.node1 = from;
        this.node2 = to;
        //this.path_type = "right_angle_path";
        //this.path_type = "direct_path";
        let sel = document.querySelector("#connector-path-type");
        this.path_type = sel.value;


        console.log("connector init: ", from.tagName, to.tagName);

        const svgNamespace = "http://www.w3.org/2000/svg";
        this.path = document.createElementNS(svgNamespace, "path");
        this.updateConnection("create");

        this.path.setAttributeNS(null, "stroke", "black");
        this.path.setAttributeNS(null, "strok-width", "3");
        this.path.setAttributeNS(null, "fill", "transparent");

        this.svg.appendChild(this.path);
        //const id1= guid();
        //const id2= guid();

        let id1, id2;
        id1 = this.node1.getAttributeNS(null, "cid");
        if (!id1) id1 = guid();
        id2 = this.node2.getAttributeNS(null, "cid");
        if (!id2) id2 = guid();

        this.node1.setAttributeNS(null, "cid", id1);
        this.node2.setAttributeNS(null, "cid", id2);
        this.path.setAttributeNS(null, "from-id", id1);
        this.path.setAttributeNS(null, "to-id", id2);
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

    updateConnection_not_(source) {
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

    path_build( x1, y1, x2, y2, over) {
       if (this.path_type        == "direct_path") {
           return this.direct_path( x1, y1, x2, y2) 
       } else if (this.path_type == "right_angle_path") {
           return this.right_angle_path( x1, y1, x2, y2)
       } else if (this.path_type == "curve_path") {
           return this.curve_path( x1, y1, x2, y2)
       } else {
           return this.direct_path( x1, y1, x2, y2) 
       }
    }

    path_over_build( x1, y1, x2, y2, over) {
       if (this.path_type        == "direct_path") {
           return this.over_direct_path( x1, y1, x2, y2) 
       } else if (this.path_type == "right_angle_path") {
           return this.over_right_angle_path( x1, y1, x2, y2)
       } else if (this.path_type == "curve_path") {
           return this.over_curve_path( x1, y1, x2, y2)
       } else {
           return this.direct_path( x1, y1, x2, y2) 
       }
    }


    direct_path_( x1, y1, x2, y2) {
        let ds = "M" + " " +
		  x1 + " " +
		  y1 + " " +
		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
	 return ds;
    }

    direct_path( x1, y1, x2, y2) {
        let xd = x1  + (x2 - x1)/2
        let xd1 =  xd - 20
        let xd2 =  xd + 20
        let yd = y1  + 20
	let e1 = y1 + 10;
	let e2 = y2 - 10;
	let e1_ = y1 - 10;
	let e2_ = y2 + 10;

        let ds1 = "M" + " " +
		  x1 + " " +
		  y1 + " " +

		 "L" + " " +    // YD
		  x1 + " " +
		  e1  + " " +

		 "L" + " " +    // YD
		  x2 + " " +
		  e2 + " " +

		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;

        let ds2 = "M" + " " +
		  x1 + " " +
		  y1 + " " +

		 "L" + " " +    // YD
		  x1 + " " +
		  e1_  + " " +

		 "L" + " " +    // YD
		  x2 + " " +
		  e2_ + " " +

		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
         if (y1 < y2) {
	     return ds1;
	 } else {
	    return ds2;
	 }
	 
    }

    over_direct_path( x1, y1, x2, y2) {
        let xd = x1  + (x2 - x1)/2
        let xd1 =  xd - 20
        let xd2 =  xd + 20
        let yd = y1  + 20
	let e1 = y1 + 10;
	let e2 = y2 - 10;

        let ds1 = "M" + " " +
		  x1 + " " +
		  y1 + " " +
		 "L" + " " +    // YD
		  x1 + " " +
		  e1  + " " +
		 "L" + " " +    // XD1
		  xd1 + " " +
		  e1 + " " +
		 "L" + " " +    // XD2
		  xd2 + " " +
		  e2 + " " +
		 "L" + " " +    // YD
		  x2 + " " +
		  e2 + " " +
		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;

        let ds2 = "M" + " " +
		  x1 + " " +
		  y1 + " " +
		 "L" + " " +    // YD
		  x1 + " " +
		  e1  + " " +
		 "L" + " " +    // XD2
		  xd2 + " " +
		  e1 + " " +
		 "L" + " " +    // XD1
		  xd1 + " " +
		  e2 + " " +
		 "L" + " " +    // YD
		  x2 + " " +
		  e2 + " " +
		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
         if (x1 < x2) {
	     return ds1;
	 } else {
	    return ds2;
	 }
    }
    right_angle_path( x1, y1, x2, y2) {
        let yd = y1 + (y2 - y1)/2
        let ds = "M" + " " +
		  x1 + " " +
		  y1 + " " +
		 "L" + " " +    // YD
		  x1 + " " +
		  yd + " " +
		 "L" + " " +    // YD
		  x2 + " " +
		  yd + " " +
		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
	 return ds;
    }
    over_right_angle_path( x1, y1, x2, y2) {
        let xd = x1  + (x2 - x1)/2
        let yd = y1  + (y2 - y1)/2
	let e1 = y1 + 10;
	let e2 = y2 - 10;
        let ds = "M" + " " +
		  x1 + " " +
		  y1 + " " +
		 "L" + " " +    // YD
		  x1 + " " +
		  e1  + " " +
		 "L" + " " +    // XD
		  xd + " " +
		  e1 + " " +
		 "L" + " " +    // XD
		  xd + " " +
		  e2 + " " +
		 "L" + " " +    // YD
		  x2 + " " +
		  e2 + " " +
		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
	 return ds;
    }
    curve_path( x1, y1, x2, y2) {
        let yd = y1 + (y2 - y1)/2
        let ds = "M" + " " +
		  x1 + " " +
		  y1 + " " +
		 "C" + " " +    // YD
		  x1 + " " +
		  yd + " " +
		 "," + " " +    // YD
		  x2 + " " +
		  yd + " " +
		 "," + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
	 return ds;
    }

    over_curve_path( x1, y1, x2, y2) {
        let xd = x1  + (x2 - x1)/2
        let yd = y1  + (y2 - y1)/2
        let xd1 =  xd - 20
        let xd2 =  xd + 20
	let e1 = y1 + 40;
	let e2 = y2 - 40;
        let x1_ = x1 + 20;
        let x2_ = x2 - 20;
        let x1_2 = x1 - 20;
        let x2_2 = x2 + 20;

        let ds1 = "M" + " " +
		  x1 + " " +
		  y1 + " " +

		 //"L" + " " +    // YD
		 "C" + " " +    // YD
		  //x1 + " " +
		  x1_ + " " +
		  e1  + " " +

		 "," + " " +    // XD1
		  xd1 + " " +
		  e1 + " " +

		 "," + " " +    // XD2
		  xd + " " +
		  yd + " " +

		 "C" + " " +    // XD2
		  xd2 + " " +
		  e2 + " " +
		  

		 "," + " " +    // YD
		  x2_ + " " +
		  e2 + " " +

		    
		 "," + " " +
		  x2 + " " +
		  y2 + " " +
		  
		 " ";

        let ds2 = "M" + " " +
		  x1 + " " +
		  y1 + " " +

		 "C" + " " +    // YD
		  x1_2 + " " +
		  e1  + " " +

		 "," + " " +    // XD1
		  xd2 + " " +
		  e1 + " " +

		 "," + " " +    // XD2
		  xd + " " +
		  yd + " " +

		 "C" + " " +    // XD2
		  xd1 + " " +
		  e2 + " " +
		  

		 "," + " " +    // YD
		  x2_2 + " " +
		  e2 + " " +

		    
		 "," + " " +
		  x2 + " " +
		  y2 + " " +
		  
		 " ";
         if (x1 < x2) {
	    return ds1;
	 } else {
	    return ds2;
	 }
    }
    over_curve_path_( x1, y1, x2, y2) {
        let xd = x1  + (x2 - x1)/2
        let xd1 =  xd - 20
        let xd2 =  xd + 20
        let yd = y1  + 20
	let e1 = y1 + 20;
	let e2 = y2 - 20;

        let ds1 = "M" + " " +
		  x1 + " " +
		  y1 + " " +

		 "L" + " " +    // YD
		  x1 + " " +
		  e1  + " " +

		 "C" + " " +    // XD1
		  xd1 + " " +
		  e1 + " " +

		 "," + " " +    // XD2
		  xd2 + " " +
		  e2 + " " +

		 "," + " " +    // YD
		  x2 + " " +
		  e2 + " " +

		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;

        let ds2 = "M" + " " +
		  x1 + " " +
		  y1 + " " +

		 "L" + " " +    // YD
		  x1 + " " +
		  e1  + " " +

		 "C" + " " +    // XD2
		  xd2 + " " +
		  e1 + " " +

		 "," + " " +    // XD1
		  xd1 + " " +
		  e2 + " " +

		 "," + " " +    // YD
		  x2 + " " +
		  e2 + " " +

		 "L" + " " +
		  x2 + " " +
		  y2 + " " 
		 ;
         if (x1 < x2) {
	     return ds1;
	 } else {
	    return ds2;
	 }
    }

    updateConnection(source) {
	    /*
	     *
	     *                   |
	     *           A       |     B
	     *                   |
	     *     --------------+--------------
	     *                   |
	     *           C       |     D
	     *                   |
	     *
	     */
        let n1 = this.get_connect_point(this.node1);
        let n2 = this.get_connect_point(this.node2);
         if (n1[0][0] <  n2[0][0] ) {    //x
             if (n1[0][1] <  n2[0][1] ) {    //y
		     // n1
		     //      n2
		     console.log( "A->D")  //*******
		     let over = false;
		     if ( n1[1][2][1] > n2[1][0][1] ) {
                            console.log("over A->D")
			    over = true;
			     
                            let x1 = n1[1][2][0]
                            let y1 = n1[1][2][1]
                            let x2 = n2[1][0][0]
                            let y2 = n2[1][0][1]
		            let ds = this.path_over_build( x1, y1, x2, y2)
                            this.path.setAttributeNS(null, "d", ds);
			    return
			    
		     }

                     let x1 = n1[1][2][0]
                     let y1 = n1[1][2][1]
                     let x2 = n2[1][0][0]
                     let y2 = n2[1][0][1]
		     let ds = this.path_build( x1, y1, x2, y2, over)
                     this.path.setAttributeNS(null, "d", ds);
             } else {
		     //      n2
		     // n1
		     console.log( "C->B")
		     let over = false;
		     if ( n1[1][0][1] < n2[1][2][1] ) {
                            console.log("over C->B")
			    over = true;
			     
                            let x1 = n1[1][2][0]
                            let y1 = n1[1][2][1]
                            let x2 = n2[1][0][0]
                            let y2 = n2[1][0][1]
		            let ds = this.path_over_build( x1, y1, x2, y2)
                            this.path.setAttributeNS(null, "d", ds);
			    return
			    
		     }
		     
                     let x1 = n1[1][0][0]
                     let y1 = n1[1][0][1]
                     let x2 = n2[1][2][0]
                     let y2 = n2[1][2][1]
		     
		     let ds = this.path_build( x1, y1, x2, y2, over)
                     this.path.setAttributeNS(null, "d", ds);
	     }
	 } else {
             if (n1[0][1] <  n2[0][1] ) {
		     //      n1
		     // n2
		     console.log( "B->C")   //******
		     let over = false;
		     if ( n1[1][2][1] > n2[1][0][1] ) {
                            console.log("over B->C")
			    over = true;
			     
                            let x1 = n1[1][2][0]
                            let y1 = n1[1][2][1]
                            let x2 = n2[1][0][0]
                            let y2 = n2[1][0][1]
		            let ds = this.path_over_build( x1, y1, x2, y2)
                            this.path.setAttributeNS(null, "d", ds);
			    return
			    
		     }

                     let x1 = n1[1][2][0]
                     let y1 = n1[1][2][1]
                     let x2 = n2[1][0][0]
                     let y2 = n2[1][0][1]
		     let ds = this.path_build( x1, y1, x2, y2, over)
                     this.path.setAttributeNS(null, "d", ds);
             } else {
		     // n2
		     //      n1
		     console.log( "D->A")
		     let over = false;
		     if ( n1[1][0][1] < n2[1][2][1] ) {
                            console.log("over D->A")
			    over = true;
			     
                            let x1 = n1[1][2][0]
                            let y1 = n1[1][2][1]
                            let x2 = n2[1][0][0]
                            let y2 = n2[1][0][1]
		            let ds = this.path_over_build( x1, y1, x2, y2)
                            this.path.setAttributeNS(null, "d", ds);
			    return
			    
		     }
		     
                     let x1 = n1[1][0][0]
                     let y1 = n1[1][0][1]
                     let x2 = n2[1][2][0]
                     let y2 = n2[1][2][1]
		     
		     let ds = this.path_build( x1, y1, x2, y2, over)
                     this.path.setAttributeNS(null, "d", ds);
	     }
	 }
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
                    this.rotate = JSYG(this.node1).getMtx().rotate();
                    //this.mtx = JSYG(this.node1).getMtx();
                    this.node1.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
	     	    /*
	            var t = this.node1.getAttributeNS(null, "transform") ;
                    var tv = t.slice(7).slice(0,-1).split(' ');
                    tv[0]= "1";
                    tv[1]= "0";
                    tv[2]= "0";
                    tv[3]= "1";
                    tv[4]= -tv[4];
                    tv[5]= -tv[5];
                    tv[4]= "0";
                    tv[5]= "0";
                    var mtx = "matrix(" + tv[0] + " " + tv[1] + " " + tv[2] + " " + tv[3] + " " + tv[4] + " " + tv[5] + ")";
                    console.log(mtx);
                    this.node1.setAttributeNS(null, "transform", mtx );
                     */
                    isc1 = this.rotate_intersect_rect(n1[1], n2[1], this.node1, n1[2], n1[3], n1[4]);
                    //JSYG(this.node1).setMtx(this.mtx);
                    JSYG(this.node1).setMtx(JSYG(this.node1).getMtx().rotate(this.rotate, n1[1][0], n1[1][1]));
                } else {
                    isc1 = this.rotate_intersect_rect(n1[1], n2[1], this.node1, n1[2], n1[3], n1[4]);
		}
            }
            if (this.node1.tagName == "ellipse") {
                if (source == "dragging") {
                    this.rotate = JSYG(this.node1).getMtx().rotate();
                    this.node1.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    isc1 = this.rotate_intersect_ellipse(n1[1], n2[1], this.node1, n1[2], n1[3]);
                    JSYG(this.node1).setMtx(JSYG(this.node1).getMtx().rotate(this.rotate, n1[1][0], n1[1][1]));
			
                } else {
                    isc1 = this.rotate_intersect_ellipse(n1[1], n2[1], this.node1, n1[2], n1[3]);
                }
		
            }
            if (this.node1.tagName == "polygon") {
                if (source == "dragging") {
                    this.rotate = JSYG(this.node1).getMtx().rotate();
                    this.node1.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    isc1 = this.rotate_intersect_polygon(n1[1], n2[1], this.node1, n1[2], n1[3]);
                    //JSYG(this.node1).setMtx(JSYG(this.node1).getMtx().rotate(this.rotate, n1[1][0], n1[1][1]));
                } else {
                    isc1 = this.rotate_intersect_polygon(n1[1], n2[1], this.node1, n1[2], n1[3]);
		}
            }
        }

        if (n2[2] != 0) {
            if (this.node2.tagName == "rect") {
                if (source == "dragging") {
                    this.rotate = JSYG(this.node2).getMtx().rotate();
                    this.node2.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    isc2 = this.rotate_intersect_rect(n1[1], n2[1], this.node2, n2[2], n2[3], n2[4]);
                    JSYG(this.node2).setMtx(JSYG(this.node2).getMtx().rotate(this.rotate, n2[1][0], n2[1][1]));
                } else {
                    isc2 = this.rotate_intersect_rect(n1[1], n2[1], this.node2, n2[2], n2[3], n2[4]);
		}
            }
            if (this.node2.tagName == "ellipse") {
                if (source == "dragging") {
                    this.rotate = JSYG(this.node2).getMtx().rotate();
                    this.node2.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    isc2 = this.rotate_intersect_ellipse(n1[1], n2[1], this.node2, n2[2], n2[3]);
                    JSYG(this.node2).setMtx(JSYG(this.node2).getMtx().rotate(this.rotate, n2[1][0], n2[1][1]));
                } else {
                    isc2 = this.rotate_intersect_ellipse(n1[1], n2[1], this.node2, n2[2], n2[3]);
		}
            }
            if (this.node2.tagName == "polygon") {
                if (source == "dragging") {
                    this.rotate = JSYG(this.node2).getMtx().rotate();
                    this.node2.setAttributeNS(null, "transform", "matrix(1 0 0 1 0 0)");
                    isc2 = this.rotate_intersect_polygon(n1[1], n2[1], this.node2, n2[2], n2[3]);
                    //JSYG(this.node1).setMtx(JSYG(this.node1).getMtx().rotate(this.rotate, n1[1][0], n1[1][1]));
                } else {
                    isc2 = this.rotate_intersect_polygon(n1[1], n2[1], this.node2, n2[2], n2[3]);
		}
            }
        }

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

        const rotation = Matrix2D.rotationAt(-ellipse.angle, ellipse.center);
        const unrotation = Matrix2D.rotationAt(ellipse.angle, ellipse.center);

        const rotatedLine = {
            p1: line.p1.transform(rotation),
            p2: line.p2.transform(rotation),
        };

        // find intersections
        const result = Intersection.intersectEllipseLine(ellipse.center, ellipse.radiusX, ellipse.radiusY, rotatedLine.p1, rotatedLine.p2);
        result.points[0] = result.points[0].transform(unrotation);

        return result;
    }

    get_connect_point(node) {
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
            var t  = [ x + w/2 , y      ]
            var r  = [ x + w   , y + h/2]
            var b  = [ x + w/2 , y + h  ]
            var l  = [ x       , y + h/2]

            return [[cx, cy], [t,r,b,l ], r, angle];

        } else if (node.tagName == "circle") {
            var cx = parseFloat(node.getAttributeNS(null, "cx"));
            var cy = parseFloat(node.getAttributeNS(null, "cy"));
            var rr = parseFloat(node.getAttributeNS(null, "r"));
            var t = node.getAttributeNS(null, "transform");
            var r = 0;
            var angle = 0;
            if (t) {
                var tv = t.slice(7).slice(0, -1).split(" ");
                r = (Math.atan2(tv[1], tv[0]) * 180) / Math.PI;
                angle = Math.atan2(tv[1], tv[0]);
            }
            //var cx = x + w / 2;
            //var cy = y + h / 2;
            var t  = [ cx      , cy - rr  ]
            var r  = [ cx + rr , cy       ]
            var b  = [ cx      , cy + rr  ]
            var l  = [ cx - rr , cy       ]

            return [[cx, cy], [t,r,b,l ], r, angle];

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
                r = (Math.atan2(tv[1], tv[0]) * 180) / Math.PI;
                angle = Math.atan2(tv[1], tv[0]);
            }
            //var cx = x + w / 2;
            //var cy = y + h / 2;
            var t  = [ cx      , cy - ry  ]
            var r  = [ cx + rx , cy       ]
            var b  = [ cx      , cy + ry  ]
            var l  = [ cx - rx , cy       ]

            return [[cx, cy], [t,r,b,l ], r, angle];

        } else if (node.tagName == "polygon") {
            var points_str = node.getAttributeNS(null, "points");
            var t = node.getAttributeNS(null, "transform");
            var list = points_str.split(" ");
            let points_array = [];
            for (let i = 0; i < list.length; i = i + 2) {
                let point = [parseFloat(list[i]), parseFloat(list[i + 1])];
                points_array.push(point);
            }
            //let center = this.polygon_center(points_array);
	    let bb = node.getBBox();
            let center = [bb.x + bb.width/2, bb.y + bb.height/2];
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
            //let center = this.polygon_center(points_array);
	    let bb = node.getBBox();
            let center = [bb.x + bb.width/2, bb.y + bb.height/2];
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
