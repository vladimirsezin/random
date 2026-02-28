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
    difficulties: ['easy'], // ИЗМЕНЕНО: теперь массив, по умолчанию легкие
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
const tricksByDifficulty = {
    // ФЛЭТ - трюки на плоской поверхности
    'Флэт': {
        easy: [
            'ollie', 'sw ollie', 'fakie ollie', 'nollie', 'ollie north',
            'fs 180', 'sw fs 180', 'fakie fs 180', 'nollie fs 180',
            'bs 180', 'sw bs 180', 'fakie bs 180', 'nollie bs 180',
            'pop shove it', 'fakie pop shove it', 'nollie pop shove it', 'sw pop shove it',
            'fs shove it', 'sw fs shove it', 'fakie fs shove it', 'nollie fs shove it',
            'kickflip', 'fakie kickflip', 'heelflip', 'fakie heel flip',
            'fakie varial flip', 'fakie 360 pop shove it', 'nollie 360 pop shove it'
        ],
        medium: [
            'nollie kickflip', 'nollie heelflip', 'sw kickflip', 'sw heelflip',
            'bs big spin', 'sw bs bigspin', 'fs big spin', 'fakie fs big spin', 'nollie fs bigspin',
            'varial flip', 'sw varial flip', 'nollie varial flip',
            'varial heel', 'fakie varial heel',
            'fakie 360 shove it', 'nollie fs 360 shove it',
            'fs flip', 'fakie fs flip', 'bs flip', 'fakie bs flip',
            'fs heel', 'fakie fs heel', 'bs heel', 'fakie bs heel',
            'hardflip', 'fakie hardflip', 'inward heel', 'fakie inward',
            '360 flip', 'fakie 360 flip', 'fakie bigflip',
            'fakie biggerspin', 'impossible', 'fakie impossible', 'fake bs 360'
        ],
        hard: [
            'sw varial heel', 'nollie varial heel',
            '360 pop shove it', 'sw 360 pop shove it', 'fs 360 shove it', 'sw fs 360 shove it',
            'sw fs flip', 'nollie fs flip', 'sw bs flip', 'nollie bs flip',
            'sw fs heel', 'nollie fs heel', 'sw bs heel', 'nollie bs heel',
            'sw hardflip', 'nollie hardflip', 'sw inward', 'nollie inward',
            'sw 360 flip', 'nollie 360 flip', 'big flip', 'sw bigflip', 'nollie bigflip',
            'fakie biggerflip', 'sw impossible', 'nollie impossible',
            'late fs shove it', 'late pop shove it',
            'bs 360', 'nollie bs 360', 'sw bs 360', 'fs 360', 'fakie fs 360', 'nollie fs 360', 'sw fs 360',
            'laser', 'fakie laser', 'sw laser', 'nollie laser'
        ]
    },
    
    // ГРОБИК (рейлы, грайнды)
    'Гробик': {
        easy: [
            'fs 50-50', 'fakie fs 50-50', 'bs 50-50',
            'fs 5-0', 'fs nosegrind',
            'fs boardslide', 'fakie fs boardslide', 'bs boardslide', 'fakie bs boardslide',
            'bs noseslide', 'bs crooked'
        ],
        medium: [
            'fakie bs 50-50', 'fakie fs 5-0', 'nollie fs 5-0', 'bs 5-0', 'fakie bs 5-0',
            'sw fs nosegrind', 'bs nosegrind', 'sw bs boardslide',
            'fs noseslide', 'fakie fs noseslide', 'fakie bs noseslide', 'sw fs noseslide',
            'fs smith', 'bs smith', 'fs feeble', 'bs feeble',
            'fs tail', 'bs tail', 'fs lip', 'bs lip', 'fs crooked'
        ],
        hard: [
            'sw fs 50-50', 'nollie fs 50-50', 'sw bs 50-50', 'nollie bs 50-50',
            'sw fs 5-0', 'nollie fs 5-0', 'sw bs 5-0', 'nollie bs 5-0',
            'fakie fs nosegrind', 'nollie fs nosegrind', 'fakie bs nosegrind',
            'sw bs nosegrind', 'nollie bs nosegrind', 'sw fs boardslide', 'nollie fs boardslide',
            'nollie bs boardslide', 'sw fs noseslide', 'nollie fs noseslide',
            'fakie fs smith', 'sw fs smith', 'nollie fs smith', 'fakie bs smith',
            'sw bs smith', 'nollie bs smith', 'nollie fs feeble', 'fakie fs feeble',
            'sw fs feeble', 'fakie bs feeble', 'sw bs feeble', 'nollie bs feeble',
            'fakie fs tail', 'sw fs tail', 'nollie fs tail', 'fakie bs tail',
            'sw bs tail', 'nollie bs tail', 'fakie fs lip', 'sw fs lip',
            'nollie fs lip', 'fakie bs lip', 'nollie bs lip', 'sw bs lip',
            'fs blunt', 'bs blunt', 'fs noseblunt', 'bs noseblunt'
        ]
    },
    
    // РАДИУС (ramps, transitions)
    'Радиус': {
        easy: [
            'Frontside Axle', 'Backside Axle', 'Frontside Nose', 'Backside Nose',
            'Frontside Tail', 'Backside Tail', 'Frontside 50-50', 'Backside 50-50'
        ],
        medium: [
            'Frontside Smith', 'Backside Smith', 'Frontside Feeble', 'Backside Feeble',
            'Fakie Axle', 'Fakie Nose', 'Fakie Tail', 'Fakie 50-50', 'Fakie 5-0',
            'Nollie Axle', 'Nollie Nose', 'Nollie Tail', 'Nollie 50-50', 'Nollie 5-0',
            'Disaster', 'Frontside Disaster', 'Backside Disaster'
        ],
        hard: [
            'Frontside Blunt', 'Backside Blunt', 'Frontside Overcrook', 'Backside Overcrook',
            'Fakie Smith', 'Fakie Feeble', 'Fakie Disaster',
            'Switch Axle', 'Switch Nose', 'Switch 50-50', 'Switch Smith',
            'Switch Disaster', 'Nollie Disaster'
        ]
    }
};

