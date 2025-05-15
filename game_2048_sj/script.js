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
        
        // 添加棋盘大小选择相关的属性
        this.boardSizeSelect = document.getElementById('board-size');
        this.customSizeInput = document.getElementById('custom-size-input');
        this.customSizeInputField = document.getElementById('custom-size');
        this.gridContainer = document.querySelector('.grid-container');
        
        // 添加统计相关的属性
        this.stats = {
            gamesPlayed: parseInt(localStorage.getItem('gamesPlayed')) || 0,
            totalScore: parseInt(localStorage.getItem('totalScore')) || 0,
            highestTile: parseInt(localStorage.getItem('highestTile')) || 0,
            wins: parseInt(localStorage.getItem('wins')) || 0,
            scoreHistory: JSON.parse(localStorage.getItem('scoreHistory')) || [],
            leaderboards: JSON.parse(localStorage.getItem('leaderboards')) || {}
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
        
        // 初始化排行榜
        this.leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        
        // 确保在DOM加载完成后再获取元素
        this.aiButton = document.getElementById('ai-button');
        this.aiSpeedInput = document.getElementById('ai-speed');
        this.aiSpeedValue = document.getElementById('ai-speed-value');
        this.directionHint = document.getElementById('direction-hint');
        this.arrows = {
            up: this.directionHint.querySelector('.up'),
            right: this.directionHint.querySelector('.right'),
            down: this.directionHint.querySelector('.down'),
            left: this.directionHint.querySelector('.left')
        };
        
        this.isAIPlaying = false;
        this.aiInterval = null;
        this.aiSpeed = 500; // AI移动间隔时间（毫秒）
        
        // 初始化AI速度显示
        if (this.aiSpeedValue) {
            this.aiSpeedValue.textContent = this.aiSpeed;
        }
        
        // 初始化事件监听
        this.initializeEventListeners();
        
        // 初始化游戏
        this.setupNewGame();
        this.applyTheme(this.currentTheme);
        
        this.winPoints = [2048, 4096, 8192, 16384, 32768]; // 添加获胜点数组
        this.currentWinPointIndex = 0; // 当前获胜点索引
    }

    initializeEventListeners() {
        // 棋盘大小选择事件
        this.boardSizeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.customSizeInput.style.display = 'block';
                // 聚焦到输入框
                this.customSizeInputField.focus();
            } else {
                this.customSizeInput.style.display = 'none';
                const size = parseInt(e.target.value);
                if (size >= 3 && size <= 10) {
                    this.size = size;
                    this.updateGridSize();
                    this.setupNewGame();
                }
            }
        });

        // 自定义大小输入事件
        this.customSizeInputField.addEventListener('input', (e) => {
            const value = e.target.value;
            // 只允许输入数字
            if (!/^\d*$/.test(value)) {
                e.target.value = value.replace(/\D/g, '');
                return;
            }
        });

        this.customSizeInputField.addEventListener('change', (e) => {
            const size = parseInt(e.target.value);
            if (size >= 3 && size <= 10) {
                this.size = size;
                this.updateGridSize();
                this.setupNewGame();
            } else {
                // 显示错误提示
                alert('请输入3-10之间的数字');
                // 重置为默认值
                e.target.value = '4';
                this.size = 4;
                this.updateGridSize();
                this.setupNewGame();
            }
        });

        // 添加回车键提交功能
        this.customSizeInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.target.blur(); // 触发change事件
            }
        });

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

        // 阻止默认的下拉刷新行为
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.game-container')) {
                e.preventDefault();
            }
        }, { passive: false });

        // 触摸事件处理
        let touchStartX, touchStartY;
        const gameContainer = document.querySelector('.game-container');

        gameContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        gameContainer.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            // 只有当滑动距离超过一定阈值时才触发移动
            const minSwipeDistance = 30;
            if (Math.abs(dx) > minSwipeDistance || Math.abs(dy) > minSwipeDistance) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) this.move('right');
                    else this.move('left');
                } else {
                    if (dy > 0) this.move('down');
                    else this.move('up');
                }
            }
        }, { passive: true });

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

        // 添加AI按钮事件监听
        if (this.aiButton) {
            this.aiButton.addEventListener('click', () => {
                console.log('AI button clicked'); // 添加调试日志
                this.toggleAI();
            });
        }

        // 添加AI速度控制事件监听
        if (this.aiSpeedInput) {
            this.aiSpeedInput.addEventListener('input', (e) => {
                const speed = parseInt(e.target.value);
                this.aiSpeed = speed;
                if (this.aiSpeedValue) {
                    this.aiSpeedValue.textContent = speed;
                }
                
                // 如果AI正在运行，更新间隔时间
                if (this.isAIPlaying) {
                    this.stopAI();
                    this.startAI();
                }
            });
        }
    }

    handleKeyPress(event) {
        // 空格键重新开始游戏
        if (event.key === ' ') {
            event.preventDefault();
            this.setupNewGame();
            return;
        }

        // Enter键继续游戏（当获胜时）
        if (event.key === 'Enter' && this.won) {
            event.preventDefault();
            this.continueGame();
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
        localStorage.setItem('leaderboards', JSON.stringify(this.stats.leaderboards));
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
                    label: '最近10局游戏分数',
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
                if (this.grid[i][j] === this.winPoints[this.currentWinPointIndex]) {
                    this.won = true;
                    this.stats.wins++;
                    this.saveStats();
                    this.showMessage(`你达到了${this.winPoints[this.currentWinPointIndex]}！`, true);
                    this.updateLeaderboard(this.score);
                    this.stopAI();
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
        this.updateLeaderboard(this.score);
        this.stopAI();
    }

    showMessage(message, won) {
        this.messageContainer.style.display = 'block';
        this.messageContainer.className = `game-message ${won ? 'game-won' : 'game-over'}`;
        
        // 创建消息内容
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // 添加消息文本
        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageContent.appendChild(messageText);
        
        // 如果是获胜，添加进度条和按钮
        if (won) {
            // 创建进度条容器
            const progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            
            // 创建进度条
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            
            // 计算进度
            const currentValue = this.winPoints[this.currentWinPointIndex];
            const nextValue = this.winPoints[this.currentWinPointIndex + 1] || currentValue * 2;
            const progress = (currentValue / nextValue) * 100;
            
            progressBar.style.width = `${progress}%`;
            
            // 添加进度文本
            const progressText = document.createElement('div');
            progressText.className = 'progress-text';
            progressText.textContent = `下一个目标: ${nextValue}`;
            
            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);
            messageContent.appendChild(progressContainer);
            
            // 添加按钮容器
            const lower = document.createElement('div');
            lower.className = 'lower';
            lower.innerHTML = `
                <button id="continue-button">继续游戏</button>
                <button id="retry-button">再试一次</button>
            `;
            messageContent.appendChild(lower);
            
            // 添加事件监听
            lower.querySelector('#continue-button').addEventListener('click', () => {
                this.continueGame();
            });
            
            lower.querySelector('#retry-button').addEventListener('click', () => {
                this.setupNewGame();
            });
        }
        
        // 清空并添加新的消息内容
        this.messageContainer.innerHTML = '';
        this.messageContainer.appendChild(messageContent);
    }

    continueGame() {
        this.messageContainer.style.display = 'none';
        this.won = false;
        this.currentWinPointIndex++; // 增加获胜点索引
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

    updateLeaderboard(score) {
        const size = this.size;
        if (!this.stats.leaderboards[size]) {
            this.stats.leaderboards[size] = [];
        }
        
        this.stats.leaderboards[size].push({
            score: score,
            date: new Date().toISOString()
        });
        
        // 按分数排序并只保留前10名
        this.stats.leaderboards[size].sort((a, b) => b.score - a.score);
        if (this.stats.leaderboards[size].length > 10) {
            this.stats.leaderboards[size] = this.stats.leaderboards[size].slice(0, 10);
        }
        
        this.saveStats();
        this.updateLeaderboardDisplay();
    }

    updateLeaderboardDisplay() {
        const leaderboardList = document.getElementById('leaderboard-list');
        const size = this.size;
        const leaderboard = this.stats.leaderboards[size] || [];
        
        leaderboardList.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const li = document.createElement('li');
            const date = new Date(entry.date).toLocaleDateString();
            li.textContent = `${index + 1}. ${entry.score}分 (${date})`;
            leaderboardList.appendChild(li);
        });
    }

    toggleAI() {
        console.log('Toggle AI called, current state:', this.isAIPlaying); // 添加调试日志
        this.isAIPlaying = !this.isAIPlaying;
        if (this.aiButton) {
            this.aiButton.textContent = this.isAIPlaying ? '停止AI' : 'AI演示';
        }
        
        if (this.isAIPlaying) {
            this.startAI();
        } else {
            this.stopAI();
        }
    }

    startAI() {
        console.log('Starting AI'); // 添加调试日志
        if (this.gameOver) return;
        
        if (this.aiInterval) {
            clearInterval(this.aiInterval);
        }
        
        this.aiInterval = setInterval(() => {
            if (this.gameOver) {
                this.stopAI();
                return;
            }
            
            const bestMove = this.findBestMove();
            if (bestMove) {
                this.move(bestMove);
            } else {
                this.stopAI();
            }
        }, this.aiSpeed);
    }

    stopAI() {
        console.log('Stopping AI'); // 添加调试日志
        if (this.aiInterval) {
            clearInterval(this.aiInterval);
            this.aiInterval = null;
        }
        this.isAIPlaying = false;
        if (this.aiButton) {
            this.aiButton.textContent = 'AI演示';
        }
        // 清除方向提示
        this.showDirectionHint(null);
    }

    findBestMove() {
        const directions = ['up', 'right', 'down', 'left'];
        let bestScore = -Infinity;
        let bestMove = null;

        // 使用极小极大算法，向前看3步
        for (const direction of directions) {
            const score = this.evaluateMove(direction);
            if (score > bestScore) {
                bestScore = score;
                bestMove = direction;
            }
        }

        // 显示方向提示
        this.showDirectionHint(bestMove);

        return bestMove;
    }

    evaluateMove(direction) {
        // 保存当前状态
        const oldGrid = JSON.stringify(this.grid);
        const oldScore = this.score;
        
        // 尝试移动
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
        
        // 如果移动无效，返回负无穷
        if (!moved) {
            this.grid = JSON.parse(oldGrid);
            this.score = oldScore;
            return -Infinity;
        }
        
        // 计算评估分数
        let score = 0;
        
        // 1. 奖励合并得分
        score += (this.score - oldScore) * 2;
        
        // 2. 奖励大数字在角落
        const corners = [[0,0], [0,3], [3,0], [3,3]];
        for (const [x, y] of corners) {
            if (this.grid[x][y] >= 128) {
                score += this.grid[x][y] * 2;
            }
        }
        
        // 3. 奖励空格数量
        const emptyCells = this.countEmptyCells();
        score += emptyCells * 20;
        
        // 4. 奖励数字的单调性
        score += this.evaluateMonotonicity() * 15;
        
        // 5. 奖励数字的平滑度
        score += this.evaluateSmoothness() * 10;
        
        // 6. 惩罚数字分散
        score -= this.evaluateDispersion() * 5;
        
        // 7. 奖励大数字在边缘
        score += this.evaluateEdgeValue() * 10;
        
        // 恢复状态
        this.grid = JSON.parse(oldGrid);
        this.score = oldScore;
        
        return score;
    }

    countEmptyCells() {
        let count = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    count++;
                }
            }
        }
        return count;
    }

    evaluateSmoothness() {
        let smoothness = 0;
        
        // 检查水平方向的平滑度
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                if (this.grid[i][j] !== 0 && this.grid[i][j + 1] !== 0) {
                    smoothness -= Math.abs(Math.log2(this.grid[i][j]) - Math.log2(this.grid[i][j + 1]));
                }
            }
        }
        
        // 检查垂直方向的平滑度
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size - 1; i++) {
                if (this.grid[i][j] !== 0 && this.grid[i + 1][j] !== 0) {
                    smoothness -= Math.abs(Math.log2(this.grid[i][j]) - Math.log2(this.grid[i + 1][j]));
                }
            }
        }
        
        return smoothness;
    }

    evaluateDispersion() {
        let dispersion = 0;
        const center = this.size / 2;
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    // 计算到中心的距离
                    const distance = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2));
                    dispersion += distance * Math.log2(this.grid[i][j]);
                }
            }
        }
        
        return dispersion;
    }

    evaluateEdgeValue() {
        let edgeValue = 0;
        
        // 检查边缘的数字
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (i === 0 || i === this.size - 1 || j === 0 || j === this.size - 1) {
                    if (this.grid[i][j] >= 64) {
                        edgeValue += this.grid[i][j];
                    }
                }
            }
        }
        
        return edgeValue;
    }

    evaluateMonotonicity() {
        let score = 0;
        
        // 检查行的单调性
        for (let i = 0; i < this.size; i++) {
            let current = 0;
            let next = current + 1;
            while (next < this.size) {
                while (next < this.size && this.grid[i][next] === 0) {
                    next++;
                }
                if (next >= this.size) {
                    next--;
                }
                const currentValue = this.grid[i][current] !== 0 ? Math.log2(this.grid[i][current]) : 0;
                const nextValue = this.grid[i][next] !== 0 ? Math.log2(this.grid[i][next]) : 0;
                if (currentValue > nextValue) {
                    score += nextValue - currentValue;
                } else if (nextValue > currentValue) {
                    score += currentValue - nextValue;
                }
                current = next;
                next++;
            }
        }
        
        // 检查列的单调性
        for (let j = 0; j < this.size; j++) {
            let current = 0;
            let next = current + 1;
            while (next < this.size) {
                while (next < this.size && this.grid[next][j] === 0) {
                    next++;
                }
                if (next >= this.size) {
                    next--;
                }
                const currentValue = this.grid[current][j] !== 0 ? Math.log2(this.grid[current][j]) : 0;
                const nextValue = this.grid[next][j] !== 0 ? Math.log2(this.grid[next][j]) : 0;
                if (currentValue > nextValue) {
                    score += nextValue - currentValue;
                } else if (nextValue > currentValue) {
                    score += currentValue - nextValue;
                }
                current = next;
                next++;
            }
        }
        
        return score;
    }

    showDirectionHint(direction) {
        // 移除所有箭头的active类
        Object.values(this.arrows).forEach(arrow => arrow.classList.remove('active'));
        
        // 添加当前方向的active类
        if (direction && this.arrows[direction]) {
            this.arrows[direction].classList.add('active');
        }
    }

    updateGridSize() {
        // 更新网格容器的样式
        this.gridContainer.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
        this.gridContainer.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        
        // 清空并重新创建网格单元格
        this.gridContainer.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                this.gridContainer.appendChild(cell);
            }
        }
    }

    setupNewGame() {
        // 重新创建网格
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.currentWinPointIndex = 0; // 重置获胜点索引
        this.updateScore();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        
        // 修复遮罩层不消失的问题
        this.messageContainer.style.display = 'none';
        
        // 更新统计
        this.updateStats();
        this.stopAI();
        this.showDirectionHint(null);
    }
}

// 启动游戏
window.onload = () => {
    new Game2048();
}; 