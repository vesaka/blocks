import Model from '$core/3d/models/three-model';
import {
Mesh, BoxGeometry, MeshPhongMaterial, Object3D,
        EdgesGeometry, LineSegments, LineBasicMaterial,
        Color, ExtrudeGeometry, Shape, MathUtils
        } from 'three';
import { extend, raw } from '$core/utils/object';
import { hex2bin } from '$core/utils/colors';

class Cell extends Model {

    static def = {};

    static halfSize = 0;

    constructor(options) {

        super(extend(Cell.def, options));

    }

    filter_material(material) {
        const {id} = this;
        const r = parseInt(material.color.slice(1, 3), 16);
        const g = parseInt(material.color.slice(3, 5), 16);
        const b = parseInt(material.color.slice(5), 16);

        const newR = MathUtils.clamp(r + id*10, 0, 255);
        const newG = MathUtils.clamp(g + id*10, 0, 255);
        const newB = MathUtils.clamp(b + id*10, 0, 255);
        material.color = new Color(`rgb(${newR}, ${newG}, ${newB})`);

        return material;
    }

    static setOptions(options) {
        Cell.def = options;
        Cell.halfSize = options.size / 2;
    }

    createShape() {
        const {size, depth} = this;
        const shape = new Shape;
        shape.moveTo(0, 0);
        shape.lineTo(0, size);
        shape.lineTo(size, size);
        shape.lineTo(size, 0);
        shape.lineTo(0, 0);

        return shape;
    }

    createModel() {
        const {size, depth, material} = this;
        const obj = new Object3D;
        const geometry = new BoxGeometry(size, size, depth);


        obj.add(new LineSegments(
                new EdgesGeometry(geometry),
                new LineBasicMaterial(material)
                ));

        obj.add(new Mesh(
                geometry,
                new MeshPhongMaterial(material)
                ));
        return obj;
    }

    static createMesh(options) {
        const {size, depth, material} = extend(Cell.def, options);

        return new Mesh(
                new BoxGeometry(size, size, depth, 1, 1, 1),
                new MeshPhongMaterial(material)
                );
    }

    createUniqueColor() {
        const {id, material} = this;
    }

}

export default Cell;