class Strategy {

	constructor() {}

	easyStrategy() {

        let play = function (gameController, board, idx) {
            //player play
            
            gameController.sow_at(board, idx); 

            if (gameController.checkEndGame(board)) {
                gameController.endGame(board);
	        }

            if(gameController.turn != "p2") return; 
            //computer play
            while ( gameController.turn != "p1") {
	            let indexes = board.getEmptyUpCellsIndexes();
	            let randomIdx = Math.floor(Math.random() * indexes.length);

	            gameController.sow_at(board, parseInt(indexes[randomIdx]));

	            if (gameController.checkEndGame(board)) {
	                gameController.endGame(board);
	            }
        	}

        }
        return play;
    }
}