// Инициализация Telegram Mini App
if (window.Telegram && Telegram.WebApp) {
    // Растягиваем на весь экран
    Telegram.WebApp.expand();
    
    // Отключаем вертикальные свайпы
    Telegram.WebApp.disableVerticalSwipes();
    
    // Устанавливаем цвет фона
    Telegram.WebApp.setBackgroundColor('#000000');
    Telegram.WebApp.setHeaderColor('#000000');
    
    // Говорим, что приложение готово
    Telegram.WebApp.ready();
    
    // Блокируем скролл на уровне WebView
    Telegram.WebApp.MainButton.hide(); // если не нужна кнопка
}
// ===== ФИКС КЛАВИАТУРЫ ДЛЯ iOS =====
(function() {
    const tg = window.Telegram?.WebApp;
    
    if (!tg) return;
    
    // Функция принудительного сброса высоты
    function forceResetHeight() {
        // Возвращаем нормальную высоту
        document.body.style.height = '100vh';
        document.documentElement.style.height = '100vh';
        
        // Скроллим вверх
        window.scrollTo(0, 0);
        
        // Через небольшой таймаут применяем высоту от Telegram
        setTimeout(() => {
            if (tg.viewportStableHeight) {
                document.body.style.height = tg.viewportStableHeight + 'px';
            }
        }, 50);
    }
    
    // Отслеживаем фокус на полях ввода
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Когда поле получает фокус - запоминаем
        input.addEventListener('focus', function() {
            this.setAttribute('data-focused', 'true');
            
            // Даем время клавиатуре открыться
            setTimeout(() => {
                // Скроллим к полю ввода
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
        
        // Когда поле теряет фокус - принудительно сворачиваем клавиатуру
        input.addEventListener('blur', function() {
            this.removeAttribute('data-focused');
            
            // Пробуем разные способы свернуть клавиатуру
            this.blur(); // Убираем фокус
            
            // Принудительно убираем активный элемент
            if (document.activeElement && document.activeElement.tagName === 'INPUT') {
                document.activeElement.blur();
            }
            
            // Сбрасываем высоту
            forceResetHeight();
            
            // Дополнительный фикс для Telegram
            if (tg.expand) {
                tg.expand(); // Разворачиваем обратно
            }
        });
    });
    
    // Слушаем изменения размера окна (клавиатура меняет размер)
    if (window.visualViewport) {
        let lastHeight = window.visualViewport.height;
        
        window.visualViewport.addEventListener('resize', function() {
            const newHeight = window.visualViewport.height;
            const heightDiff = Math.abs(newHeight - lastHeight);
            
            // Если высота увеличилась (клавиатура закрылась)
            if (newHeight > lastHeight && heightDiff > 100) {
                // Убираем фокус со всех полей
                if (document.activeElement && 
                    (document.activeElement.tagName === 'INPUT' || 
                     document.activeElement.tagName === 'TEXTAREA')) {
                    document.activeElement.blur();
                }
                
                // Восстанавливаем высоту
                setTimeout(() => {
                    document.body.style.height = '100vh';
                    window.scrollTo(0, 0);
                    
                    if (tg.expand) tg.expand();
                }, 100);
            }
            
            lastHeight = newHeight;
        });
    }
    
    // Обработка касания вне поля ввода
    document.addEventListener('touchstart', function(e) {
        // Если кликнули не на input и не на textarea
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            // Проверяем, есть ли активное поле ввода
            const activeInput = document.querySelector('input:focus, textarea:focus');
            if (activeInput) {
                activeInput.blur(); // Убираем фокус
                
                // Принудительно скрываем клавиатуру
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    if (tg.expand) tg.expand();
                }, 50);
            }
        }
    });
    
    // Фикс для кнопки "Готово" (Return/Done)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === 'Done' || e.keyCode === 13) {
            const activeInput = document.querySelector('input:focus, textarea:focus');
            if (activeInput) {
                setTimeout(() => {
                    activeInput.blur();
                    forceResetHeight();
                }, 100);
            }
        }
    });
})();
// Принудительно убираем скролл на первом экране
document.addEventListener('DOMContentLoaded', function() {
    // Блокируем любые попытки скролла на первом экране
    const screen1 = document.querySelector('.screen-1');
    if (screen1) {
        screen1.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }
    
    // Адаптация под разные экраны
    function adjustForScreen() {
        const groups = document.querySelectorAll('.settings-group');
        const totalHeight = Array.from(groups).reduce((sum, group) => sum + group.offsetHeight, 0);
        const startBtn = document.querySelector('.start-btn');
        const screenHeight = window.innerHeight - 90; // 70px header + 20px padding
        
        // Если контент не помещается - уменьшаем отступы
        if (totalHeight + 60 > screenHeight) {
            groups.forEach(group => {
                group.style.padding = '10px';
                group.style.marginBottom = '10px';
            });
        }
    }
    
    setTimeout(adjustForScreen, 100);
});
// ===== ЭКРАН 3: КОЛЕСО - ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ =====
const wheel1_s3 = document.getElementById('wheel1_s3');
const spinBtn1_s3 = document.getElementById('spinBtn1_s3');
const result1_s3 = document.getElementById('result1_s3');
const result2_s3 = document.getElementById('result2_s3');
const wheelContainer1_s3 = document.getElementById('wheelContainer1_s3');
const resultContainer1_s3 = document.getElementById('resultContainer1_s3');
const resultContainer2_s3 = document.getElementById('resultContainer2_s3');
const restartSection_s3 = document.getElementById('restartSection_s3');
const restartBtn_s3 = document.getElementById('restartBtn_s3');

