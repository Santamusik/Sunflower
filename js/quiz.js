// Quiz.js - Quiz functionality
let currentStudent = null;
let selectedQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let attemptCount = 0;
let results = [];

const encouragingMessages = {
    correct: [
        "잘했어요!",
        "정확해요!",
        "훌륭해요!",
        "멋져요!",
        "완벽해요!"
    ],
    incorrect: [
        "괜찮아요, 다시 한번 생각해봐요!",
        "아쉬워요, 한 번 더 도전해볼까요?",
        "조금만 더 생각해보면 답을 찾을 수 있을 거예요!"
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if student info exists
    const studentInfoStr = sessionStorage.getItem('currentStudent');
    if (!studentInfoStr) {
        alert('학생 정보가 없습니다. 처음 페이지로 이동합니다.');
        window.location.href = 'index.html';
        return;
    }

    currentStudent = JSON.parse(studentInfoStr);

    // Select 3 random questions
    selectedQuestions = getRandomQuestions(quizQuestions, 3);

    // Event listeners
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('retryQuestion').addEventListener('click', retryQuestion);

    // Load first question
    loadQuestion();
});

function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = selectedQuestions[currentQuestionIndex];

    // Update question number
    document.getElementById('questionNumber').textContent = `문제 ${currentQuestionIndex + 1} / ${selectedQuestions.length}`;

    // Update question text
    document.getElementById('questionText').textContent = question.question;

    // Clear and add options
    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';

    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'option';
        li.textContent = option;
        li.dataset.index = index;

        li.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');
            selectedAnswer = index;
        });

        optionsList.appendChild(li);
    });

    // Reset state
    selectedAnswer = null;
    attemptCount = 0;
    document.getElementById('feedbackContainer').style.display = 'none';
    document.getElementById('submitAnswer').style.display = 'inline-block';
    document.getElementById('nextQuestion').style.display = 'none';
    document.getElementById('retryQuestion').style.display = 'none';
}

function submitAnswer() {
    if (selectedAnswer === null) {
        alert('답을 선택해주세요!');
        return;
    }

    attemptCount++;
    const question = selectedQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;

    const feedbackContainer = document.getElementById('feedbackContainer');
    const options = document.querySelectorAll('.option');

    if (isCorrect) {
        // Correct answer
        feedbackContainer.className = 'feedback correct';
        const randomEncouragement = encouragingMessages.correct[Math.floor(Math.random() * encouragingMessages.correct.length)];
        feedbackContainer.innerHTML = `<strong>${randomEncouragement}</strong><br>${question.feedback.correct}`;
        feedbackContainer.style.display = 'block';

        // Highlight correct answer
        options[selectedAnswer].classList.add('correct');

        // Record result
        results.push({
            questionId: question.id,
            question: question.question,
            concept: question.concept,
            correct: true,
            attempts: attemptCount,
            selectedAnswer: selectedAnswer,
            correctAnswer: question.correctAnswer
        });

        // Show next button
        document.getElementById('submitAnswer').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'inline-block';

        // Disable all options
        options.forEach(opt => opt.style.pointerEvents = 'none');

    } else {
        // Incorrect answer
        options[selectedAnswer].classList.add('incorrect');

        if (attemptCount === 1) {
            // First attempt - give second chance
            feedbackContainer.className = 'feedback incorrect';
            const randomEncouragement = encouragingMessages.incorrect[Math.floor(Math.random() * encouragingMessages.incorrect.length)];
            feedbackContainer.innerHTML = `<strong>${randomEncouragement}</strong><br>${question.feedback.incorrect}`;
            feedbackContainer.style.display = 'block';

            document.getElementById('submitAnswer').style.display = 'none';
            document.getElementById('retryQuestion').style.display = 'inline-block';

        } else {
            // Second attempt failed - show correct answer
            feedbackContainer.className = 'feedback incorrect';
            feedbackContainer.innerHTML = `<strong>정답은 "${question.options[question.correctAnswer]}"예요.</strong><br>${question.feedback.incorrect}`;
            feedbackContainer.style.display = 'block';

            // Highlight correct answer
            options[question.correctAnswer].classList.add('correct');

            // Record result
            results.push({
                questionId: question.id,
                question: question.question,
                concept: question.concept,
                correct: false,
                attempts: attemptCount,
                selectedAnswer: selectedAnswer,
                correctAnswer: question.correctAnswer
            });

            document.getElementById('submitAnswer').style.display = 'none';
            document.getElementById('retryQuestion').style.display = 'none';
            document.getElementById('nextQuestion').style.display = 'inline-block';

            // Disable all options
            options.forEach(opt => opt.style.pointerEvents = 'none');
        }
    }
}

function retryQuestion() {
    // Remove incorrect class from previously selected answer
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('incorrect', 'selected');
    });

    selectedAnswer = null;
    document.getElementById('feedbackContainer').style.display = 'none';
    document.getElementById('submitAnswer').style.display = 'inline-block';
    document.getElementById('retryQuestion').style.display = 'none';
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < selectedQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    // Calculate score
    const correctCount = results.filter(r => r.correct).length;
    const totalCount = results.length;
    const percentage = (correctCount / totalCount) * 100;

    // Save results to localStorage
    saveResults(correctCount, totalCount, percentage);

    // Hide quiz section
    document.querySelector('.question-card').style.display = 'none';
    document.querySelector('.quiz-buttons').style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';

    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';

    document.getElementById('finalScore').textContent = `${correctCount} / ${totalCount}`;

    let message = '';
    if (percentage === 100) {
        message = '🌟 완벽해요! 달의 모양 변화를 아주 잘 이해했어요!';
    } else if (percentage >= 66) {
        message = '👍 잘했어요! 달의 모양 변화를 잘 이해하고 있어요!';
    } else {
        message = '💪 좋아요! 시뮬레이터를 다시 관찰하면 더 잘 이해할 수 있을 거예요!';
    }

    document.getElementById('resultsMessage').textContent = message;
}

function saveResults(correctCount, totalCount, percentage) {
    // Get existing results from localStorage
    let allResults = JSON.parse(localStorage.getItem('quizResults') || '[]');

    // Identify weak concepts
    const weakConcepts = results
        .filter(r => !r.correct)
        .map(r => r.concept);

    const resultEntry = {
        student: currentStudent,
        timestamp: new Date().toISOString(),
        score: correctCount,
        total: totalCount,
        percentage: percentage,
        questions: results,
        weakConcepts: [...new Set(weakConcepts)] // Remove duplicates
    };

    allResults.push(resultEntry);
    localStorage.setItem('quizResults', JSON.stringify(allResults));
}
