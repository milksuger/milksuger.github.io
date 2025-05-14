// 游戏配置
const BOARD_SIZE = 15; // 15x15的棋盘
const CELL_SIZE = 40; // 每个格子的大小
const PIECE_RADIUS = 18; // 棋子半径

// 排行榜配置
const LEADERBOARD_SIZE = 5; // 每个排行榜显示前5名
let fastestWins = JSON.parse(localStorage.getItem('fastestWins') || '[]'); // 最快获胜记录
let slowestLosses = JSON.parse(localStorage.getItem('slowestLosses') || '[]'); // 最慢失败记录

// 棋盘风格配置
const boardStyles = {
    classic: {
        background: '#DEB887',
        gridColor: '#000',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(60,60,60,0.18)',
            white: 'rgba(180,180,180,0.18)'
        }
    },
    modern: {
        background: '#f5f5f5',
        gridColor: '#666',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.8)'
        }
    },
    zen: {
        background: '#f4f1ea',
        gridColor: '#8b7355',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.15)',
            white: 'rgba(255,255,255,0.7)'
        }
    },
    dark: {
        background: '#2c3e50',
        gridColor: '#34495e',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.3)',
            white: 'rgba(255,255,255,0.6)'
        }
    },
    nature: {
        background: '#e8f5e9',
        gridColor: '#81c784',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.7)'
        }
    },
    elegant: {
        background: '#f3e5f5',
        gridColor: '#9c27b0',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.7)'
        }
    },
    ocean: {
        background: '#e3f2fd',
        gridColor: '#2196f3',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.7)'
        }
    },
    sunset: {
        background: '#fff3e0',
        gridColor: '#ff9800',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.7)'
        }
    },
    forest: {
        background: '#e8f5e9',
        gridColor: '#4caf50',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.7)'
        }
    },
    sakura: {
        background: '#fce4ec',
        gridColor: '#e91e63',
        gridWidth: 1,
        pieceShadow: {
            black: 'rgba(0,0,0,0.2)',
            white: 'rgba(255,255,255,0.7)'
        }
    }
};

// 游戏状态
let gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
let isPlayerTurn = true;
let gameOver = false;
let hoverRow = null;
let hoverCol = null;
let playerSteps = 0;
let aiSteps = 0;
let aiDifficulty = 5; // AI难度，范围1-10
let currentStyle = 'classic'; // 当前棋盘风格

// 游戏历史记录
let moveHistory = [];
let boardHistory = []; // 存储每一步的棋盘状态
let isReplaying = false;
let replayInterval = null;
let currentReplayStep = 0;
let replaySpeed = 1;

// 添加AI分析相关变量
let suggestionHighlight = null;

// 获取画布和上下文
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');
const statsDiv = document.getElementById('stats');
const winModal = document.getElementById('winModal');
const winText = document.getElementById('winText');
const aiDifficultySlider = document.getElementById('aiDifficulty');
const aiDifficultyValue = document.getElementById('aiDifficultyValue');

// 获取UI元素
const undoButton = document.getElementById('undoButton');
const replayPanel = document.querySelector('.replay-panel');
const startReplayBtn = document.getElementById('startReplayBtn');
const pauseReplayBtn = document.getElementById('pauseReplayBtn');
const stopReplayBtn = document.getElementById('stopReplayBtn');
const stepBackwardBtn = document.getElementById('stepBackwardBtn');
const stepForwardBtn = document.getElementById('stepForwardBtn');
const replayProgress = document.getElementById('replayProgress');
const replayStep = document.getElementById('replayStep');
const replayStatus = document.querySelector('.replay-status');
const replaySpeedSelect = document.getElementById('replaySpeed');

// 音效
const moveSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
const winSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');