if (spinBtn1_s3) spinBtn1_s3.textContent = 'Загадать';

let currentFigure_s3 = null;
let currentTrick_s3 = null;

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let gameState = {
    difficulty: 'easy',
    players: [],
    currentPlayerIndex: 0,
    selectedCount: 1,
    selectedFigures: [],
    selectedRounds: 5,
    currentRound: 1,
    maxRounds: 5
};

let playerResults = [];
let playerFails = [];
let gameWinner = null;

// ===== СПИСКИ ТРЮКОВ ДЛЯ РАЗНЫХ ФИГУР =====
const tricksByFigure = {
    'Флэт': [
        'Frontside Flip', 'Backside Flip', 'Frontside Heelflip', 'Backside Heelflip',
        'Impossible', 'Varial Kickflip', 'Varial Heelflip', 'Inward Heelflip',
        'Hardflip', '360 Flip', '360 Shove-it', 'Frontside 360 Shove-it',
        'Backside 360 Shove-it', 'Frontside Bigspin', 'Backside Bigspin',
        'Frontside Bigspin Flip', 'Backside Bigspin Flip',
        'Fakie Frontside Flip', 'Fakie Backside Flip', 'Fakie Frontside Heelflip',
        'Fakie Backside Heelflip', 'Fakie Impossible', 'Fakie Varial Kickflip',
        'Fakie Varial Heelflip', 'Fakie Inward Heelflip', 'Fakie Hardflip',
        'Fakie 360 Flip', 'Fakie 360 Shove-it', 'Fakie Frontside 360 Shove-it',
        'Fakie Backside 360 Shove-it', 'Fakie Frontside Bigspin',
        'Fakie Backside Bigspin', 'Fakie Frontside Bigspin Flip',
        'Fakie Backside Bigspin Flip',
        'Nollie Frontside Flip', 'Nollie Backside Flip', 'Nollie Frontside Heelflip',
        'Nollie Backside Heelflip', 'Nollie Impossible', 'Nollie Varial Kickflip',
        'Nollie Varial Heelflip', 'Nollie Inward Heelflip', 'Nollie Hardflip',
        'Nollie 360 Flip', 'Nollie 360 Shove-it', 'Nollie Frontside 360 Shove-it',
        'Nollie Backside 360 Shove-it', 'Nollie Frontside Bigspin',
        'Nollie Backside Bigspin', 'Nollie Frontside Bigspin Flip',
        'Nollie Backside Bigspin Flip',
        'Switch Frontside Flip', 'Switch Backside Flip', 'Switch Frontside Heelflip',
        'Switch Backside Heelflip', 'Switch Impossible', 'Switch Varial Kickflip',
        'Switch Varial Heelflip', 'Switch Inward Heelflip', 'Switch Hardflip',
        'Switch 360 Flip', 'Switch 360 Shove-it', 'Switch Frontside 360 Shove-it',
        'Switch Backside 360 Shove-it', 'Switch Frontside Bigspin',
        'Switch Backside Bigspin', 'Switch Frontside Bigspin Flip',
        'Switch Backside Bigspin Flip'
    ],
    'Гробик': [
        'Frontside 50-50', 'Backside 50-50', 'Frontside Boardslide',
        'Backside Boardslide', 'Frontside Lipslide', 'Backside Lipslide',
        'Frontside Noseslide', 'Backside Noseslide', 'Frontside Tailslide',
        'Backside Tailslide', 'Frontside Smith', 'Backside Smith',
        'Frontside Feeble', 'Backside Feeble', 'Frontside Crooked',
        'Backside Crooked', 'Frontside Overcrook', 'Backside Overcrook',
        'Fakie Frontside 50-50', 'Fakie Backside 50-50',
        'Fakie Frontside Boardslide', 'Fakie Backside Boardslide',
        'Fakie Frontside Lipslide', 'Fakie Backside Lipslide',
        'Fakie Frontside Noseslide', 'Fakie Backside Noseslide',
        'Fakie Frontside Tailslide', 'Fakie Backside Tailslide',
        'Fakie Frontside Smith', 'Fakie Backside Smith',
        'Fakie Frontside Feeble', 'Fakie Backside Feeble',
        'Nollie Frontside 50-50', 'Nollie Backside 50-50',
        'Nollie Frontside Noseslide', 'Nollie Backside Noseslide',
        'Nollie Frontside Tailslide', 'Nollie Backside Tailslide',
        'Nollie Frontside Boardslide', 'Nollie Backside Boardslide',
        'Nollie Frontside 5-0', 'Nollie Backside 5-0',
        'Nollie Frontside Nose Grind', 'Nollie Backside Nose Grind',
        'Switch Frontside 50-50', 'Switch Backside 50-50',
        'Switch Frontside Boardslide', 'Switch Backside Boardslide',
        'Switch Frontside Lipslide', 'Switch Backside Lipslide',
        'Switch Frontside Noseslide', 'Switch Backside Noseslide',
        'Switch Frontside Tailslide', 'Switch Backside Tailslide',
        'Switch Frontside Smith', 'Switch Backside Smith',
        'Switch Frontside Crooked', 'Switch Backside Crooked'
    ],
    'Радиус': [
        'Frontside Axle', 'Backside Axle', 'Frontside Nose', 'Backside Nose',
        'Frontside Tail', 'Backside Tail', 'Frontside Blunt', 'Backside Blunt',
        'Frontside 50-50', 'Backside 50-50', 'Frontside Smith', 'Backside Smith',
        'Frontside Feeble', 'Backside Feeble', 'Frontside Overcrook', 'Backside Overcrook',
        'Fakie Axle', 'Fakie Nose', 'Fakie Tail', 'Fakie 50-50', 'Fakie 5-0',
        'Fakie Smith', 'Fakie Feeble',
        'Nollie Axle', 'Nollie Nose', 'Nollie Tail', 'Nollie 50-50', 'Nollie 5-0',
        'Switch Axle', 'Switch Nose', 'Switch 50-50', 'Switch Smith',
        'Disaster', 'Frontside Disaster', 'Backside Disaster',
        'Fakie Disaster', 'Nollie Disaster', 'Switch Disaster'
    ]
};

