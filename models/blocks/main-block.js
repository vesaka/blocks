import VerticalBlock from './vertical-block';
import Cell from '$blocks/models/cell';
class MainBlock extends VerticalBlock {
    
    constructor(options) {
        super(options);
    }
    
    filter_position(position) {
        const { table, path, axis, cross } = this;
        position[cross] = path * Cell.def.size;
        position[axis] = 4 * Cell.def.size;
        position.z = Cell.def.depth * 2;

        return position;
    }
    
}

export default MainBlock;