// 初始化游戏
function initGame() {
    drawBoard();
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // 添加AI难度滑块事件监听
    aiDifficultySlider.addEventListener('input', function() {
        aiDifficulty = parseInt(this.value);
        aiDifficultyValue.textContent = aiDifficulty;
    });

    // 添加棋盘风格选择器事件监听
    const boardStyleSelect = document.getElementById('boardStyle');
    boardStyleSelect.addEventListener('change', function() {
        changeBoardStyle(this.value);
    });

    // 初始化排行榜显示
    updateLeaderboardDisplay();

    // 暂时隐藏历史记录加载
    // loadGameHistory();
}

// 切换棋盘风格
function changeBoardStyle(style) {
    if (!boardStyles[style]) return;
    currentStyle = style;
    // 重新绘制棋盘和所有棋子
    drawBoard();
    // 重新绘制所有已放置的棋子
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (gameBoard[i][j] !== 0) {
                drawPiece(i, j, gameBoard[i][j]);
            }
        }
    }
}

// 绘制棋盘
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const style = boardStyles[currentStyle] || boardStyles.classic;
    
    // 绘制棋盘背景
    ctx.fillStyle = style.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    ctx.strokeStyle = style.gridColor;
    ctx.lineWidth = style.gridWidth;
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        // 横线
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE, CELL_SIZE * (i + 1));
        ctx.lineTo(CELL_SIZE * BOARD_SIZE, CELL_SIZE * (i + 1));
        ctx.stroke();
        
        // 竖线
        ctx.beginPath();
        ctx.moveTo(CELL_SIZE * (i + 1), CELL_SIZE);
        ctx.lineTo(CELL_SIZE * (i + 1), CELL_SIZE * BOARD_SIZE);
        ctx.stroke();
    }
    
    // 绘制棋子
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (gameBoard[i][j] !== 0) {
                drawPiece(i, j, gameBoard[i][j]);
            }
        }
    }
    
    // 绘制高亮预览
    if (
        hoverRow !== null && hoverCol !== null &&
        gameBoard[hoverRow][hoverCol] === 0 &&
        isPlayerTurn && !gameOver
    ) {
        const x = CELL_SIZE * (hoverCol + 1);
        const y = CELL_SIZE * (hoverRow + 1);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.restore();
    }

    // 绘制AI建议位置
    if (suggestionHighlight) {
        const rect = canvas.getBoundingClientRect();
        const cellSize = canvas.width / 15;
        const col = Math.round((parseFloat(suggestionHighlight.style.left) - rect.left) / cellSize);
        const row = Math.round((parseFloat(suggestionHighlight.style.top) - rect.top) / cellSize);
        
        const x = CELL_SIZE * (col + 1);
        const y = CELL_SIZE * (row + 1);
        
        // 绘制半透明黑棋
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.restore();
        
        // 绘制高亮边框
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
    }
}

// 绘制棋子
function drawPiece(row, col, player) {
    const x = CELL_SIZE * (col + 1);
    const y = CELL_SIZE * (row + 1);
    const style = boardStyles[currentStyle] || boardStyles.classic;
    
    ctx.save();
    // 柔和阴影
    ctx.shadowColor = player === 1 ? style.pieceShadow.black : style.pieceShadow.white;
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    
    // 柔和渐变
    let gradient;
    if (player === 1) {
        // 黑棋：中间深灰，边缘黑色
        gradient = ctx.createRadialGradient(x - 4, y - 4, PIECE_RADIUS * 0.2, x, y, PIECE_RADIUS);
        gradient.addColorStop(0, '#444');
        gradient.addColorStop(0.7, '#222');
        gradient.addColorStop(1, '#111');
    } else {
        // 白棋：中间亮灰，边缘白色
        gradient = ctx.createRadialGradient(x - 2, y - 2, PIECE_RADIUS * 0.2, x, y, PIECE_RADIUS);
        gradient.addColorStop(0, '#f7f7f7');
        gradient.addColorStop(0.7, '#e0e0e0');
        gradient.addColorStop(1, '#fff');
    }
    
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // 细腻描边
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = player === 1 ? '#222' : '#ccc';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}

