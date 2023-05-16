import Container from '$core/container';
import { unserialize } from '$core/utils/object';
import Cell from '$blocks/models/cells/cell';
class Bot extends Container {
    constructor() {
        super();
        this.$listen({
            level: ['loaded', 'start', 'end']
        });

        console.log('Bot is running');
    }

    level_loaded(board) {

        this.moves = board.solution.map(unserialize);
        
    }

    level_start() {
        const { moves, $blocks} = this;
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            const [row, col] = move.position.split('|').map(Number);
            const block = $blocks.get(move.block);
            block.at = block.model.position;
            this.$emit('block_grabbed', block);
            setTimeout(() => {
                
                block.model.position.x = col * Cell.def.size;
                block.model.position.y = row * Cell.def.size;

                block.release();
                if (i === (moves.length - 1)) {
                    block.model.position.x += 2 * Cell.def.size;
                    block.block_released();
                }
                //this.$emit('block_released', block);
            }, 250)
        }
    }
}

export default Bot;