// Добавляем маппинг для других фигур
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
    // Сначала скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden'); // Добавляем hidden всем
    });
    
    // Показываем нужный экран
    const targetScreen = document.querySelector(`.screen-${screenNumber}`);
    targetScreen.classList.remove('hidden'); // Убираем hidden
    targetScreen.classList.add('active'); // Добавляем active
    
    // Управление видимостью кнопки "Назад"
    if (screenNumber === 2) {
        showBackButton();
    } else {
        hideBackButton();
    }
    
    // Управление видимостью кнопки "Домой" в хедере
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.classList.toggle('hidden', screenNumber < 3);
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

// ИЗМЕНЕНО: теперь мультивыбор для сложности
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
let selectedDifficulties = ['easy']; // по умолчанию только легкие

// Устанавливаем active для легких по умолчанию
difficultyBtns.forEach(btn => {
    if (btn.dataset.difficulty === 'easy') {
        btn.classList.add('active');
    }
});

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        // Собираем выбранные сложности
        selectedDifficulties = [];
        document.querySelectorAll('.difficulty-btn.active').forEach(activeBtn => {
            selectedDifficulties.push(activeBtn.dataset.difficulty);
        });
        
        // Если ничего не выбрано - автоматически выбираем легкие
        if (selectedDifficulties.length === 0) {
            document.querySelector('[data-difficulty="easy"]').classList.add('active');
            selectedDifficulties = ['easy'];
        }
        
        gameState.difficulties = selectedDifficulties;
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

// Устанавливаем active для 5 раундов по умолчанию
roundBtns.forEach(btn => {
    if (btn.dataset.rounds === '5') {
        btn.classList.add('active');
    }
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
    
    gameState.difficulties = selectedDifficulties;
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

// ===== ЭКРАН 2: ПОШАГОВЫЙ ВВОД ИМЁН =====
let currentPlayerStep = 0;
let playerNames = [];
let totalPlayers = 1;

// Функция инициализации пошагового ввода
function initStepInput(count) {
    totalPlayers = count;
    currentPlayerStep = 0;
    playerNames = new Array(count).fill('');
    
    // Обновляем заголовок
    const title = document.getElementById('playerInputTitle');
    if (title) {
        title.textContent = `Скейтер ${currentPlayerStep + 1}`;
    }
    
    // Обновляем номер игрока
    const playerNumber = document.getElementById('playerNumber');
    if (playerNumber) {
        playerNumber.textContent = `${currentPlayerStep + 1} из ${totalPlayers}`;
    }
    
    // Очищаем поле ввода и ставим фокус
    const input = document.getElementById('currentPlayerInput');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
    }
    
    // Обновляем индикатор шагов
    updateStepIndicator();
    
    // Меняем текст кнопки
    const btn = document.getElementById('nextPlayerBtn');
    if (btn) {
        btn.textContent = totalPlayers === 1 ? 'Готово' : 'Далее';
    }
}

// Функция обновления индикатора шагов
function updateStepIndicator() {
    const indicator = document.getElementById('stepIndicator');
    if (!indicator) return;
    
    const steps = indicator.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < totalPlayers) {
            step.style.display = 'flex';
            
            // Обновляем классы
            step.classList.remove('active', 'completed');
            step.textContent = index + 1;
            
            if (index === currentPlayerStep) {
                step.classList.add('active');
            } else if (index < currentPlayerStep) {
                step.classList.add('completed');
                step.textContent = ''; // Убираем цифру, оставляем галочку из CSS
            }
        } else {
            step.style.display = 'none';
        }
    });
}