const figureToTrickMap = {
    'Флэт': 'Флэт',
    'Кикер': 'Флэт',
    'Дроп': 'Флэт',
    'Рейл': 'Гробик',
    'Гробик': 'Гробик',
    'Радиус': 'Радиус'
};

// ===== ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ =====
function showScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelector(`.screen-${screenNumber}`).classList.add('active');
    
    // Управление видимостью кнопки "Назад"
    if (screenNumber === 2) {
        showBackButton();
    } else {
        hideBackButton();
    }
    
    // Управление видимостью кнопки "Домой" в хедере
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        // Показываем на экранах 3 и выше, скрываем на 1 и 2
        if (screenNumber >= 3) {
            homeBtn.classList.remove('hidden');
        } else {
            homeBtn.classList.add('hidden');
        }
    }
}

// ===== ЭКРАН 1: НАСТРОЙКИ =====
const playerCountBtns = document.querySelectorAll('.player-count-btn');
let selectedPlayerCount = 1;

playerCountBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        playerCountBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedPlayerCount = parseInt(this.dataset.count);
        gameState.selectedCount = selectedPlayerCount;
        
        // Проверяем, можно ли активировать кнопку старта
        updateStartButtonState();
    });
});

const difficultyBtns = document.querySelectorAll('.difficulty-btn');
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        gameState.difficulty = this.dataset.difficulty;
    });
});

