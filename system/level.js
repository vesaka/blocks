import Container from '$core/container';
import { boards } from '$blocks/config/puzzles.json';
import { unserialize, raw } from '$core/utils/object';

class Level extends Container {
    constructor(options) {
        super(options);

        this.$listen({
            level: ['start', 'end'],
            pointer: ['start', 'move', 'release'],
            blocl: ['grab', 'release']
        })
    }

    load(levelNumber = 1) {
        const { level } = this.options.game;
        const levelMoves = level.moves.initial + level.moves.byLevel * (levelNumber - 1);
        const board = raw(boards.find(({ solution }) => solution.length === levelMoves));
        board.blocks = board.blocks.map(unserialize);

        this.$emit('level_loaded', board)
    }

    select() {

    }

    reset() {

    }
}

export default Level;