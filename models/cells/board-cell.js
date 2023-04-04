import Matrix from '$core/2d/grids/matrix';
import {Color} from 'three';

import Cell from './cell';
import { extend } from '$core/utils/object';
class BoardCell extends Cell {
    constructor(options) {
        super(options);
        

    }
    
    filter_material(material) {
        const { x, y, colors} = this;
        const colorIndex = Number((0 === x % 2 && 0 === y % 2) || (1 === x % 2 && 1 === y % 2));
        material.color = new Color(colors[colorIndex]);
        //hex2bin(material.color);
        //new Color(material.color).getHex();
        //material.wireframe = true;
        return material;
    }
    


//    createModel() {
//        
//    }

}

export default BoardCell;