// ===== ФИГУРЫ - ИЗНАЧАЛЬНО НИЧЕГО НЕ ВЫБРАНО =====
const figureBtns = document.querySelectorAll('.figure-btn');
let selectedFigures = [];

// Убираем active со всех кнопок фигур
figureBtns.forEach(btn => {
    btn.classList.remove('active');
});

figureBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        selectedFigures = [];
        document.querySelectorAll('.figure-btn.active').forEach(activeBtn => {
            selectedFigures.push(activeBtn.dataset.figure);
        });
        
        gameState.selectedFigures = selectedFigures;
        
        // Проверяем, можно ли активировать кнопку старта
        updateStartButtonState();
    });
});

const roundBtns = document.querySelectorAll('.round-btn');
let selectedRounds = 5;

// Убираем active со всех кнопок раундов
roundBtns.forEach(btn => {
    btn.classList.remove('active');
});

roundBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        roundBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedRounds = parseInt(this.dataset.rounds);
        gameState.selectedRounds = selectedRounds;
        gameState.maxRounds = selectedRounds;
        
        // Проверяем, можно ли активировать кнопку старта
        updateStartButtonState();
    });
});

// Функция проверки возможности начать игру
function updateStartButtonState() {
    const startBtn = document.getElementById('startGameBtn');
    if (!startBtn) return;
    
    // Проверяем, выбрана ли хотя бы одна фигура И выбран ли хотя бы один игрок
    const isPlayerSelected = document.querySelector('.player-count-btn.active') !== null;
    
    if (selectedFigures.length === 0 || !isPlayerSelected) {
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        startBtn.style.cursor = 'not-allowed';
    } else {
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        startBtn.style.cursor = 'pointer';
    }
}

document.getElementById('startGameBtn').addEventListener('click', function() {
    // Проверяем, выбраны ли фигуры
    if (selectedFigures.length === 0) {
        alert('Выберите хотя бы одну фигуру!');
        return;
    }
    
    // Проверяем, выбрано ли количество игроков
    const isPlayerSelected = document.querySelector('.player-count-btn.active') !== null;
    if (!isPlayerSelected) {
        alert('Выберите количество игроков!');
        return;
    }
    
    const difficultyBtn = document.querySelector('.difficulty-btn.active');
    const difficulty = difficultyBtn ? difficultyBtn.dataset.difficulty : 'easy';
    
    gameState.difficulty = difficulty;
    gameState.maxRounds = selectedRounds;
    gameState.selectedRounds = selectedRounds;
    
    if (selectedPlayerCount === 1) {
        gameState.players = ['Скейтер 1'];
        startGameWithPlayers();
    } else {
        generatePlayerInputs(selectedPlayerCount);
        showScreen(2);
    }
});

// Вызываем при загрузке
updateStartButtonState();

// ===== ЭКРАН 2: ВВОД ИМЁН =====
function generatePlayerInputs(count) {
    const list = document.getElementById('playersInputList');
    if (!list) return;
    list.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const group = document.createElement('div');
        group.className = 'player-input-group';
        const label = document.createElement('span');
        label.className = 'player-input-label';
        label.textContent = `Скейтер ${i}`;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'player-input-field';
        input.placeholder = `Имя скейтера ${i}`;
        input.id = `playerName${i}`;
        group.appendChild(label);
        group.appendChild(input);
        list.appendChild(group);
    }
}