// Обработчик кнопки "Далее"/"Готово"
document.getElementById('nextPlayerBtn')?.addEventListener('click', function() {
    const input = document.getElementById('currentPlayerInput');
    const name = input.value.trim();
    
    // Сохраняем имя (если пустое - используем "Скейтер N")
    playerNames[currentPlayerStep] = name || `Скейтер ${currentPlayerStep + 1}`;
    
    // Если это последний игрок
    if (currentPlayerStep === totalPlayers - 1) {
        // Завершаем ввод
        gameState.players = playerNames;
        startGameWithPlayers();
    } else {
        // Переходим к следующему игроку
        currentPlayerStep++;
        
        // Обновляем заголовок
        const title = document.getElementById('playerInputTitle');
        if (title) {
            title.textContent = `Скейтер ${currentPlayerStep + 1}`;
        }
        
        // Обновляем номер игрока
        const playerNumber = document.getElementById('playerNumber');
        if (playerNumber) {
            playerNumber.textContent = `${currentPlayerStep + 1} из ${totalPlayers}`;
        }
        
        // Очищаем поле и фокус
        input.value = '';
        input.focus();
        
        // Обновляем индикатор
        updateStepIndicator();
        
        // Если это предпоследний игрок, меняем текст кнопки
        const btn = document.getElementById('nextPlayerBtn');
        if (btn && currentPlayerStep === totalPlayers - 1) {
            btn.textContent = 'Готово';
        }
    }
});

// Обработка нажатия Enter в поле ввода
document.getElementById('currentPlayerInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('nextPlayerBtn').click();
    }
});

// Обновляем функцию generatePlayerInputs
function generatePlayerInputs(count) {
    initStepInput(count);
}

