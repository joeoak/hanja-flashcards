// Korean Hanja flash cards data
const hanjaCards = [
    {
        hanja: '人',
        meaning: 'Person',
        reading: '인 (in)',
        example: '人間 (인간) - human being'
    },
    {
        hanja: '大',
        meaning: 'Big',
        reading: '대 (dae)',
        example: '大學 (대학) - university'
    },
    {
        hanja: '小',
        meaning: 'Small',
        reading: '소 (so)',
        example: '小說 (소설) - novel'
    },
    {
        hanja: '中',
        meaning: 'Middle',
        reading: '중 (jung)',
        example: '中國 (중국) - China'
    },
    {
        hanja: '國',
        meaning: 'Country',
        reading: '국 (guk)',
        example: '韓國 (한국) - Korea'
    },
    {
        hanja: '學',
        meaning: 'Learning',
        reading: '학 (hak)',
        example: '學生 (학생) - student'
    },
    {
        hanja: '生',
        meaning: 'Life/Birth',
        reading: '생 (saeng)',
        example: '生活 (생활) - life/living'
    },
    {
        hanja: '日',
        meaning: 'Day/Sun',
        reading: '일 (il)',
        example: '日本 (일본) - Japan'
    },
    {
        hanja: '月',
        meaning: 'Month/Moon',
        reading: '월 (wol)',
        example: '一月 (일월) - January'
    },
    {
        hanja: '年',
        meaning: 'Year',
        reading: '년 (nyeon)',
        example: '今年 (금년) - this year'
    },
    {
        hanja: '時',
        meaning: 'Time',
        reading: '시 (si)',
        example: '時間 (시간) - time'
    },
    {
        hanja: '山',
        meaning: 'Mountain',
        reading: '산 (san)',
        example: '山川 (산천) - mountains and rivers'
    },
    {
        hanja: '水',
        meaning: 'Water',
        reading: '수 (su)',
        example: '水道 (수도) - waterworks'
    },
    {
        hanja: '火',
        meaning: 'Fire',
        reading: '화 (hwa)',
        example: '火曜日 (화요일) - Tuesday'
    },
    {
        hanja: '木',
        meaning: 'Tree/Wood',
        reading: '목 (mok)',
        example: '木曜日 (목요일) - Thursday'
    },
    {
        hanja: '金',
        meaning: 'Gold/Metal',
        reading: '금 (geum)',
        example: '金曜日 (금요일) - Friday'
    },
    {
        hanja: '土',
        meaning: 'Earth/Soil',
        reading: '토 (to)',
        example: '土曜日 (토요일) - Saturday'
    },
    {
        hanja: '心',
        meaning: 'Heart/Mind',
        reading: '심 (sim)',
        example: '心情 (심정) - feelings'
    },
    {
        hanja: '愛',
        meaning: 'Love',
        reading: '애 (ae)',
        example: '愛情 (애정) - affection'
    },
    {
        hanja: '友',
        meaning: 'Friend',
        reading: '우 (u)',
        example: '友情 (우정) - friendship'
    }
];

let currentIndex = 0;
let cards = [...hanjaCards];

// Initialize the app
function init() {
    document.getElementById('total').textContent = cards.length;
    displayCard();
    updateButtons();

    // Add click event to card for flipping
    document.getElementById('flashcard').addEventListener('click', flipCard);
}

// Display current card
function displayCard() {
    const card = cards[currentIndex];
    document.getElementById('korean-reading').textContent = card.reading;
    document.getElementById('meaning').textContent = card.meaning;
    document.getElementById('hanja').textContent = card.hanja;
    document.getElementById('example').textContent = card.example;
    document.getElementById('current').textContent = currentIndex + 1;

    // Reset flip state
    document.getElementById('flashcard').classList.remove('flipped');
}

// Flip card
function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

// Navigate to next card
function nextCard() {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        displayCard();
        updateButtons();
    }
}

// Navigate to previous card
function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        displayCard();
        updateButtons();
    }
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
    // Randomize array order by swapping each element with a random element
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    currentIndex = 0;
    displayCard();
    updateButtons();
}

// Update button states
function updateButtons() {
    document.getElementById('prevBtn').disabled = currentIndex === 0;
    document.getElementById('nextBtn').disabled = currentIndex === cards.length - 1;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        previousCard();
    } else if (e.key === 'ArrowRight') {
        nextCard();
    } else if ((e.key === ' ' || e.key === 'Enter') && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        flipCard();
    }
});

// Initialize on page load
init();