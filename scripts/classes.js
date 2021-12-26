class Strategy {

	constructor() {}

	playerStrategy() {

		let play = function (gameController, board, idx) { 
                makePlay(gameController, board, idx);
        	}
        return play;
	}

	easyStrategy() {

        let play = function (gameController, board, idx) {
            //player play
			
			if (gameController.turn == "p1") {
           		if (!makePlay(gameController, board, idx)) return;
			}

            // computer play
            // plays while and if its computer's turn
            while ( gameController.turn != "p1") {
	            let indexes = board.getNotEmptyUpCellsIndexes();
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

    	let play = function(gameController, board, idx) {

    		//player play
			if (gameController.turn == "p1") {
            	if (!makePlay(gameController, board, idx)) return;
			}

	        //computer turn
	        while ( gameController.turn != "p1") {

	            let cells = board.getCells();

	        	//list with indexes of possible plays from computer 
	            let indexes = board.getNotEmptyUpCellsIndexes();
	           	//list with points of enemy cells
	           	let points = [];
	           	//list with indexes for each points
	           	let playIndexes = [];

	            for (let i = 0; i < indexes.length; i++) {
	            	const idx = indexes[i];
	            	const new_idx = getNewIndex(parseInt(idx), cells[idx].getSeeds(), board.getNumCavs(), "p2");
	            	
	            	// check if its on p2 side and if cell has no seeds (so it will collect opponents seeds)
	            	if (onPlayerBounds("p2", new_idx, board.getNumCavs()) && cells[new_idx].getSeeds() == 0) {
	            		//collects the seeds of the corespondent index
	            		const correspondentIdx = correspondentDown(new_idx, board.getNumCavs());
	            		points.push(parseInt(cells[correspondentIdx].getSeeds()));
	            		playIndexes.push(parseInt(idx));
	            	}
	            }

	            //get max possible points
	            const max = Math.max(...points);
	           	let maxIdx = points.indexOf(max);
	           	// caso não consiga fazer pontos então vai jogar a ultima casa para voltar a jogar
	           	let playIdx = maxIdx == -1 ? indexes[indexes.length - 1] : playIndexes[maxIdx];
	            
	            //makePlay return false when its endGame
	            if(!makePlay(gameController, board, parseInt(playIdx))) return;
        	}
    	}
    	return play;
    }
}