// 处理点击事件
function handleClick(event) {
    if (!isPlayerTurn || gameOver) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const col = Math.round(x / CELL_SIZE) - 1;
    const row = Math.round(y / CELL_SIZE) - 1;
    
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && gameBoard[row][col] === 0) {
        makeMove(row, col, 1);
        if (!gameOver) {
            setTimeout(aiMove, 500);
        }
    }
}

// 落子
function makeMove(row, col, player) {
    gameBoard[row][col] = player;
    if (player === 1) playerSteps++;
    else aiSteps++;
    
    // 记录移动
    moveHistory.push({row, col, player});
    
    // 保存当前棋盘状态
    boardHistory.push(JSON.parse(JSON.stringify(gameBoard)));
    
    drawBoard();
    updateStats();
    updateUndoButton();
    
    if (checkWin(row, col, player)) {
        gameOver = true;
        const msg = player === 1 ? '🎉 恭喜你获胜！' : '🤖 电脑获胜！';
        showWinModal(msg);
        statusDiv.textContent = player === 1 ? '玩家获胜！' : '电脑获胜！';
        // 暂时隐藏回放面板
        // showReplayPanel();
        saveGameData(); // 保存游戏数据
        removeSuggestionHighlight();
        return;
    }
    isPlayerTurn = !isPlayerTurn;
    statusDiv.textContent = isPlayerTurn ? '轮到玩家下棋' : '电脑思考中...';
    removeSuggestionHighlight();
}

// AI移动
function aiMove() {
    if (gameOver) return;
    
    // 简单的AI策略：评估每个可能的落子位置
    let bestScore = -Infinity;
    let bestMove = null;
    
    // 遍历所有可能的落子位置
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (gameBoard[i][j] === 0) {
                // 评估这个位置
                const score = evaluateAIMove(i, j);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = {row: i, col: j};
                }
            }
        }
    }
    
    if (bestMove) {
        makeMove(bestMove.row, bestMove.col, 2);
    }
}

// AI移动评估函数
function evaluateAIMove(row, col) {
    let score = 0;
    
    // 检查八个方向
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    // 评估进攻分数（黑棋）
    for (const [dx, dy] of directions) {
        let count = 1; // 当前位置算一个
        let blocked = 0;
        let space = 0;
        
        // 正向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                blocked++;
                break;
            }
            
            if (gameBoard[newRow][newCol] === 2) { // 黑棋
                count++;
            } else if (gameBoard[newRow][newCol] === 1) { // 白棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                blocked++;
                break;
            }
            
            if (gameBoard[newRow][newCol] === 2) { // 黑棋
                count++;
            } else if (gameBoard[newRow][newCol] === 1) { // 白棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 进攻评分
        if (count >= 5) score += 100000;
        else if (count === 4) {
            if (blocked === 0) score += 10000;
            else if (blocked === 1) score += 1000;
        }
        else if (count === 3) {
            if (blocked === 0) score += 1000;
            else if (blocked === 1) score += 100;
        }
        else if (count === 2) {
            if (blocked === 0) score += 100;
            else if (blocked === 1) score += 10;
        }
    }
    
    // 评估防守分数（白棋）
    for (const [dx, dy] of directions) {
        let count = 1; // 当前位置算一个
        let blocked = 0;
        let space = 0;
        
        // 正向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                blocked++;
                break;
            }
            
            if (gameBoard[newRow][newCol] === 1) { // 白棋
                count++;
            } else if (gameBoard[newRow][newCol] === 2) { // 黑棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                blocked++;
                break;
            }
            
            if (gameBoard[newRow][newCol] === 1) { // 白棋
                count++;
            } else if (gameBoard[newRow][newCol] === 2) { // 黑棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 防守评分（权重略低于进攻）
        if (count >= 5) score += 80000;
        else if (count === 4) {
            if (blocked === 0) score += 8000;
            else if (blocked === 1) score += 800;
        }
        else if (count === 3) {
            if (blocked === 0) score += 800;
            else if (blocked === 1) score += 80;
        }
        else if (count === 2) {
            if (blocked === 0) score += 80;
            else if (blocked === 1) score += 8;
        }
    }
    
    // 考虑位置权重
    const centerWeight = 1 - (Math.abs(row - 7) + Math.abs(col - 7)) / 14;
    score += centerWeight * 50;
    
    // 根据AI难度调整评分
    const difficultyMultiplier = aiDifficulty / 5;
    score *= difficultyMultiplier;
    
    // 在低难度时添加随机因素
    if (aiDifficulty < 5) {
        score += Math.random() * 1000 * (5 - aiDifficulty);
    }
    
    return score;
}

