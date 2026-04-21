let currentGame = {
    playerName: '',
    category: 'general',
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    startTime: null,
    timer: null,
    timeLeft: 30,
    answered: false,
    totalQuestions: 5
};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    const playerName = document.getElementById('playerName').value.trim();
    const category = document.getElementById('categorySelect').value;
    const questionCount = parseInt(document.getElementById('questionCount').value);
    
    if (!playerName) {
        alert('Silakan masukkan nama pemain');
        return;
    }
    
    currentGame.playerName = playerName;
    currentGame.category = category;
    currentGame.totalQuestions = questionCount;
    currentGame.currentIndex = 0;
    currentGame.score = 0;
    currentGame.correctCount = 0;
    currentGame.wrongCount = 0;
    currentGame.answered = false;
    currentGame.startTime = Date.now();
    
    const allQuestions = questionBank[category];
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    currentGame.questions = shuffled.slice(0, questionCount);
    
    document.getElementById('displayPlayerName').textContent = playerName;
    document.getElementById('scoreDisplay').textContent = 'Skor: 0';
    
    showScreen('gameScreen');
    loadQuestion();
}

function loadQuestion() {
    const question = currentGame.questions[currentGame.currentIndex];
    
    document.getElementById('questionCounter').textContent = 
        `Soal ${currentGame.currentIndex + 1}/${currentGame.totalQuestions}`;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('feedbackContainer').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    
    currentGame.answered = false;
    currentGame.timeLeft = 30;
    document.getElementById('timerDisplay').textContent = '30';
    document.getElementById('timerProgress').style.width = '100%';
    
    startTimer();
}

function startTimer() {
    if (currentGame.timer) {
        clearInterval(currentGame.timer);
    }
    
    currentGame.timer = setInterval(() => {
        if (currentGame.answered) {
            clearInterval(currentGame.timer);
            return;
        }
        
        currentGame.timeLeft--;
        document.getElementById('timerDisplay').textContent = currentGame.timeLeft;
        
        const percentage = (currentGame.timeLeft / 30) * 100;
        document.getElementById('timerProgress').style.width = percentage + '%';
        
        if (currentGame.timeLeft <= 5) {
            document.getElementById('timerProgress').style.background = '#ff4444';
        }
        
        if (currentGame.timeLeft <= 0) {
            clearInterval(currentGame.timer);
            timeOut();
        }
    }, 1000);
}

function checkAnswer(selectedIndex) {
    if (currentGame.answered) return;
    
    clearInterval(currentGame.timer);
    currentGame.answered = true;
    
    const question = currentGame.questions[currentGame.currentIndex];
    const isCorrect = selectedIndex === question.correct;
    const optionButtons = document.querySelectorAll('.option-btn');
    
    let pointsEarned = 0;
    if (isCorrect) {
        currentGame.correctCount++;
        pointsEarned = 100 + (currentGame.timeLeft * 5);
        currentGame.score += pointsEarned;
        
        optionButtons[selectedIndex].classList.add('correct');
        
        const feedback = document.getElementById('feedbackContainer');
        feedback.innerHTML = `
            <div class="feedback-message correct">
                BENAR! +${pointsEarned} poin
                <br><small>${question.explanation}</small>
            </div>
        `;
    } else {
        currentGame.wrongCount++;
        
        optionButtons[selectedIndex].classList.add('wrong');
        optionButtons[question.correct].classList.add('correct');
        
        const feedback = document.getElementById('feedbackContainer');
        feedback.innerHTML = `
            <div class="feedback-message wrong">
                SALAH!
                <br><small>${question.explanation}</small>
            </div>
        `;
    }
    
    optionButtons.forEach(btn => btn.classList.add('disabled'));
    
    document.getElementById('scoreDisplay').textContent = `Skor: ${currentGame.score}`;
    document.getElementById('nextButton').style.display = 'block';
}

function timeOut() {
    if (currentGame.answered) return;
    
    currentGame.answered = true;
    currentGame.wrongCount++;
    
    const question = currentGame.questions[currentGame.currentIndex];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons[question.correct].classList.add('correct');
    optionButtons.forEach(btn => btn.classList.add('disabled'));
    
    const feedback = document.getElementById('feedbackContainer');
    feedback.innerHTML = `
        <div class="feedback-message wrong">
            WAKTU HABIS!
            <br><small>${question.explanation}</small>
        </div>
    `;
    
    document.getElementById('nextButton').style.display = 'block';
}

function nextQuestion() {
    if (currentGame.currentIndex + 1 < currentGame.questions.length) {
        currentGame.currentIndex++;
        loadQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(currentGame.timer);
    
    const totalTime = Math.floor((Date.now() - currentGame.startTime) / 1000);
    const accuracy = ((currentGame.correctCount / currentGame.totalQuestions) * 100).toFixed(1);
    
    document.getElementById('finalScore').textContent = currentGame.score;
    document.getElementById('correctAnswers').textContent = currentGame.correctCount;
    document.getElementById('wrongAnswers').textContent = currentGame.wrongCount;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('totalTime').textContent = totalTime + ' detik';
    
    showScreen('resultScreen');
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    showScreen('homeScreen');
});