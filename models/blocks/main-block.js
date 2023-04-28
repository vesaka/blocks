import HorizontalBlock from './horizontal-block';
class MainBlock extends HorizontalBlock {

    constructor(options) {
        super(options);
    }

    filter_position(position) {
        console.log(position);
        
        return super.filter_position(position);
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