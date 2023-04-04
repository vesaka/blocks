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
    
    getRange() {
        const { id, x, table, size, slots } = this;
        let min = 0, max = table.height - size.height, minResolved = false;
        const ids = [0, id, undefined];
        for (let i = 0; i < table.rows; i++) {
            const slot = table.slots[i][slots[0].y];
            if (!minResolved && !ids.includes(slot.takenBy)) {
                min = (slot.x+1) * size.width;
            } else if(id === slot.takenBy) {
                minResolved = true;
            } else if (minResolved && !ids.includes(slot.takenBy)){
                max = slot.x * size.width - size.height;
                break;
            }
        }
        return { min, max };
    }
}

export default VerticalBlock;