document.getElementById('readyBtn').addEventListener('click', function() {
    const players = [];
    for (let i = 1; i <= selectedPlayerCount; i++) {
        const input = document.getElementById(`playerName${i}`);
        const name = input ? input.value.trim() : '';
        players.push(name || `Скейтер ${i}`);
    }
    gameState.players = players;
    startGameWithPlayers();
});

// ===== ЭКРАН 3: ЗАПУСК ИГРЫ =====
function startGameWithPlayers() {
    gameState.currentPlayerIndex = 0;
    gameState.currentRound = 1;
    gameWinner = null;
    
    // Скрываем кнопки действий
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    const redoBtn = document.getElementById('redoBtn_s3');
    if (doneBtn) doneBtn.style.display = 'none';
    if (failBtn) failBtn.style.display = 'none';
    if (redoBtn) redoBtn.style.display = 'none';
    
    // Возвращаем кнопке "Загадать" исходный текст и обработчик
    if (spinBtn1_s3) {
        spinBtn1_s3.textContent = 'Загадать';
        spinBtn1_s3.style.display = 'block';
        spinBtn1_s3.disabled = false;
        spinBtn1_s3.removeEventListener('click', resetGame);
        spinBtn1_s3.addEventListener('click', spinWheel1_s3);
    }
    
    // Скрываем сообщение о победителе
    const winnerMessage = document.getElementById('winnerMessage');
    if (winnerMessage) {
        winnerMessage.classList.add('hidden');
        winnerMessage.innerHTML = '';
    }
    
    // Инициализируем массивы
    playerResults = [];
    for (let r = 0; r <= gameState.maxRounds; r++) {
        playerResults[r] = [];
        for (let p = 0; p < gameState.players.length; p++) {
            playerResults[r][p] = 'wait';
        }
    }
    playerFails = new Array(gameState.players.length).fill(0);
    
    updateGameDisplay();
    showScreen(3);
}

function updateGameDisplay() {
    const levelBadges = document.querySelectorAll('.level-badge');
    if (levelBadges.length > 0) {
        const difficultyText = gameState.difficulty === 'easy' ? 'Легко' : 
                              gameState.difficulty === 'medium' ? 'Средне' : 'Сложно';
        levelBadges.forEach(badge => {
            badge.textContent = `Сложность: ${difficultyText}`;
        });
    }
    updateRoundDisplay();
    updatePlayerInfo();
    updateFailsDisplay();
}

function updateRoundDisplay() {
    const roundElements = document.querySelectorAll('.round-badge, .round-counter');
    roundElements.forEach(el => {
        el.textContent = `Раунд ${gameState.currentRound} из ${gameState.maxRounds}`;
    });
}

function updatePlayerInfo() {
    const playerNameElement = document.getElementById('currentPlayerName');
    if (playerNameElement && gameState.players.length > 0) {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        if (gameState.players.length === 1) {
            playerNameElement.textContent = `${currentPlayer}`;
        } else {
            playerNameElement.textContent = `${currentPlayer}`;
        }
    }
}

function updateFailsDisplay() {
    const failsContainer = document.getElementById('failsContainer');
    if (!failsContainer) return;
    failsContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const failCount = playerFails[index] || 0;
        const isEliminated = failCount >= gameState.maxRounds;
        const failItem = document.createElement('div');
        failItem.className = `fail-item ${isEliminated ? 'eliminated' : ''}`;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'fail-player-name';
        nameSpan.textContent = player;
        const countSpan = document.createElement('span');
        countSpan.className = 'fail-count';
        countSpan.textContent = `${failCount}/${gameState.maxRounds}`;
        
        if (isEliminated) {
            const eliminatedSpan = document.createElement('span');
            eliminatedSpan.className = 'eliminated-badge';
            
            failItem.appendChild(nameSpan);
            
            failItem.appendChild(eliminatedSpan);
        } else {
            failItem.appendChild(nameSpan);
            failItem.appendChild(countSpan);
        }
        failsContainer.appendChild(failItem);
    });
}

function isPlayerEliminated(playerIndex) {
    return playerFails[playerIndex] >= gameState.maxRounds;
}

function getActivePlayersCount() {
    let count = 0;
    for (let i = 0; i < gameState.players.length; i++) {
        if (!isPlayerEliminated(i)) count++;
    }
    return count;
}