// 检查是否获胜
function checkWin(row, col, player) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1;
        
        // 正向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
            if (gameBoard[newRow][newCol] !== player) break;
            count++;
        }
        
        // 反向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) break;
            if (gameBoard[newRow][newCol] !== player) break;
            count++;
        }
        
        if (count >= 5) return true;
    }
    
    return false;
}

// 重置游戏
function resetGame() {
    gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    isPlayerTurn = true;
    gameOver = false;
    playerSteps = 0;
    aiSteps = 0;
    moveHistory = [];
    boardHistory = [];
    statusDiv.textContent = '轮到玩家下棋';
    drawBoard();
    updateStats();
    updateUndoButton();
    
    // 隐藏回放面板
    if (replayPanel) {
        replayPanel.style.display = 'none';
    }
    removeSuggestionHighlight();
}

function handleMouseMove(event) {
    if (!isPlayerTurn || gameOver) {
        hoverRow = null;
        hoverCol = null;
        drawBoard();
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.round(x / CELL_SIZE) - 1;
    const row = Math.round(y / CELL_SIZE) - 1;
    if (
        row >= 0 && row < BOARD_SIZE &&
        col >= 0 && col < BOARD_SIZE &&
        gameBoard[row][col] === 0
    ) {
        hoverRow = row;
        hoverCol = col;
    } else {
        hoverRow = null;
        hoverCol = null;
    }
    drawBoard();
}

function handleMouseLeave() {
    hoverRow = null;
    hoverCol = null;
    drawBoard();
}

function updateStats() {
    const stats = countChains();
    statsDiv.innerHTML = `
        <div class="stat-item">
            <b>玩家步数</b>
            <span>${playerSteps}</span>
        </div>
        <div class="stat-item">
            <b>电脑步数</b>
            <span>${aiSteps}</span>
        </div>
        <div class="stat-item">
            <b>有效黑棋三联</b>
            <span>${stats.black.three}</span>
        </div>
        <div class="stat-item">
            <b>有效黑棋四联</b>
            <span>${stats.black.four}</span>
        </div>
        <div class="stat-item">
            <b>有效白棋三联</b>
            <span>${stats.white.three}</span>
        </div>
        <div class="stat-item">
            <b>有效白棋四联</b>
            <span>${stats.white.four}</span>
        </div>
    `;
}

function countChains() {
    // 统计有效黑白棋三联、四联数量
    const result = {
        black: { three: 0, four: 0 },
        white: { three: 0, four: 0 }
    };
    
    // 只检查四个方向：水平、垂直、两个对角线
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 主对角线
        [1, -1]   // 副对角线
    ];

    // 用于记录已经统计过的位置
    const counted = new Set();

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const player = gameBoard[row][col];
            if (player === 0) continue;

            for (const [dx, dy] of directions) {
                // 生成唯一标识符，避免重复统计
                const key = `${row},${col},${dx},${dy}`;
                if (counted.has(key)) continue;

                let count = 1;
                let blocked = 0;
                let positions = [[row, col]];

                // 正向检查
                for (let i = 1; i <= 4; i++) {
                    const newRow = row + dx * i;
                    const newCol = col + dy * i;
                    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                        blocked++;
                        break;
                    }
                    if (gameBoard[newRow][newCol] === player) {
                        count++;
                        positions.push([newRow, newCol]);
                    } else if (gameBoard[newRow][newCol] !== 0) {
                        blocked++;
                        break;
                    } else {
                        break;
                    }
                }

                // 反向检查
                for (let i = 1; i <= 4; i++) {
                    const newRow = row - dx * i;
                    const newCol = col - dy * i;
                    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
                        blocked++;
                        break;
                    }
                    if (gameBoard[newRow][newCol] === player) {
                        count++;
                        positions.push([newRow, newCol]);
                    } else if (gameBoard[newRow][newCol] !== 0) {
                        blocked++;
                        break;
                    } else {
                        break;
                    }
                }

                // 只有当两端都没有被堵死时才计数
                if (blocked < 2) {
                    if (count === 3 || count === 4) {
                        // 记录所有相关位置，避免重复统计
                        positions.forEach(([r, c]) => {
                            directions.forEach(([d1, d2]) => {
                                counted.add(`${r},${c},${d1},${d2}`);
                            });
                        });

                        if (player === 1) {
                            if (count === 3) result.black.three++;
                            if (count === 4) result.black.four++;
                        } else {
                            if (count === 3) result.white.three++;
                            if (count === 4) result.white.four++;
                        }
                    }
                }
            }
        }
    }

    return result;
}