// ===== ЭКРАН 3: ЗАПУСК ИГРЫ =====
function startGameWithPlayers() {
    gameState.currentPlayerIndex = 0;
    gameState.currentRound = 1;
    gameWinner = null;
    
    // Скрываем кнопки действий (они по умолчанию hidden)
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    const redoBtn = document.getElementById('redoBtn_s3');
    if (doneBtn) {
        doneBtn.classList.add('hidden');
        doneBtn.style.display = ''; // сбрасываем inline-стили
    }
    if (failBtn) {
        failBtn.classList.add('hidden');
        failBtn.style.display = '';
    }
    if (redoBtn) {
        redoBtn.classList.add('hidden');
        redoBtn.style.display = '';
    }
    
    // Скрываем колесо
    if (wheelContainer1_s3) {
        wheelContainer1_s3.classList.add('hidden');
    }
    
    // Скрываем результаты
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    // Показываем кнопку "Загадать"
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
// ИЗМЕНЕНО: функция отображения сложности
function updateGameDisplay() {
    const levelBadges = document.querySelectorAll('.level-badge');
    if (levelBadges.length > 0) {
        // Преобразуем массив сложностей в читаемый текст
        const difficultyMap = {
            'easy': 'Легкие',
            'medium': 'Средние',
            'hard': 'Сложные'
        };
        
        let difficultyText = '';
        if (gameState.difficulties.length === 3) {
            difficultyText = 'Сложность: Все уровни';
        } else {
            const difficultyNames = gameState.difficulties.map(d => difficultyMap[d]).join(', ');
            difficultyText = `Сложность: ${difficultyNames}`;
        }
        
        levelBadges.forEach(badge => {
            badge.textContent = difficultyText;
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
    
    const playerCount = gameState.players.length;
    
    // Устанавливаем атрибут для CSS
    failsContainer.setAttribute('data-players', playerCount);
    
    gameState.players.forEach((player, index) => {
        const failCount = playerFails[index] || 0;
        const isEliminated = failCount >= gameState.maxRounds;
        
        const failItem = document.createElement('div');
        failItem.className = `fail-item ${isEliminated ? 'eliminated' : ''}`;
        
        // Первая буква имени (заглавная)
        const initial = player.charAt(0).toUpperCase();
        
        failItem.innerHTML = `
            <span class="fail-initial">${initial}</span>
            <span class="fail-count">${failCount}/${gameState.maxRounds}</span>
            <span class="fail-fullname">${player}</span>
        `;
        
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
    
    // Скрываем все лишнее
    if (wheelContainer1_s3) wheelContainer1_s3.classList.add('hidden');
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    if (doneBtn) {
        doneBtn.classList.add('hidden');
        doneBtn.style.display = '';
    }
    if (failBtn) {
        failBtn.classList.add('hidden');
        failBtn.style.display = '';
    }
    
    const winnerMessage = document.getElementById('winnerMessage');
    if (winnerMessage) {
        let messageText = '';
        if (gameWinner && gameWinner.includes('проиграл')) {
            const name = gameWinner.replace(' (проиграл)', '');
            messageText = `
                <div class="winner-display lose">
                    <span class="winner-trophy">😢</span>
                    <span class="winner-name">${name}</span>
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
// ИЗМЕНЕНО: теперь собирает трюки из всех выбранных уровней сложности
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
    
    // ПОКАЗЫВАЕМ КОЛЕСО
    wheelContainer1_s3.classList.remove('hidden');
    
    // Скрываем результаты (если были показаны ранее)
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
        wheel1_s3.style.transition = 'transform 6s cubic-bezier(0.2, 0.8, 0.3, 1)';
        const spins = 5 + Math.floor(Math.random() * 4);
        const stopAngle = spins * 360 + Math.floor(Math.random() * 360);
        wheel1_s3.style.transform = `rotate(${stopAngle}deg)`;
        
        setTimeout(() => {
            // Выбираем случайную фигуру из выбранных
            const randomFigureIndex = Math.floor(Math.random() * gameState.selectedFigures.length);
            currentFigure_s3 = gameState.selectedFigures[randomFigureIndex];
            
            // Получаем ключ для поиска трюков
            const trickListKey = figureToTrickMap[currentFigure_s3] || currentFigure_s3;
            
            // Собираем трюки из всех выбранных уровней сложности
            let availableTricks = [];
            
            if (tricksByDifficulty[trickListKey]) {
                gameState.difficulties.forEach(difficulty => {
                    if (tricksByDifficulty[trickListKey][difficulty]) {
                        availableTricks = [
                            ...availableTricks, 
                            ...tricksByDifficulty[trickListKey][difficulty]
                        ];
                    }
                });
            }
            
            availableTricks = [...new Set(availableTricks)];
            
            if (availableTricks.length > 0) {
                const randomTrickIndex = Math.floor(Math.random() * availableTricks.length);
                currentTrick_s3 = availableTricks[randomTrickIndex];
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
            
            // Скрываем колесо после показа результатов
            wheelContainer1_s3.classList.add('hidden');
            spinBtn1_s3.disabled = false;
            restartSection_s3.classList.remove('hidden');
            
            // ПОКАЗЫВАЕМ КНОПКИ ДЕЙСТВИЙ
            const doneBtn = document.getElementById('doneBtn_s3');
            const failBtn = document.getElementById('failBtn_s3');
            if (doneBtn) {
                doneBtn.classList.remove('hidden');
                doneBtn.style.display = 'inline-block';
            }
            if (failBtn) {
                failBtn.classList.remove('hidden');
                failBtn.style.display = 'inline-block';
            }
            
        }, 6000);
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
    
    // Колесо остается скрытым
    wheelContainer1_s3.classList.add('hidden');
    
    // Показываем кнопку "Загадать"
    spinBtn1_s3.style.display = 'block';
    spinBtn1_s3.disabled = false;
    
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    // Скрываем кнопки действий
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    if (doneBtn) {
        doneBtn.classList.add('hidden');
        doneBtn.style.display = '';
    }
    if (failBtn) {
        failBtn.classList.add('hidden');
        failBtn.style.display = '';
    }
}
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
    
    // Начальное состояние третьего экрана
    if (wheelContainer1_s3) wheelContainer1_s3.classList.add('hidden');
    if (resultContainer1_s3) resultContainer1_s3.classList.add('hidden');
    if (resultContainer2_s3) resultContainer2_s3.classList.add('hidden');
    if (restartSection_s3) restartSection_s3.classList.add('hidden');
    
    const doneBtn = document.getElementById('doneBtn_s3');
    const failBtn = document.getElementById('failBtn_s3');
    if (doneBtn) {
        doneBtn.classList.add('hidden');
        doneBtn.style.display = '';
    }
    if (failBtn) {
        failBtn.classList.add('hidden');
        failBtn.style.display = '';
    }
});

