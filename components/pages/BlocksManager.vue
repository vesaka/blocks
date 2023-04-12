<template>
    <Transition>
        <div class="flex flex-col">
            <h3 class="text-xl">:: UnblockMe Solver ::</h3>
            <div class="flex flex-row py-1" id="buttons" ref="buttons">
                <button class="bg-blue-600 text-white rounded p-2" @click.prevent="newGame" type="button">New Game</button>
            </div>
            <div id="board" ref="board" class="relative">
                <div id="bTop" class="box" ref="bTop"></div>
                <div id="bMid" class="box" ref="bMid"></div>
                <div id="bBot" class="box" ref="bBot"></div>
                <div v-for="(block, index) in blocks"
                     class="block"
                     @mousedown.prevent="ev => onStartMove(ev, block)"
                     @mousemove.prevent="ev => onMove(ev, block)"
                     :style="block.style" :id="`block${index}`"></div>
            </div>
        </div>
    </Transition>
</template>
<script setup>
    import { ref, onBeforeMount, onMounted } from 'vue';


    const BOARD_SIZE = 6;
    const BLOCK_SIZE = 100;
    const BLOCK_PADDING = 5;
    const MAX_BLOCKS = 14;
    const NCELLS = BOARD_SIZE * BOARD_SIZE;
    const FREE_CELLS = NCELLS - BOARD_SIZE;
    const yDim = [1, 1, 2, 3];
    const xDim = [2, 3, 1, 1];
    const inc1Bl = [1, 1, BOARD_SIZE, BOARD_SIZE];               // a block is at [bp, bp+i1, bp+i2]
    const inc2Bl = [1, 2, BOARD_SIZE, BOARD_SIZE * 2];              // next second place for this block
    const end1Bl = [2, 3, BOARD_SIZE * 2, BOARD_SIZE * 3];             // Next space after this block
    const hvBl = [true, true, false, false]; // True for horizontal block
    const delBlk = null;

    const GOAL = [16, 0];

    const notes = {
        msg: ''
    };
    /**
     * Refs
     */
    const board = ref(null);
    const buttons = ref(null);

    const blocks = ref([]);
    /**
     * Methods
     */
    const start = () => {
        createFromString('200 002 011 422 120 232 432 042 052 242 252 440 540');
    };

    const renderBoard = () => {

    };

    const addBlock = (block) => {
        const index = blocks.value.length + 1;
        const bp = block[0];
        const bt = block[1];
        const col = bp % BOARD_SIZE;
        const line = (bp - col) / BOARD_SIZE;
        const top = BLOCK_SIZE * line;
        const left = BLOCK_SIZE * col;
        blocks.value.push({
            bp, bt, col,
            bn: index,
            sTop: top,
            sLeft: left,
            style: {
                width: (BLOCK_SIZE * xDim[bt] - BLOCK_PADDING) + 'px',
                height: (BLOCK_SIZE * yDim[bt] - BLOCK_PADDING) + 'px',
                backgroundColor: 1 === index ? 'red' : (bt < 2 ? 'green' : 'blue'),
                top: `${top}px`,
                left: `${left}px`
            }
        });


    };

    const createFromString = (str) => {
        const asg = str.split(" ");
        for (let i = 0; i < asg.length; i++) {
            if (asg[i].length === 3) {
                var bt = Math.min(3, Number(asg[i].charAt(2)));
                var line = Number(asg[i].charAt(0));
                var col = Number(asg[i].charAt(1));
                addBlock([6 * line + col, bt]);
            }
        }
    };

    const onStartMove = (ev, block) => {
        const {bt, bn, bp, sTop, sLeft} = block;
        const div = ev.target;
        const top = sTop;
        const left = sLeft;
        block.deltaX = div.offsetLeft - ev.clientX;
        block.deltaY = div.offsetTop - ev.clientY;
        block.div = document.getElementById(`block${bn - 1}`);
        const minMax = minMaxPos(bp, bt);

        if (bt < 2) {
            block.min = BLOCK_SIZE * (minMax[0] % BOARD_SIZE);
            block.max = BLOCK_SIZE * (minMax[1] % BOARD_SIZE);
        } else {
            block.min = BLOCK_SIZE * Math.floor(minMax[0] / BOARD_SIZE);
            block.max = BLOCK_SIZE * Math.floor(minMax[1] / BOARD_SIZE);
        }

        block.moving = true;
    };

    const onMove = (ev) => {
        const block = blocks.value.find(b => b.moving);
        if (!block)
            return;

        const {bt, bn, bp, sTop, sLeft, min, max, deltaX, deltaY, div} = block;

        if (bt < 2) {
            block.left = Math.min(max, Math.max(min, ev.clientX + deltaX));
            div.style.left = block.left + 'px';
        } else {
            block.top = Math.min(max, Math.max(min, ev.clientY + deltaY));
            div.style.top = block.top + 'px';
        }
    };

    const onEditMove = ev => {

    };

    const onEditUp = ev => {

    };

    const onEndMove = () => {
        const block = blocks.value.find(b => b.moving);
        if (!block)
            return;


        const {bt, bp, bn, left, top, div} = block;
        let line, col;

        if (bt < 2) {
            line = (bp - bp % BOARD_SIZE) / BOARD_SIZE;

            col = Math.round(left / BLOCK_SIZE);
            block.left = (BLOCK_SIZE * col);
            div.style.left = block.left + 'px';
        } else {
            col = bp % BOARD_SIZE;
            line = Math.round(top / BLOCK_SIZE);
            block.top = (BLOCK_SIZE * line);
            div.style.top = block.top + 'px';
        }

        block.bp = BOARD_SIZE * line + col;
        block.moving = false;
        block.div = null;
        if (bn === 1 && block.bp === 16) {
            console.log('YOU WIN');
            //document.getElementById("msg").innerHTML = "YOU WIN !!";
        } else {
            //showTips();
        }
    };

    const minMaxPos = (bp, bt) => {
        const from = (hvBl[bt]) ? (bp - bp % BOARD_SIZE) : bp % BOARD_SIZE;  // First and last cell Line/col
        const to = from + inc1Bl[bt] * (BOARD_SIZE - 1);
        const inc = inc1Bl[bt];
        let min = bp - inc;

        while (from <= min && isEmpty(min)) {
            min -= inc;
        }
        min += inc;
        let max = bp + end1Bl[bt];
        while (max <= to && isEmpty(max)) {
            max += inc;
        }
        max -= end1Bl[bt];
        return [min, max];
    };

    const isEmpty = (p) => {
        var empty = true;
        for (var i = 0; i < blocks.value.length && empty; i++) {
            const {bp, bt} = blocks.value[i];
            empty = (bp === delBlk) || (p !== bp && p !== (bp + inc1Bl[bt]) && p !== (bp + inc2Bl[bt]));
        }
        return empty;
    }

    const clearBoard = () => {
        blocks.value = [];
    };

    const newGame = () => {
        
        createNewBoard();
        let currLen = -1;
        let lastLen = 0;
        let loopCount = 10;
        let msgDiv 
        
    };

    const createNewBoard = () => {
        clearBoard();
        addBlock(GOAL);
        let moves = createPossibleBlocks();
        let loopCount = FREE_CELLS;

        while (moves.length && blocks.value.length < MAX_BLOCKS && loopCount--) {
            const oneMove = moves[Math.floor(moves.length * Math.random())];
            
            if (Math.floor(oneMove[0] / BOARD_SIZE) !== 2 || 1 < oneMove[1]) {
                addBlock(oneMove);
                moves = createPossibleBlocks();
            } else {
                moves = (moves.length === 1) ? [] : createPossibleBlocks();
            }
        }
        

    }

    const createPossibleBlocks = () => {
        var bps = [];
        for (var bp = 0; bp < NCELLS; bp++) {
            if (isEmpty(bp)) {
                for (var bt = 0; bt < 4; bt++) {
                    if (isPlacable(bp, bt) && isEmptyBlock(bp, bt)) {
                        bps.push([bp, bt]);
                    }
                }
            }
        }
        return bps;
    };

    const isPlacable = (bp, bt) => {
        return (bt < 2 && (bp % BOARD_SIZE + bt % 2) < (BOARD_SIZE - 1))
                || (1 < bt && (bp + BOARD_SIZE * (bt % 2)) < FREE_CELLS);
    };

    const isEmptyBlock = (p, bt) => {
        return blocks.value.length
                && isEmpty(p)
                && isEmpty(p + inc1Bl[bt])
                && isEmpty(p + inc2Bl[bt]);
        var empty = blocks.value.length;
        if (empty) {
            empty = isEmpty(p) && isEmpty(p + inc1Bl[bt]) && isEmpty(p + inc2Bl[bt]);
        }
        return empty;
    };

    onMounted(() => {
        document.addEventListener('mouseup', onEndMove);
        start();
        newGame();
    });


</script>
<style>
    #board      {
        width:600px;
        height:600px;
    }
    #editBlocks {
        display: none;
        width:400px;
        height:300px;
    }
    #main {
        position: relative;
    }
    #editBorder {
        width: 100%;
        height: 100%;
        border: 2px solid black;
    }
    #board .box  {
        width: 100%;
        border: 2px solid black;
    }
    #board #bTop {
        height: 200px;
        border-bottom: none;
    }
    #board #bMid {
        height: 100px;
        border-bottom: none;
        border-top: none;
        border-right: none;
    }
    #board #bBot {
        height: 300px;
        border-top: none;
    }
    #board img, #editBlocks img, #board .block, #editBlocks .block {
        position: absolute;
        padding: 5px;
    }
    #board, #right, #editBlocks, #msg {
        float: left;
    }
    #right {
        margin-left: 20px;
    }
    #msg {
        height: 295px;
    }
    #msg, textarea, button {
        margin-top: 5px;
    }
    #msg, #editBlocks {
        clear: both;
    }
</style>