function showWinModal(msg) {
    winText.textContent = msg;
    winModal.style.display = 'flex';
}

function closeWinModalAndRestart() {
    winModal.style.display = 'none';
    resetGame();
}

// 悔棋功能
function undoMove() {
    if (moveHistory.length < 2) return; // 至少需要撤销玩家和AI的最后一步
    
    // 撤销AI的最后一步
    const aiMove = moveHistory.pop();
    gameBoard[aiMove.row][aiMove.col] = 0;
    aiSteps--;
    
    // 撤销玩家的最后一步
    const playerMove = moveHistory.pop();
    gameBoard[playerMove.row][playerMove.col] = 0;
    playerSteps--;
    
    // 更新游戏状态
    isPlayerTurn = true;
    gameOver = false;
    statusDiv.textContent = '轮到玩家下棋';
    
    // 更新UI
    drawBoard();
    updateStats();
    updateUndoButton();
}

// 更新悔棋按钮状态
function updateUndoButton() {
    undoButton.disabled = moveHistory.length < 2 || isReplaying;
}

// 更新回放状态
function updateReplayStatus(status) {
    replayStatus.textContent = status;
}

// 更新回放按钮状态
function updateReplayButtons() {
    const canStepBackward = currentReplayStep > 0;
    const canStepForward = currentReplayStep < moveHistory.length;
    
    stepBackwardBtn.disabled = !canStepBackward || isReplaying;
    stepForwardBtn.disabled = !canStepForward || isReplaying;
    startReplayBtn.disabled = isReplaying;
    pauseReplayBtn.disabled = !isReplaying;
    stopReplayBtn.disabled = !isReplaying;
}

// 播放落子音效
function playMoveSound() {
    moveSound.currentTime = 0;
    moveSound.play().catch(() => {});
}

// 播放胜利音效
function playWinSound() {
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
}

// 显示回放面板
function showReplayPanel() {
    replayPanel.style.display = 'block';
    replayProgress.max = moveHistory.length;
    replayStep.textContent = `0/${moveHistory.length}`;
    updateReplayStatus('准备回放');
    updateReplayButtons();
}

