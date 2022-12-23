import Block from './block';

class VerticalBlock extends Block {
    constructor(options) {
        Object.assign(options, {
            axis: 'y',
            cross: 'x',
            direction: 'height',
            oposite: 'width'
        });
        super(options);

    }
}

export default VerticalBlock;