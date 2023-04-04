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
    
    
    getRange() {
        const { id, x, table, size, slots } = this;
        let min = 0, max = table.width - size.width, minResolved = false;
        const ids = [0, id, undefined];
        for (let i = 0; i < table.columns; i++) {
            const slot = table.slots[slots[0].x][i];
            if (!minResolved && !ids.includes(slot.takenBy)) {
                min = (slot.y+1) * size.height;
            } else if(id === slot.takenBy) {
                minResolved = true;
            } else if (minResolved && !ids.includes(slot.takenBy)){
                max = slot.y * size.height - size.width;
                break;
            }
        }
        return { min, max };
    }
}

export default HorizontalBlock;