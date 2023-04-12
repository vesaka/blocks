class Block {
    constructor(block) {
        for (let key in block) {
            this[key] = block;
        }
    }
    
    get isHorizontal() {
        return this.orientation === 'horizontal';
    }
    
    get isVertical() {
        return this.orientation === 'vertical';
    }
}

export default Block;

