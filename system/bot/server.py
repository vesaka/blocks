
from unblockme import *
V = "vertical"
H = "horizontal"

def start(blocks, goal):
    const board = make_init_state(blocks, goal)
    se = SearchEngine('astar', 'full')

     print("\n\n------TESTING BOARD------")
    return se.search(board, unblockme_goal_fn, heur_num_blocks_blocking)
    

