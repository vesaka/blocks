import Container from '$core/container';
import { boards } from '$blocks/config/puzzles.json';
import { unserialize, raw } from '$core/utils/object';
import { FINISHED } from '$blocks/bootstrap/constants';

class Level extends Container {
    constructor(options) {
        super(options);

        this.$listen({
            level: ['start', 'end'],
            block: ['grabbed', 'released'],
            goal: ['reached']
        });

        this.startAt = null;
    }

    load(levelNumber = 1) {
        const { level } = this.options.game;
        const levelMoves = level.moves.initial + level.moves.byLevel * (levelNumber - 1);
        const board = raw(boards.find(({ solution }) => solution.length === levelMoves));
        board.blocks = board.blocks.map(unserialize);
        this.$store.startLevel(levelNumber, levelMoves);
        this.$emit('level_loaded', board);
    }

    block_grabbed(block) {
        this.startAt = block.model.position.clone();
        this.addEvent('move_start', {
            id: block.id,
            x: block.row,
            y: block.col  
        });
    }

    block_released(block) {
        if (!block.model.position.equals(this.startAt)) {
            this.$store.level.moves++;

            this.addEvent('move_end', {
                id: block.id,
                x: block.row,
                y: block.col  
            });
        }
    }

    goal_reached() {
        const { game } = this.options;
        const { level } = this.$store;

        const stars = game.level.stars - Math.min(
            game.level.stars - 1,
            Math.ceil((level.moves - level.optimalMoves) / game.level.rate)
        )
        
        this.$store.endLevel({
            stars: Math.max(stars, level.stars),
            end: Math.round(new Date().getTime() / 1000),
            events: this.history || []
        });
        this.$emit('level_end');
        this.$store.state = FINISHED;
    }
}

export default Level;