function checkWinner() {
    if (gameWinner) return true;
    
    const activeCount = getActivePlayersCount();
    if (activeCount === 1) {
        for (let i = 0; i < gameState.players.length; i++) {
            if (!isPlayerEliminated(i)) {
                gameWinner = gameState.players[i];
                showWinnerMode();
                return true;
            }
        }
    }
    return false;
}

// Функция проверки проигрыша для одного игрока
function checkSinglePlayerLoss() {
    if (gameState.players.length === 1 && playerFails[0] >= gameState.maxRounds) {
        gameWinner = gameState.players[0] + ' (проиграл)';
        showWinnerMode();
        return true;
    }
    return false;
}

function showWinnerMode() {
    if (spinBtn1_s3) {
        spinBtn1_s3.textContent = 'Начать заново';
        spinBtn1_s3.style.display = 'block';
        spinBtn1_s3.disabled = false;
        spinBtn1_s3.removeEventListener('click', spinWheel1_s3);
        spinBtn1_s3.addEventListener('click', resetGame);
    }
    
    if (wheelContainer1_s3) wheelContainer1_s3.classList.add('hidden');
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    const redoBtn = document.getElementById('redoBtn_s3');
    if (doneBtn) doneBtn.style.display = 'none';
    if (failBtn) failBtn.style.display = 'none';
    if (redoBtn) redoBtn.style.display = 'none';
    
    const winnerMessage = document.getElementById('winnerMessage');
    if (winnerMessage) {
        // Определяем сообщение в зависимости от результата
        let messageText = '';
        if (gameWinner && gameWinner.includes('проиграл')) {
            messageText = `
                <div class="winner-display lose">
                    <span class="winner-trophy">😢</span>
                    <span class="winner-name">${gameWinner.replace(' (проиграл)', '')}</span>
                    <span class="winner-label">ПРОИГРАЛ</span>
                </div>
            `;
        } else {
            messageText = `
                <div class="winner-display">
                    <span class="winner-trophy">🏆</span>
                    <span class="winner-name">${gameWinner}</span>
                    <span class="winner-label">ПОБЕДИТЕЛЬ</span>
                </div>
            `;
        }
        winnerMessage.innerHTML = messageText;
        winnerMessage.classList.remove('hidden');
    }
}

// ===== ЭКРАН 3: КОЛЕСО - ФУНКЦИИ =====
function spinWheel1_s3() {
    if (gameWinner) {
        resetGame();
        return;
    }
    
    // Проверяем проигрыш для одного игрока
    if (checkSinglePlayerLoss()) return;
    
    if (gameState.players.length === 1 && isPlayerEliminated(0)) {
        alert(`${gameState.players[0]} набрал ${gameState.maxRounds} фейлов!`);
        checkWinner();
        return;
    }
    
    if (isPlayerEliminated(gameState.currentPlayerIndex)) {
        alert(`${gameState.players[gameState.currentPlayerIndex]} выбыл из игры!`);
        nextPlayer();
        return;
    }
    
    if (!gameState.selectedFigures || gameState.selectedFigures.length === 0) {
        alert('Сначала выберите фигуры в настройках!');
        return;
    }
    
    spinBtn1_s3.disabled = true;
    spinBtn1_s3.style.display = 'none';
    
    wheelContainer1_s3.classList.remove('hidden');
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    const winnerMessage = document.getElementById('winnerMessage');
    if (winnerMessage) winnerMessage.classList.add('hidden');
    
    result1_s3.classList.remove('active');
    result2_s3.classList.remove('active');
    
    wheel1_s3.style.transition = 'none';
    wheel1_s3.style.transform = 'rotate(0deg)';
    
    setTimeout(() => {
        wheel1_s3.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
        const spins = 5 + Math.floor(Math.random() * 3);
        const stopAngle = spins * 360 + Math.floor(Math.random() * 360);
        wheel1_s3.style.transform = `rotate(${stopAngle}deg)`;
        
        setTimeout(() => {
            const randomFigureIndex = Math.floor(Math.random() * gameState.selectedFigures.length);
            currentFigure_s3 = gameState.selectedFigures[randomFigureIndex];
            const trickListKey = figureToTrickMap[currentFigure_s3] || currentFigure_s3;
            
            if (tricksByFigure[trickListKey]) {
                const tricks = tricksByFigure[trickListKey];
                const randomTrickIndex = Math.floor(Math.random() * tricks.length);
                currentTrick_s3 = tricks[randomTrickIndex];
            } else {
                currentTrick_s3 = 'Нет трюков';
            }
            
            const figureText = result1_s3.querySelector('.result-text');
            if (figureText) figureText.textContent = currentFigure_s3;
            result1_s3.classList.add('active');
            resultContainer1_s3.classList.remove('hidden');
            
            const trickText = result2_s3.querySelector('.result-text');
            if (trickText) trickText.textContent = currentTrick_s3;
            result2_s3.classList.add('active');
            resultContainer2_s3.classList.remove('hidden');
            
            wheelContainer1_s3.classList.add('hidden');
            spinBtn1_s3.disabled = false;
            restartSection_s3.classList.remove('hidden');
            
            const doneBtn = document.getElementById('doneBtn_s3');
            const failBtn = document.getElementById('failBtn_s3');
            const redoBtn = document.getElementById('redoBtn_s3');
            if (doneBtn) doneBtn.style.display = 'inline-block';
            if (failBtn) failBtn.style.display = 'inline-block';
            if (redoBtn) redoBtn.style.display = 'inline-block';
            
        }, 3000);
    }, 50);
}