// 执行一步回放
function executeReplayStep(step) {
    if (step < 0 || step > moveHistory.length) return;
    
    // 使用保存的棋盘状态
    if (step === 0) {
        gameBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
        playerSteps = 0;
        aiSteps = 0;
    } else {
        gameBoard = JSON.parse(JSON.stringify(boardHistory[step - 1]));
        // 计算步数
        playerSteps = 0;
        aiSteps = 0;
        for (let i = 0; i < step; i++) {
            if (moveHistory[i].player === 1) playerSteps++;
            else aiSteps++;
        }
    }
    
    currentReplayStep = step;
    drawBoard();
    updateStats();
    replayProgress.value = step;
    replayStep.textContent = `${step}/${moveHistory.length}`;
    updateReplayButtons();
    
    // 高亮最后一步
    if (step > 0) {
        const lastMove = moveHistory[step - 1];
        const x = CELL_SIZE * (lastMove.col + 1);
        const y = CELL_SIZE * (lastMove.row + 1);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, PIECE_RADIUS * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = lastMove.player === 1 ? '#000' : '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    // 更新回放状态
    if (step === 0) {
        updateReplayStatus('准备回放');
    } else if (step === moveHistory.length) {
        updateReplayStatus('回放完成');
        playWinSound();
    } else {
        updateReplayStatus('正在回放');
    }
}

// 开始回放
function startReplay() {
    if (isReplaying) return;
    
    isReplaying = true;
    updateReplayStatus('正在回放');
    updateReplayButtons();
    
    // 开始回放动画
    replayInterval = setInterval(() => {
        if (currentReplayStep >= moveHistory.length) {
            stopReplay();
            return;
        }
        
        executeReplayStep(currentReplayStep + 1);
        playMoveSound();
    }, 500 / replaySpeed); // 根据速度调整间隔
}

// 暂停回放
function pauseReplay() {
    if (!isReplaying) return;
    
    clearInterval(replayInterval);
    isReplaying = false;
    updateReplayStatus('已暂停');
    updateReplayButtons();
}

// 停止回放
function stopReplay() {
    clearInterval(replayInterval);
    isReplaying = false;
    
    // 重置游戏状态
    resetGame();
    moveHistory = [];
    
    // 更新UI状态
    replayPanel.style.display = 'none';
    updateUndoButton();
    updateReplayStatus('准备回放');
}

// 上一步
function stepBackward() {
    if (currentReplayStep > 0) {
        executeReplayStep(currentReplayStep - 1);
        playMoveSound();
    }
}

// 下一步
function stepForward() {
    if (currentReplayStep < moveHistory.length) {
        executeReplayStep(currentReplayStep + 1);
        playMoveSound();
    }
}

// 修改进度条控制
replayProgress.addEventListener('input', function() {
    if (isReplaying) {
        pauseReplay();
    }
    const step = parseInt(this.value);
    executeReplayStep(step);
});

// 添加速度控制
replaySpeedSelect.addEventListener('change', function() {
    replaySpeed = parseFloat(this.value);
    if (isReplaying) {
        clearInterval(replayInterval);
        startReplay();
    }
});

// 保存棋局数据
function saveGameData() {
    const gameData = {
        moveHistory,
        boardHistory,
        playerSteps,
        aiSteps,
        gameOver,
        timestamp: new Date().toISOString(),
        winner: gameOver ? (playerSteps > aiSteps ? 'player' : 'ai') : null
    };
    
    // 获取已保存的游戏记录
    let savedGames = JSON.parse(localStorage.getItem('gomokuGames') || '[]');
    
    // 添加新游戏记录
    savedGames.push(gameData);
    
    // 只保留最近的10局游戏
    if (savedGames.length > 10) {
        savedGames = savedGames.slice(-10);
    }
    
    // 保存到localStorage
    localStorage.setItem('gomokuGames', JSON.stringify(savedGames));

    // 更新排行榜
    updateLeaderboards(gameData);
}

// 更新排行榜
function updateLeaderboards(gameData) {
    if (!gameData.gameOver) return;

    const timestamp = new Date(gameData.timestamp);
    const formattedDate = timestamp.toLocaleString();
    
    if (gameData.winner === 'player') {
        // 更新最快获胜记录
        const newRecord = {
            steps: gameData.playerSteps,
            date: formattedDate
        };
        
        fastestWins.push(newRecord);
        fastestWins.sort((a, b) => a.steps - b.steps);
        fastestWins = fastestWins.slice(0, LEADERBOARD_SIZE);
        localStorage.setItem('fastestWins', JSON.stringify(fastestWins));
    } else {
        // 更新最慢失败记录
        const newRecord = {
            steps: gameData.playerSteps,
            date: formattedDate
        };
        
        slowestLosses.push(newRecord);
        slowestLosses.sort((a, b) => b.steps - a.steps);
        slowestLosses = slowestLosses.slice(0, LEADERBOARD_SIZE);
        localStorage.setItem('slowestLosses', JSON.stringify(slowestLosses));
    }
    
    // 更新排行榜显示
    updateLeaderboardDisplay();
}

// 更新排行榜显示
function updateLeaderboardDisplay() {
    const fastestWinsList = document.getElementById('fastestWinsList');
    const slowestLossesList = document.getElementById('slowestLossesList');
    
    if (fastestWinsList) {
        fastestWinsList.innerHTML = fastestWins.map((record, index) => `
            <div class="leaderboard-item">
                <span class="rank">${index + 1}</span>
                <span class="steps">${record.steps}步</span>
                <span class="date">${record.date}</span>
            </div>
        `).join('');
    }
    
    if (slowestLossesList) {
        slowestLossesList.innerHTML = slowestLosses.map((record, index) => `
            <div class="leaderboard-item">
                <span class="rank">${index + 1}</span>
                <span class="steps">${record.steps}步</span>
                <span class="date">${record.date}</span>
            </div>
        `).join('');
    }
}

// 加载历史游戏记录
function loadGameHistory() {
    const savedGames = JSON.parse(localStorage.getItem('gomokuGames') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (!historyList) return;
    
    historyList.innerHTML = savedGames.map((game, index) => {
        const date = new Date(game.timestamp);
        const winner = game.winner === 'player' ? '玩家' : '电脑';
        return `
            <div class="history-item" data-index="${index}">
                <span class="history-date">${date.toLocaleString()}</span>
                <span class="history-steps">步数: ${game.moveHistory.length}</span>
                <span class="history-winner">胜者: ${winner}</span>
                <button class="replay-history-btn" onclick="replayHistoryGame(${index})">回放</button>
            </div>
        `;
    }).join('');
}

// 回放历史游戏
function replayHistoryGame(index) {
    const savedGames = JSON.parse(localStorage.getItem('gomokuGames') || '[]');
    const game = savedGames[index];
    
    if (!game) return;
    
    // 重置游戏状态
    resetGame();
    
    // 加载历史记录
    moveHistory = game.moveHistory;
    boardHistory = game.boardHistory; // 加载棋盘状态历史
    playerSteps = game.playerSteps;
    aiSteps = game.aiSteps;
    gameOver = game.gameOver;
    
    // 显示回放面板
    showReplayPanel();
    
    // 执行回放
    executeReplayStep(0);
}

// AI分析函数
function analyzePosition() {
    if (gameOver) return;
    
    // 移除之前的建议高亮
    removeSuggestionHighlight();
    
    // 获取当前棋盘状态
    const currentBoard = gameBoard.map(row => [...row]);
    
    // 使用AI评估函数找到最佳落子位置
    let bestScore = -Infinity;
    let bestMove = null;
    
    // 遍历所有可能的落子位置
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (currentBoard[i][j] === 0) {
                // 评估这个位置
                const score = evaluateAIMove(i, j);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }
    
    if (bestMove) {
        // 显示建议位置
        showSuggestionHighlight(bestMove.row, bestMove.col);
        
        // 更新状态信息
        document.getElementById('status').textContent = `AI建议落子位置: (${bestMove.row + 1}, ${bestMove.col + 1})`;
    }
}

// 显示建议位置高亮
function showSuggestionHighlight(row, col) {
    // 移除之前的建议高亮
    removeSuggestionHighlight();
    
    const canvas = document.getElementById('gameBoard');
    const ctx = canvas.getContext('2d');
    const x = CELL_SIZE * (col + 1);
    const y = CELL_SIZE * (row + 1);
    
    // 绘制半透明黑棋
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
    
    // 绘制高亮边框
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS * 1.2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
    
    // 创建高亮元素（用于动画效果）
    const rect = canvas.getBoundingClientRect();
    const cellSize = canvas.width / 15;
    
    suggestionHighlight = document.createElement('div');
    suggestionHighlight.className = 'suggestion-highlight';
    suggestionHighlight.style.width = `${cellSize * 0.8}px`;
    suggestionHighlight.style.height = `${cellSize * 0.8}px`;
    suggestionHighlight.style.left = `${rect.left + col * cellSize + cellSize * 0.1}px`;
    suggestionHighlight.style.top = `${rect.top + row * cellSize + cellSize * 0.1}px`;
    
    document.body.appendChild(suggestionHighlight);
}

// 移除建议位置高亮
function removeSuggestionHighlight() {
    if (suggestionHighlight) {
        suggestionHighlight.remove();
        suggestionHighlight = null;
    }
    // 重绘棋盘以清除建议位置
    drawBoard();
}

// 找到最佳落子位置
function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = null;
    
    // 遍历所有可能的落子位置
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (board[i][j] === 0) {
                // 评估这个位置
                const score = evaluatePosition(board, i, j);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }
    
    return bestMove;
}

// 评估位置分数
function evaluatePosition(board, row, col) {
    let score = 0;
    
    // 检查八个方向
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    
    // 评估进攻分数（黑棋）
    for (const [dx, dy] of directions) {
        let count = 1; // 当前位置算一个
        let blocked = 0;
        let space = 0;
        
        // 正向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
                blocked++;
                break;
            }
            
            if (board[newRow][newCol] === 2) { // 黑棋
                count++;
            } else if (board[newRow][newCol] === 1) { // 白棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
                blocked++;
                break;
            }
            
            if (board[newRow][newCol] === 2) { // 黑棋
                count++;
            } else if (board[newRow][newCol] === 1) { // 白棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 进攻评分
        if (count >= 5) score += 100000;
        else if (count === 4) {
            if (blocked === 0) score += 10000;
            else if (blocked === 1) score += 1000;
        }
        else if (count === 3) {
            if (blocked === 0) score += 1000;
            else if (blocked === 1) score += 100;
        }
        else if (count === 2) {
            if (blocked === 0) score += 100;
            else if (blocked === 1) score += 10;
        }
    }
    
    // 评估防守分数（白棋）
    for (const [dx, dy] of directions) {
        let count = 1; // 当前位置算一个
        let blocked = 0;
        let space = 0;
        
        // 正向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
                blocked++;
                break;
            }
            
            if (board[newRow][newCol] === 1) { // 白棋
                count++;
            } else if (board[newRow][newCol] === 2) { // 黑棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i <= 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
                blocked++;
                break;
            }
            
            if (board[newRow][newCol] === 1) { // 白棋
                count++;
            } else if (board[newRow][newCol] === 2) { // 黑棋
                blocked++;
                break;
            } else { // 空位
                space++;
                break;
            }
        }
        
        // 防守评分（权重略低于进攻）
        if (count >= 5) score += 80000;
        else if (count === 4) {
            if (blocked === 0) score += 8000;
            else if (blocked === 1) score += 800;
        }
        else if (count === 3) {
            if (blocked === 0) score += 800;
            else if (blocked === 1) score += 80;
        }
        else if (count === 2) {
            if (blocked === 0) score += 80;
            else if (blocked === 1) score += 8;
        }
    }
    
    // 考虑位置权重
    const centerWeight = 1 - (Math.abs(row - 7) + Math.abs(col - 7)) / 14;
    score += centerWeight * 50;
    
    return score;
}

// 初始化游戏
initGame();
updateStats(); 