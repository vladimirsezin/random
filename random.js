document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const wheel1 = document.getElementById('wheel1');
    const spinBtn1 = document.getElementById('spinBtn1');
    const nextBtn = document.getElementById('nextBtn');
    const nextSection = document.getElementById('nextSection');
    const result1 = document.getElementById('result1');
    const result2 = document.getElementById('result2');
    const resultImage1 = document.getElementById('resultImage1');
    const wheelContainer1 = document.getElementById('wheelContainer1');
    const firstStageButtons = document.querySelector('.first-stage-buttons');
    const resultContainer1 = document.getElementById('resultContainer1');
    const resultContainer2 = document.getElementById('resultContainer2');
    
    // Создаем кнопку "Начать заново"
    const restartSection = document.createElement('div');
    restartSection.className = 'restart-section hidden';
    restartSection.innerHTML = `
        <button class="restart-btn" id="restartBtn">Перезаказ</button>
    `;
    document.querySelector('.container').appendChild(restartSection);
    const restartBtn = document.getElementById('restartBtn');
    
    // Данные для колес
    const wheel1Items = [
        { name: 'Рейл' },
        { name: 'Гробик' },
        { name: 'Минька' },
        { name: 'Стена' },
        { name: 'Кикер' },
        { name: 'Пул' },
        { name: 'Флэт' }
    ];
    
    // Списки трюков для разных фигур
    const tricksByFigure = {
        'Флэт': [
            'Frontside Flip',
            'Backside Flip',
            'Frontside Heelflip',
            'Backside Heelflip',
            'Impossible',
            'Varial Kickflip',
            'Varial Heelflip',
            'Inward Heelflip',
            'Hardflip',
            '360 Flip',
            '360 Shove-it',
            'Frontside 360 Shove-it',
            'Backside 360 Shove-it',
            'Frontside Bigspin',
            'Backside Bigspin',
            'Frontside Bigspin Flip',
            'Backside Bigspin Flip',
            
            // Fakie версии
            'Fakie Frontside Flip',
            'Fakie Backside Flip',
            'Fakie Frontside Heelflip',
            'Fakie Backside Heelflip',
            'Fakie Impossible',
            'Fakie Varial Kickflip',
            'Fakie Varial Heelflip',
            'Fakie Inward Heelflip',
            'Fakie Hardflip',
            'Fakie 360 Flip',
            'Fakie 360 Shove-it',
            'Fakie Frontside 360 Shove-it',
            'Fakie Backside 360 Shove-it',
            'Fakie Frontside Bigspin',
            'Fakie Backside Bigspin',
            'Fakie Frontside Bigspin Flip',
            'Fakie Backside Bigspin Flip',
            
            // Nollie версии
            'Nollie Frontside Flip',
            'Nollie Backside Flip',
            'Nollie Frontside Heelflip',
            'Nollie Backside Heelflip',
            'Nollie Impossible',
            'Nollie Varial Kickflip',
            'Nollie Varial Heelflip',
            'Nollie Inward Heelflip',
            'Nollie Hardflip',
            'Nollie 360 Flip',
            'Nollie 360 Shove-it',
            'Nollie Frontside 360 Shove-it',
            'Nollie Backside 360 Shove-it',
            'Nollie Frontside Bigspin',
            'Nollie Backside Bigspin',
            'Nollie Frontside Bigspin Flip',
            'Nollie Backside Bigspin Flip',
            
            // Switch версии
            'Switch Frontside Flip',
            'Switch Backside Flip',
            'Switch Frontside Heelflip',
            'Switch Backside Heelflip',
            'Switch Impossible',
            'Switch Varial Kickflip',
            'Switch Varial Heelflip',
            'Switch Inward Heelflip',
            'Switch Hardflip',
            'Switch 360 Flip',
            'Switch 360 Shove-it',
            'Switch Frontside 360 Shove-it',
            'Switch Backside 360 Shove-it',
            'Switch Frontside Bigspin',
            'Switch Backside Bigspin',
            'Switch Frontside Bigspin Flip',
            'Switch Backside Bigspin Flip'
        ],
        'Рейл': [
            'Frontside 50-50',
            'Backside 50-50',
            'Frontside Boardslide',
            'Backside Boardslide',
            'Frontside Lipslide',
            'Backside Lipslide',
            'Frontside Noseslide',
            'Backside Noseslide',
            'Frontside Tailslide',
            'Backside Tailslide',
            'Frontside Smith',
            'Backside Smith',
            'Frontside Feeble',
            'Backside Feeble',
            'Frontside Crooked',
            'Backside Crooked',
            'Frontside Overcrook',
            'Backside Overcrook',
            
            // Fakie Frontside/Backside variations
            'Fakie Frontside 50-50',
            'Fakie Backside 50-50',
            'Fakie Frontside Boardslide',
            'Fakie Backside Boardslide',
            'Fakie Frontside Lipslide',
            'Fakie Backside Lipslide',
            'Fakie Frontside Noseslide',
            'Fakie Backside Noseslide',
            'Fakie Frontside Tailslide',
            'Fakie Backside Tailslide',
            'Fakie Frontside Smith',
            'Fakie Backside Smith',
            'Fakie Frontside Feeble',
            'Fakie Backside Feeble',
            
            // Nollie Frontside/Backside variations
            'Nollie Frontside 50-50',
            'Nollie Backside 50-50',
            'Nollie Frontside Noseslide',
            'Nollie Backside Noseslide',
            'Nollie Frontside Tailslide',
            'Nollie Backside Tailslide',
            'Nollie Frontside Boardslide',
            'Nollie Backside Boardslide',
            'Nollie Frontside 5-0',
            'Nollie Backside 5-0',
            'Nollie Frontside Nose Grind',
            'Nollie Backside Nose Grind',
            
            // Switch Frontside/Backside variations
            'Switch Frontside 50-50',
            'Switch Backside 50-50',
            'Switch Frontside Boardslide',
            'Switch Backside Boardslide',
            'Switch Frontside Lipslide',
            'Switch Backside Lipslide',
            'Switch Frontside Noseslide',
            'Switch Backside Noseslide',
            'Switch Frontside Tailslide',
            'Switch Backside Tailslide',
            'Switch Frontside Smith',
            'Switch Backside Smith',
            'Switch Frontside Crooked',
            'Switch Backside Crooked'
        ],
        'Гробик': [
            'Frontside 50-50',
            'Backside 50-50',
            'Frontside Boardslide',
            'Backside Boardslide',
            'Frontside Lipslide',
            'Backside Lipslide',
            'Frontside Noseslide',
            'Backside Noseslide',
            'Frontside Tailslide',
            'Backside Tailslide',
            'Frontside Smith',
            'Backside Smith',
            'Frontside Feeble',
            'Backside Feeble',
            'Frontside Crooked',
            'Backside Crooked',
            'Frontside Overcrook',
            'Backside Overcrook',
            
            // Fakie Frontside/Backside variations
            'Fakie Frontside 50-50',
            'Fakie Backside 50-50',
            'Fakie Frontside Boardslide',
            'Fakie Backside Boardslide',
            'Fakie Frontside Lipslide',
            'Fakie Backside Lipslide',
            'Fakie Frontside Noseslide',
            'Fakie Backside Noseslide',
            'Fakie Frontside Tailslide',
            'Fakie Backside Tailslide',
            'Fakie Frontside Smith',
            'Fakie Backside Smith',
            'Fakie Frontside Feeble',
            'Fakie Backside Feeble',
            
            // Nollie Frontside/Backside variations
            'Nollie Frontside 50-50',
            'Nollie Backside 50-50',
            'Nollie Frontside Noseslide',
            'Nollie Backside Noseslide',
            'Nollie Frontside Tailslide',
            'Nollie Backside Tailslide',
            'Nollie Frontside Boardslide',
            'Nollie Backside Boardslide',
            'Nollie Frontside 5-0',
            'Nollie Backside 5-0',
            'Nollie Frontside Nose Grind',
            'Nollie Backside Nose Grind',
            
            // Switch Frontside/Backside variations
            'Switch Frontside 50-50',
            'Switch Backside 50-50',
            'Switch Frontside Boardslide',
            'Switch Backside Boardslide',
            'Switch Frontside Lipslide',
            'Switch Backside Lipslide',
            'Switch Frontside Noseslide',
            'Switch Backside Noseslide',
            'Switch Frontside Tailslide',
            'Switch Backside Tailslide',
            'Switch Frontside Smith',
            'Switch Backside Smith',
            'Switch Frontside Crooked',
            'Switch Backside Crooked'
        ],
        'Минька': [
            'Frontside Axle',
            'Backside Axle',
            'Frontside Nose',
            'Backside Nose',
            'Frontside Tail',
            'Backside Tail',
            'Frontside Blunt',
            'Backside Blunt',
            'Frontside 50-50',
            'Backside 50-50',
            'Frontside Smith',
            'Backside Smith',
            'Frontside Feeble',
            'Backside Feeble',
            'Frontside Overcrook',
            'Backside Overcrook',
            
            // Fakie variations
            'Fakie Axle',
            'Fakie Nose',
            'Fakie Tail',
            'Fakie 50-50',
            'Fakie 5-0',
            'Fakie Smith',
            'Fakie Feeble',
            
            // Nollie variations
            'Nollie Axle',
            'Nollie Nose',
            'Nollie Tail',
            'Nollie 50-50',
            'Nollie 5-0',
            
            // Switch variations
            'Switch Axle',
            'Switch Nose',
            'Switch 50-50',
            'Switch Smith',
            
            // Disaster variations
            'Disaster',
            'Frontside Disaster',
            'Backside Disaster',
            'Fakie Disaster',
            'Nollie Disaster',
            'Switch Disaster'
        ],
        'Стена': ['FS Wallride', 'BS Wallride'],
        'Кикер': [
            'Frontside Flip',
            'Backside Flip',
            'Frontside Heelflip',
            'Backside Heelflip',
            'Impossible',
            'Varial Kickflip',
            'Varial Heelflip',
            'Inward Heelflip',
            'Hardflip',
            '360 Flip',
            '360 Shove-it',
            'Frontside 360 Shove-it',
            'Backside 360 Shove-it',
            'Frontside Bigspin',
            'Backside Bigspin',
            'Frontside Bigspin Flip',
            'Backside Bigspin Flip',
            
            // Fakie версии
            'Fakie Frontside Flip',
            'Fakie Backside Flip',
            'Fakie Frontside Heelflip',
            'Fakie Backside Heelflip',
            'Fakie Impossible',
            'Fakie Varial Kickflip',
            'Fakie Varial Heelflip',
            'Fakie Inward Heelflip',
            'Fakie Hardflip',
            'Fakie 360 Flip',
            'Fakie 360 Shove-it',
            'Fakie Frontside 360 Shove-it',
            'Fakie Backside 360 Shove-it',
            'Fakie Frontside Bigspin',
            'Fakie Backside Bigspin',
            'Fakie Frontside Bigspin Flip',
            'Fakie Backside Bigspin Flip',
            
            // Nollie версии
            'Nollie Frontside Flip',
            'Nollie Backside Flip',
            'Nollie Frontside Heelflip',
            'Nollie Backside Heelflip',
            'Nollie Impossible',
            'Nollie Varial Kickflip',
            'Nollie Varial Heelflip',
            'Nollie Inward Heelflip',
            'Nollie Hardflip',
            'Nollie 360 Flip',
            'Nollie 360 Shove-it',
            'Nollie Frontside 360 Shove-it',
            'Nollie Backside 360 Shove-it',
            'Nollie Frontside Bigspin',
            'Nollie Backside Bigspin',
            'Nollie Frontside Bigspin Flip',
            'Nollie Backside Bigspin Flip',
            
            // Switch версии
            'Switch Frontside Flip',
            'Switch Backside Flip',
            'Switch Frontside Heelflip',
            'Switch Backside Heelflip',
            'Switch Impossible',
            'Switch Varial Kickflip',
            'Switch Varial Heelflip',
            'Switch Inward Heelflip',
            'Switch Hardflip',
            'Switch 360 Flip',
            'Switch 360 Shove-it',
            'Switch Frontside 360 Shove-it',
            'Switch Backside 360 Shove-it',
            'Switch Frontside Bigspin',
            'Switch Backside Bigspin',
            'Switch Frontside Bigspin Flip',
            'Switch Backside Bigspin Flip'
        ],
        'Пул': [
            'Frontside Axle',
            'Backside Axle',
            'Frontside Nose',
            'Backside Nose',
            'Frontside Tail',
            'Backside Tail',
            'Frontside Blunt',
            'Backside Blunt',
            'Frontside 50-50',
            'Backside 50-50',
            'Frontside Smith',
            'Backside Smith',
            'Frontside Feeble',
            'Backside Feeble',
            'Frontside Overcrook',
            'Backside Overcrook',
            
            // Fakie variations
            'Fakie Axle',
            'Fakie Nose',
            'Fakie Tail',
            'Fakie 50-50',
            'Fakie 5-0',
            'Fakie Smith',
            'Fakie Feeble',
            
            // Nollie variations
            'Nollie Axle',
            'Nollie Nose',
            'Nollie Tail',
            'Nollie 50-50',
            'Nollie 5-0',
            
            // Switch variations
            'Switch Axle',
            'Switch Nose',
            'Switch 50-50',
            'Switch Smith',
            
            // Disaster variations
            'Disaster',
            'Frontside Disaster',
            'Backside Disaster',
            'Fakie Disaster',
            'Nollie Disaster',
            'Switch Disaster'
        ]
    };
    
    // Текущая выбранная фигура
    let currentFigure = null;
    
    // Инициализация колеса
    function initWheel(wheelElement, items) {
        const wheelSections = wheelElement.querySelector('.wheel-sections');
        wheelSections.innerHTML = '';
        
        const angle = 360 / items.length;
        const radius = 80;
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 280 280");
        
        // Добавляем сектора (границы)
        items.forEach((item, index) => {
            const sector = document.createElementNS(svgNS, "path");
            
            const startAngle = (angle * index) * Math.PI / 180;
            const endAngle = (angle * (index + 1)) * Math.PI / 180;
            
            const centerX = 140;
            const centerY = 140;
            const sectorRadius = 140;
            
            const startX = centerX + sectorRadius * Math.cos(startAngle);
            const startY = centerY + sectorRadius * Math.sin(startAngle);
            const endX = centerX + sectorRadius * Math.cos(endAngle);
            const endY = centerY + sectorRadius * Math.sin(endAngle);
            
            const d = `
                M ${centerX},${centerY}
                L ${startX},${startY}
                A ${sectorRadius},${sectorRadius} 0 0,1 ${endX},${endY}
                Z
            `;
            
            sector.setAttribute("d", d);
            sector.setAttribute("fill", "none");
            sector.setAttribute("stroke", "rgb(255, 238, 0)");
            sector.setAttribute("stroke-width", "1");
            sector.setAttribute("stroke-opacity", "0.38");
            
            svg.appendChild(sector);
        });
        
        // Добавляем текст
        items.forEach((item, index) => {
            const sectionAngle = (angle * index) * Math.PI / 180;
            const halfAngle = (angle / 2) * Math.PI / 180;
            const textAngle = sectionAngle + halfAngle;
            
            const x = 140 + radius * Math.cos(textAngle);
            const y = 140 + radius * Math.sin(textAngle);
            
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "central");
            text.setAttribute("fill", "white");
            text.setAttribute("font-weight", "600");
            text.setAttribute("font-size", "24");
            text.setAttribute("color", "#333");
            text.setAttribute("transform", `rotate(${textAngle * 180 / Math.PI - 0}, ${x}, ${y})`);
            text.textContent = item.name;
            
            svg.appendChild(text);
        });
        
        wheelSections.appendChild(svg);
    }
    
    // Функция вращения первого колеса
    function spinWheel1() {
        spinBtn1.disabled = true;
         spinBtn1.style.display = 'none';
        
        // Показываем колесо перед вращением
        wheelContainer1.classList.remove('hidden');
        
        // Скрываем результат при новом вращении
        resultContainer1.classList.add('hidden');
        result1.classList.remove('active');
        
        // Сбрасываем вращение колеса
        wheel1.style.transition = 'none';
        wheel1.style.transform = 'rotate(0deg)';
        
        // Даем время для сброса
        setTimeout(() => {
            wheel1.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
            
            const spins = 5 + Math.floor(Math.random() * 3);
            const randomIndex = Math.floor(Math.random() * wheel1Items.length);
            const anglePerSection = 360 / wheel1Items.length;
            
            const stopAngle = spins * 360 + (randomIndex * anglePerSection) + (anglePerSection / 2);
            
            wheel1.style.transform = `rotate(${stopAngle}deg)`;
            
            // Показываем результат с задержкой
            setTimeout(() => {
                const resultItem = wheel1Items[randomIndex];
                currentFigure = resultItem.name;
                
                // Обновляем текст результата
                result1.querySelector('.result-text').textContent = currentFigure;
                result1.classList.add('active');
                
                // Показываем контейнер с результатом
                resultContainer1.classList.remove('hidden');
                
                // Скрываем колесо
                wheelContainer1.classList.add('hidden');
                
                wheel1.classList.remove('spinning');
                spinBtn1.disabled = false;
                spinBtn1.textContent = 'Фигура'; // Меняем текст обратно
                
                // Показываем кнопку "Трюк"
                nextBtn.textContent = 'Трюк';
                if (nextSection.classList.contains('hidden')) {
                    nextSection.classList.remove('hidden');
                }
            }, 3000);
        }, 50);
    }
    
    // Функция быстрого выбора трюка
    function selectTrick() {
        if (!currentFigure || !tricksByFigure[currentFigure]) {
            alert('Сначала выберите фигуру!');
            return;
        }
        spinBtn1.style.display = 'none';
        const tricks = tricksByFigure[currentFigure];
        nextBtn.disabled = true;
        nextBtn.textContent = 'Выбирается...';
        
        // Быстрая анимация выбора (прокрутка списка)
        let counter = 0;
        const maxIterations = 30;
        const interval = 50;
        
        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * tricks.length);
            result2.querySelector('.result-text').textContent = tricks[randomIndex];
            result2.classList.add('active');
            resultContainer2.classList.remove('hidden');
            
            counter++;
            
            if (counter >= maxIterations) {
                clearInterval(intervalId);
                
                // Финальный выбор
                const finalIndex = Math.floor(Math.random() * tricks.length);
                result2.querySelector('.result-text').textContent = tricks[finalIndex];
                
                nextBtn.disabled = false;
                nextBtn.textContent = 'Трюк';
                
                
                // Показываем кнопку "Начать заново"
                checkForRestartButton();
            }
        }, interval);
    }
    
    // Проверяем, нужно ли показать кнопку "Начать заново"
    function checkForRestartButton() {
        const result1Text = result1.querySelector('.result-text').textContent;
        const result2Text = result2.querySelector('.result-text').textContent;
        
        if (result1Text && result2Text) {
            restartSection.classList.remove('hidden');
            restartSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Функция сброса всех результатов
    function restartGame() {
        // Сбрасываем первое колесо
        wheel1.style.transition = 'none';
        wheel1.style.transform = 'rotate(0deg)';
        result1.querySelector('.result-text').textContent = '';
        result1.classList.remove('active');
        resultContainer1.classList.add('hidden');
        spinBtn1.style.display = "block";
        spinBtn1.disabled = false;
        spinBtn1.textContent = 'Фигура';
        
        // Сбрасываем второй результат
        result2.querySelector('.result-text').textContent = '';
        result2.classList.remove('active');
        resultContainer2.classList.add('hidden');
        
        // Сбрасываем текущую фигуру
        currentFigure = null;
        
        // Показываем первое колесо
        wheelContainer1.classList.remove('hidden');
        
        // Скрываем кнопки
        nextSection.classList.add('hidden');
        restartSection.classList.add('hidden');
        
        // Возвращаем кнопки первого этапа
        firstStageButtons.style.display = 'flex';
        
        // Даем время для сброса анимации
        setTimeout(() => {
            wheel1.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
        }, 50);
        
        // Прокручиваем к началу
        setTimeout(() => {
            document.querySelector('.container').scrollTop = 0;
        }, 100);
    }
    
    // Обработчики событий
    spinBtn1.addEventListener('click', spinWheel1);
    
    nextBtn.addEventListener('click', selectTrick);
    
    restartBtn.addEventListener('click', restartGame);
    
    // Инициализация
    initWheel(wheel1, wheel1Items);
    
    // Изначально скрываем кнопки
    nextSection.classList.add('hidden');
    restartSection.classList.add('hidden');
    resultContainer1.classList.add('hidden');
    resultContainer2.classList.add('hidden');
});