function restartGame_s3() {
    wheel1_s3.style.transition = 'none';
    wheel1_s3.style.transform = 'rotate(0deg)';
    
    const resultText1 = result1_s3.querySelector('.result-text');
    if (resultText1) resultText1.textContent = '';
    result1_s3.classList.remove('active');
    
    const resultText2 = result2_s3.querySelector('.result-text');
    if (resultText2) resultText2.textContent = '';
    result2_s3.classList.remove('active');
    
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    
    currentFigure_s3 = null;
    currentTrick_s3 = null;
    
    wheelContainer1_s3.classList.remove('hidden');
    spinBtn1_s3.style.display = 'block';
    spinBtn1_s3.disabled = false;
    
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    const redoBtn = document.getElementById('redoBtn_s3');
    if (doneBtn) doneBtn.style.display = 'none';
    if (failBtn) failBtn.style.display = 'none';
    if (redoBtn) redoBtn.style.display = 'none';
}

if (spinBtn1_s3) spinBtn1_s3.addEventListener('click', spinWheel1_s3);
if (restartBtn_s3) restartBtn_s3.addEventListener('click', restartGame_s3);

// ===== ФУНКЦИИ ПЕРЕХОДА =====
function nextPlayer() {
    if (gameState.players.length === 1) {
        restartGame_s3();
        showScreen(3);
        return;
    }
    
    if (checkWinner()) return;
    
    let nextPlayerIndex = gameState.currentPlayerIndex + 1;
    
    while (nextPlayerIndex < gameState.players.length && isPlayerEliminated(nextPlayerIndex)) {
        nextPlayerIndex++;
    }
    
    if (nextPlayerIndex < gameState.players.length) {
        gameState.currentPlayerIndex = nextPlayerIndex;
        updatePlayerInfo();
        restartGame_s3();
        showScreen(3);
    } else {
        nextRound();
    }
}

function nextRound() {
    if (gameState.players.length === 1) {
        restartGame_s3();
        showScreen(3);
        return;
    }
    
    gameState.currentPlayerIndex = 0;
    while (gameState.currentPlayerIndex < gameState.players.length && 
           isPlayerEliminated(gameState.currentPlayerIndex)) {
        gameState.currentPlayerIndex++;
    }
    
    gameState.currentRound++;
    
    if (gameState.currentRound <= gameState.maxRounds) {
        if (checkWinner()) return;
        
        const activePlayersLeft = getActivePlayersCount() > 0;
        if (!activePlayersLeft) {
            gameWinner = 'Никто';
            showWinnerMode();
            return;
        }
        updateRoundDisplay();
        updatePlayerInfo();
        restartGame_s3();
        showScreen(3);
    } else {
        determineWinnerByScore();
    }
}

