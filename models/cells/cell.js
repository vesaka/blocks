import Model from '$core/3d/models/three-model';
import { Mesh, BoxGeometry, MeshPhongMaterial, Color } from 'three';
import { extend } from '$core/utils/object';
import { hex2bin } from '$core/utils/colors';

class Cell extends Model {
    
    static def = {};
    
    static halfSize = 0;
    
    constructor(options) {
        
        super(extend(Cell.def, options));

    }
    
    filter_material(material) {
        material.color = new Color(material.color);
        //hex2bin(material.color);
       //new Color(material.color).getHex();
        material.wireframe = true;
        return material;
    }
    
    static setOptions(options) {
        Cell.def = options;
        Cell.halfSize = options.size / 2;
    }

    createModel() {
        const { size, depth, material } = this;
        return new Mesh(
                new BoxGeometry(size, size, depth),
                new MeshPhongMaterial(material)
        );
    }
    
    static createMesh(options) {
        const { size, depth, material} = extend(Cell.def, options);
        
        return new Mesh(
                new BoxGeometry(size, size, depth, 1, 1, 1),
                new MeshPhongMaterial(material)
        );
    }

}

export default Cell;