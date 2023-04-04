import VerticalBlock from './vertical-block';
import Cell from '$blocks/models/cells/cell';
class MainBlock extends VerticalBlock {

    constructor(options) {
        super(options);
    }

    getRange() {
        const {table, direction, axis, size, goal, at, model: {position}} = this;

        const goalSize = Math.max(goal.size.width, goal.size.height);
        let min = 0, max = table[direction] - size[direction];
        
        
        goal.resolve({
            top() {
                min -= goalSize;
            },
            left() {
                min = -goalSize;
                max = table.width;
            },
            bottom() {
                min = 0;
                max += goalSize;
            },
            right() {
                min = 0;
                max = table.width + goalSize;
            }
        });
        
        const range = super.getRange();
        min = Math.max(min, range.min);
        max = Math.min(max, range.max);

        return {min, max};
    }
    
    block_released() {
        
    }

}

export default MainBlock;