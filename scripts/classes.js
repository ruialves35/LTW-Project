class Strategy {

	constructor() {}

	playerStrategy() {

		let play = function (gameController, board, idx) { 
                gameController.sow_at(board, idx); 
                if (gameController.checkEndGame(board)) {
                    gameController.endGame(board);
                }
        	}
        return play;
	}

	easyStrategy() {

        let play = function (gameController, board, idx) {
            //player play
            gameController.sow_at(board, idx); 

            if (gameController.checkEndGame(board)) {
                gameController.endGame(board);
	        }

            // computer play
            // plays while and if its computer's turn
            while ( gameController.turn != "p1") {
	            let indexes = board.getEmptyUpCellsIndexes();
	            let randomIdx = Math.floor(Math.random() * indexes.length);

	            gameController.sow_at(board, parseInt(indexes[randomIdx]));

	            if (gameController.checkEndGame(board)) {
	                gameController.endGame(board);
	                return;
	            }
        	}

        }
        return play;
    }

    mediumStrategy() {

    }
}