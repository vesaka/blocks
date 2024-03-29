import HorizontalBlock from './horizontal-block';
class MainBlock extends HorizontalBlock {

    constructor(options) {
        super(options);
        this.$listen({
            block: ['released']
        })
    }

    filter_position(position) {        
        return super.filter_position(position);
    }

    getRange() {
        const {table, size} = this;        
        const range = super.getRange();
        
        if (table.width - size.width <= range.max) {
            range.max = table.width
        }

        
        return range;
    }
    
    block_released(block) {
        if (block.id !== this.id) {
            return;
        }
        const { goal, model } = this; 
        if ((goal.position.x === model.position.x) && (goal.position.y === model.position.y)) {
            this.$emit('goal_reached');
        }
    }

}

export default MainBlock;