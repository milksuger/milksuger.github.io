class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameOver = false;
        this.won = false;
        this.tileContainer = document.getElementById('tile-container');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.messageContainer = document.getElementById('game-message');
        
        // 添加统计相关的属性
        this.stats = {
            gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
            totalScore: parseInt(localStorage.getItem('totalScore')) || 0,
            highestTile: parseInt(localStorage.getItem('highestTile')) || 0,
            wins: parseInt(localStorage.getItem('wins')) || 0,
            scoreHistory: JSON.parse(localStorage.getItem('scoreHistory')) || []
        };
        
        // 添加统计面板的DOM元素引用
        this.statsModal = document.getElementById('stats-modal');
        this.statsButton = document.getElementById('stats-button');
        this.closeStatsButton = document.getElementById('close-stats');
        this.statsDisplay = {
            gamesPlayed: document.getElementById('games-played'),
            averageScore: document.getElementById('average-score'),
            highestTile: document.getElementById('highest-tile'),
            wins: document.getElementById('wins')
        };
        
        // 初始化图表
        this.scoreChart = null;
        
        // 添加主题相关的属性
        this.currentTheme = localStorage.getItem('theme') || 'default';
        this.themeButton = document.getElementById('theme-button');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.themeSwitch = document.querySelector('.theme-switch');
        
        this.init();
        this.applyTheme(this.currentTheme);
    }

    init() {
        this.setupNewGame();
        this.setupEventListeners();
    }

    setupNewGame() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        
        // 修复遮罩层不消失的问题
        this.messageContainer.style.display = 'none';
        
        // 只更新显示，不再累计统计数据
        this.updateStats();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('new-game-button').addEventListener('click', () => this.setupNewGame());
        document.getElementById('retry-button').addEventListener('click', () => this.setupNewGame());

        // 添加统计面板的事件监听
        this.statsButton.addEventListener('click', () => this.showStats());
        this.closeStatsButton.addEventListener('click', () => this.hideStats());
        
        // 点击模态框外部关闭
        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.hideStats();
            }
        });

        // 触摸事件处理
        let touchStartX, touchStartY;
        const gameContainer = document.querySelector('.game-container');

        gameContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        gameContainer.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) this.move('right');
                else this.move('left');
            } else {
                if (dy > 0) this.move('down');
                else this.move('up');
            }
        });

        // 主题切换按钮点击显示/隐藏菜单
        this.themeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.themeSwitch.classList.toggle('active');
        });
        // 主题选项点击切换主题
        this.themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.themeSwitch.classList.remove('active');
            });
        });
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (this.themeSwitch.classList.contains('active')) {
                this.themeSwitch.classList.remove('active');
            }
        });
    }

    handleKeyPress(event) {
        // 空格键重新开始游戏
        if (event.key === ' ') {
            event.preventDefault();
            this.setupNewGame();
            return;
        }

        if (this.gameOver) return;

        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const direction = keyMap[event.key];
        if (direction) {
            event.preventDefault();
            this.move(direction);
        }
    }

    move(direction) {
        if (this.gameOver) return;

        const oldGrid = JSON.stringify(this.grid);
        let moved = false;

        switch (direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            this.checkGameOver();
        }
    }

    moveLeft() {
        let moved = false;
        this.mergedTiles = [];
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    this.mergedTiles.push({x: i, y: j});
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            const newRow = row.concat(Array(this.size - row.length).fill(0));
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        this.mergedTiles = [];
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    this.mergedTiles.push({x: i, y: j});
                    row.splice(j - 1, 1);
                    moved = true;
                }
            }
            const newRow = Array(this.size - row.length).fill(0).concat(row);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        this.mergedTiles = [];
        for (let j = 0; j < this.size; j++) {
            let column = this.grid.map(row => row[j]).filter(cell => cell !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    this.mergedTiles.push({x: i, y: j});
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            const newColumn = column.concat(Array(this.size - column.length).fill(0));
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== newColumn[i]) {
                    moved = true;
                }
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        this.mergedTiles = [];
        for (let j = 0; j < this.size; j++) {
            let column = this.grid.map(row => row[j]).filter(cell => cell !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    this.mergedTiles.push({x: i, y: j});
                    column.splice(i - 1, 1);
                    moved = true;
                }
            }
            const newColumn = Array(this.size - column.length).fill(0).concat(column);
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== newColumn[i]) {
                    moved = true;
                }
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        this.tileContainer.innerHTML = '';
        const gridSize = this.size;
        const gap = 15;
        const tileSize = `calc((100% - ${(gridSize - 1) * gap}px) / ${gridSize})`;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (this.grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.grid[i][j]}`;
                    tile.textContent = this.grid[i][j];
                    tile.style.width = tileSize;
                    tile.style.height = tileSize;
                    tile.style.top = `calc(${i} * (${tileSize} + ${gap}px))`;
                    tile.style.left = `calc(${j} * (${tileSize} + ${gap}px))`;
                    // 合并动画
                    if (this.mergedTiles && this.mergedTiles.some(pos => pos.x === i && pos.y === j)) {
                        tile.classList.add('tile-merge');
                        tile.addEventListener('animationend', () => {
                            tile.classList.remove('tile-merge');
                        }, { once: true });
                    }
                    this.tileContainer.appendChild(tile);
                }
            }
        }
        this.updateScore();
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        this.bestScoreDisplay.textContent = this.bestScore;
    }

    showStats() {
        this.updateStats();
        this.statsModal.style.display = 'flex';
        this.updateScoreChart();
    }

    hideStats() {
        this.statsModal.style.display = 'none';
    }

    updateStats() {
        // 每次都从localStorage读取最新统计数据
        this.stats.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
        this.stats.totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
        this.stats.highestTile = parseInt(localStorage.getItem('highestTile')) || 0;
        this.stats.wins = parseInt(localStorage.getItem('wins')) || 0;
        this.stats.scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];

        // highestTile 只显示历史最大值
        this.statsDisplay.gamesPlayed.textContent = this.stats.gamesPlayed;
        this.statsDisplay.averageScore.textContent = this.stats.gamesPlayed > 0 ? Math.floor(this.stats.totalScore / this.stats.gamesPlayed) : 0;
        this.statsDisplay.highestTile.textContent = this.stats.highestTile;
        this.statsDisplay.wins.textContent = this.stats.wins;
    }

    saveStats() {
        localStorage.setItem('gamesPlayed', this.stats.gamesPlayed);
        localStorage.setItem('totalScore', this.stats.totalScore);
        localStorage.setItem('highestTile', this.stats.highestTile);
        localStorage.setItem('wins', this.stats.wins);
        localStorage.setItem('scoreHistory', JSON.stringify(this.stats.scoreHistory));
    }

    updateScoreChart() {
        const ctx = document.getElementById('score-chart').getContext('2d');
        
        // 如果图表已存在，销毁它
        if (this.scoreChart) {
            this.scoreChart.destroy();
        }

        // 创建新图表
        this.scoreChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: this.stats.scoreHistory.length}, (_, i) => `第${i + 1}局`),
                datasets: [{
                    label: '游戏分数',
                    data: this.stats.scoreHistory,
                    borderColor: '#8f7a66',
                    backgroundColor: 'rgba(143, 122, 102, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '最近10局游戏分数',
                        color: '#776e65',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#776e65'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#776e65'
                        }
                    }
                }
            }
        });
    }

    checkGameOver() {
        // 检查是否获胜
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    this.won = true;
                    this.stats.wins++;
                    this.saveStats();
                    this.showMessage('你赢了！', true);
                    return;
                }
            }
        }

        // 检查是否还有空格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) return;
            }
        }

        // 检查是否还能移动
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                if (
                    (i < this.size - 1 && current === this.grid[i + 1][j]) ||
                    (j < this.size - 1 && current === this.grid[i][j + 1])
                ) {
                    return;
                }
            }
        }

        this.gameOver = true;
        // 游戏结束时记录分数
        this.stats.gamesPlayed++;
        this.stats.totalScore += this.score;
        this.stats.scoreHistory.push(this.score);
        if (this.stats.scoreHistory.length > 10) {
            this.stats.scoreHistory.shift(); // 只保留最近10局游戏的分数
        }
        this.saveStats();
        this.showMessage('游戏结束！', false);
    }

    showMessage(message, won) {
        this.messageContainer.style.display = 'block';
        this.messageContainer.className = `game-message ${won ? 'game-won' : 'game-over'}`;
        this.messageContainer.querySelector('p').textContent = message;
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        // 高亮当前主题
        this.themeOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

// 启动游戏
window.onload = () => {
    new Game2048();
}; 