document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("game-board");
    const scoreElement = document.getElementById("score");
    const restartButton = document.getElementById("restart-button");

    let grid = Array(4).fill().map(() => Array(4).fill(0));
    let score = 0;

    function createBoard() {
        board.innerHTML = "";
        grid.forEach((row, i) => {
            row.forEach((num, j) => {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                if (num > 0) {
                    tile.textContent = num;
                    tile.dataset.value = num;
                }
                board.appendChild(tile);
            });
        });
    }

    function addRandomTile() {
        let emptyTiles = [];
        grid.forEach((row, i) => row.forEach((num, j) => {
            if (num === 0) emptyTiles.push([i, j]);
        }));

        if (emptyTiles.length > 0) {
            let [x, y] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[x][y] = Math.random() < 0.9 ? 2 : 4;
            createBoard();
        }
    }

    function move(direction) {
        let oldGrid = JSON.stringify(grid);
        let moved = false;

        if (direction === "left" || direction === "right") {
            for (let i = 0; i < 4; i++) {
                let row = grid[i].filter(num => num);
                if (direction === "right") row.reverse();
                row = mergeTiles(row);
                while (row.length < 4) row.push(0);
                if (direction === "right") row.reverse();
                grid[i] = row;
            }
        } else {
            for (let j = 0; j < 4; j++) {
                let col = [];
                for (let i = 0; i < 4; i++) col.push(grid[i][j]);
                if (direction === "down") col.reverse();
                col = mergeTiles(col);
                while (col.length < 4) col.push(0);
                if (direction === "down") col.reverse();
                for (let i = 0; i < 4; i++) grid[i][j] = col[i];
            }
        }

        if (oldGrid !== JSON.stringify(grid)) {
            addRandomTile();
        }
    }

    function mergeTiles(line) {
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] === line[i + 1] && line[i] !== 0) {
                line[i] *= 2;
                score += line[i];
                line[i + 1] = 0;
            }
        }
        return line.filter(num => num);
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case "ArrowLeft": move("left"); break;
            case "ArrowRight": move("right"); break;
            case "ArrowUp": move("up"); break;
            case "ArrowDown": move("down"); break;
        }
        scoreElement.textContent = score;
    }

    function restartGame() {
        grid = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        scoreElement.textContent = score;
        addRandomTile();
        addRandomTile();
    }

    // Swipe Controls for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) move("right");
            else if (dx < -30) move("left");
        } else {
            if (dy > 30) move("down");
            else if (dy < -30) move("up");
        }
        scoreElement.textContent = score;
    });

    document.addEventListener("keydown", handleKeyPress);
    restartButton.addEventListener("click", restartGame);

    restartGame();
});
