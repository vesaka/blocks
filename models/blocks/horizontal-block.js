import Block from './block';

class HorizontalBlock extends Block {
    constructor(options) {
        Object.assign(options, {
            axis: 'x',
            cross: 'y',
            direction: 'width',
            oposite: 'height'
        });
        super(options);
    }
}

export default HorizontalBlock;