function determineWinnerByScore() {
    if (gameState.players.length === 1) {
        gameWinner = gameState.players[0];
        showWinnerMode();
        return;
    }
    
    let scores = [];
    gameState.players.forEach((player, index) => {
        if (!isPlayerEliminated(index)) {
            let score = 0;
            for (let round = 1; round <= gameState.maxRounds; round++) {
                if (playerResults[round] && playerResults[round][index] === 'done') {
                    score++;
                }
            }
            scores.push({ name: player, score: score, index: index });
        }
    });
    
    if (scores.length === 0) {
        gameWinner = 'Никто';
    } else {
        scores.sort((a, b) => b.score - a.score);
        gameWinner = scores[0].name;
    }
    
    showWinnerMode();
}

// ===== КНОПКИ ДЕЙСТВИЙ =====
document.getElementById('doneBtn_s3')?.addEventListener('click', function() {
    if (!gameState || !gameState.players || gameWinner) return;
    
    const player = gameState.currentPlayerIndex;
    
    if (isPlayerEliminated(player)) {
        alert(`${gameState.players[player]} уже выбыл!`);
        nextPlayer();
        return;
    }
    
    const round = gameState.currentRound;
    if (!playerResults[round]) playerResults[round] = [];
    playerResults[round][player] = 'done';
    
    nextPlayer();
});

document.getElementById('failBtn_s3')?.addEventListener('click', function() {
    if (!gameState || !gameState.players || gameWinner) return;
    
    const player = gameState.currentPlayerIndex;
    
    if (isPlayerEliminated(player)) {
        alert(`${gameState.players[player]} уже выбыл!`);
        nextPlayer();
        return;
    }
    
    const round = gameState.currentRound;
    if (!playerResults[round]) playerResults[round] = [];
    playerResults[round][player] = 'fail';
    
    playerFails[player] = (playerFails[player] || 0) + 1;
    updateFailsDisplay();
    
    // Проверяем проигрыш для одного игрока после добавления фейла
    if (gameState.players.length === 1 && playerFails[player] >= gameState.maxRounds) {
        gameWinner = gameState.players[player] + ' (проиграл)';
        showWinnerMode();
        return;
    }
    
    if (playerFails[player] >= gameState.maxRounds) {
        alert(`${gameState.players[player]} ВЫБЫЛ!`);
    }
    
    nextPlayer();
});

document.getElementById('redoBtn_s3')?.addEventListener('click', function() {
    if (gameWinner) return;
    spinWheel1_s3();
});

// ===== СБРОС ИГРЫ =====
function resetGame() {
    if (spinBtn1_s3) {
        spinBtn1_s3.removeEventListener('click', resetGame);
        spinBtn1_s3.addEventListener('click', spinWheel1_s3);
        spinBtn1_s3.textContent = 'Загадать';
    }
    
    playerResults = [];
    playerFails = [];
    gameState.currentPlayerIndex = 0;
    gameState.currentRound = 1;
    gameWinner = null;
    
    const winnerMessage = document.getElementById('winnerMessage');
    if (winnerMessage) {
        winnerMessage.classList.add('hidden');
        winnerMessage.innerHTML = '';
    }
    
    showScreen(1);
}

// ===== КНОПКА НАЗАД =====
const backBtn = document.getElementById('backBtn');

function showBackButton() {
    if (backBtn) backBtn.classList.remove('hidden');
}

function hideBackButton() {
    if (backBtn) backBtn.classList.add('hidden');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            resetGame();
            showScreen(1);
        });
    }
    
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            resetGame();
            showScreen(1);
        });
    }
    
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    const redoBtn = document.getElementById('redoBtn_s3');
    if (doneBtn) doneBtn.style.display = 'none';
    if (failBtn) failBtn.style.display = 'none';
    if (redoBtn) redoBtn.style.display = 'none';
});

window.resetGame = resetGame;
// Блокировка скролла в Telegram Mini App
function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

// Блокируем все возможные события скролла
document.addEventListener('touchmove', preventScroll, { passive: false });
document.addEventListener('wheel', preventScroll, { passive: false });
document.addEventListener('scroll', preventScroll, { passive: false });