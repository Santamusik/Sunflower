// Teacher.js - Teacher dashboard functionality
const conceptGuidance = {
    "달의 주기": {
        description: "달이 약 29.5일 주기로 모양이 변한다는 것을 이해하지 못함",
        suggestions: [
            "시뮬레이터를 천천히 재생하며 하루하루 달의 변화를 관찰하게 하기",
            "달력과 함께 실제 한 달 동안 매일 달을 관찰하는 활동 진행",
            "달의 공전 주기와 모양 변화의 관계 설명"
        ]
    },
    "달의 명칭": {
        description: "초승달, 보름달, 상현달, 하현달 등의 명칭을 정확히 구분하지 못함",
        suggestions: [
            "각 달의 모양을 그림으로 그려보고 명칭 붙이기",
            "시뮬레이터에서 각 단계의 달을 멈춰서 관찰하며 명칭 익히기",
            "실제 밤하늘의 달을 보고 어떤 달인지 맞춰보는 활동"
        ]
    },
    "달의 순서": {
        description: "달의 모양이 변하는 순서를 정확히 이해하지 못함",
        suggestions: [
            "달의 변화 순서를 순서도로 그려보기",
            "시뮬레이터를 여러 번 반복해서 관찰하기",
            "달 모양 카드를 순서대로 배열하는 활동 진행"
        ]
    },
    "달의 모양": {
        description: "각 날짜별 달의 모양을 구분하지 못함",
        suggestions: [
            "상현달과 하현달의 차이(오른쪽/왼쪽 밝은 부분) 중점 설명",
            "시뮬레이터에서 특정 날짜의 달 모양 관찰 및 스케치",
            "실제 달 사진과 시뮬레이터 비교 활동"
        ]
    },
    "달의 변화 방향": {
        description: "달이 커지고 작아지는 방향을 이해하지 못함",
        suggestions: [
            "초승달부터 보름달까지는 점점 커지고, 보름달 이후는 작아진다는 점 강조",
            "시뮬레이터에서 보름달 전후의 변화를 집중적으로 관찰",
            "달의 변화 방향을 화살표로 표시한 자료 제공"
        ]
    },
    "달의 주기와 모양": {
        description: "특정 날짜와 달의 모양을 연결하지 못함",
        suggestions: [
            "시뮬레이터에서 주요 날짜(1일, 7일, 15일, 22일, 29일)의 달 모양 집중 학습",
            "날짜와 달 모양 매칭 게임 활동",
            "한 달 달력에 달 모양 그려 넣기 활동"
        ]
    },
    "달의 변화 원리": {
        description: "달의 모양이 왜 변하는지 원리를 이해하지 못함",
        suggestions: [
            "태양-지구-달의 위치 관계를 모형으로 시연",
            "달은 스스로 빛을 내지 못하고 태양 빛을 반사한다는 점 설명",
            "손전등과 공을 이용한 달의 위상 변화 실험"
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();

    document.getElementById('clearData').addEventListener('click', function() {
        if (confirm('정말로 모든 학생 데이터를 삭제하시겠습니까?')) {
            localStorage.removeItem('quizResults');
            loadDashboard();
            alert('데이터가 삭제되었습니다.');
        }
    });
});

function loadDashboard() {
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');

    if (results.length === 0) {
        document.getElementById('studentList').innerHTML = '<p style="text-align: center; color: #666;">아직 퀴즈를 푼 학생이 없습니다.</p>';
        document.getElementById('conceptFeedback').innerHTML = '<p style="color: #666;">학생 데이터가 쌓이면 부족한 개념을 분석하여 표시됩니다.</p>';
        return;
    }

    // Calculate statistics
    const totalStudents = results.length;
    const avgScore = results.reduce((sum, r) => sum + r.percentage, 0) / totalStudents;
    const perfectScores = results.filter(r => r.percentage === 100).length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('avgScore').textContent = Math.round(avgScore) + '%';
    document.getElementById('perfectScores').textContent = perfectScores;

    // Display student list
    displayStudentList(results);

    // Analyze weak concepts
    analyzeWeakConcepts(results);
}

function displayStudentList(results) {
    const container = document.getElementById('studentList');
    container.innerHTML = '';

    results.forEach((result, index) => {
        const card = document.createElement('div');
        card.className = 'student-card';

        const scoreColor = result.percentage === 100 ? '#4caf50' :
                          result.percentage >= 66 ? '#2a5298' : '#ff9800';

        let weakConceptsHTML = '';
        if (result.weakConcepts && result.weakConcepts.length > 0) {
            weakConceptsHTML = `
                <div class="weak-concepts">
                    <strong>⚠️ 부족한 개념:</strong> ${result.weakConcepts.join(', ')}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="student-info">
                <div>
                    <div class="student-name">${result.student.name}</div>
                    <div class="student-details">
                        ${result.student.school} | ${result.student.grade}학년 ${result.student.class}반
                    </div>
                    <div class="student-details">
                        응시 시간: ${new Date(result.timestamp).toLocaleString('ko-KR')}
                    </div>
                </div>
                <div class="student-score" style="color: ${scoreColor}">
                    ${result.score} / ${result.total}
                    <div style="font-size: 0.8em; color: #666;">
                        (${Math.round(result.percentage)}%)
                    </div>
                </div>
            </div>
            ${weakConceptsHTML}
        `;

        container.appendChild(card);
    });
}

function analyzeWeakConcepts(results) {
    const conceptCount = {};

    // Count weak concepts
    results.forEach(result => {
        if (result.weakConcepts) {
            result.weakConcepts.forEach(concept => {
                conceptCount[concept] = (conceptCount[concept] || 0) + 1;
            });
        }
    });

    // Sort by frequency
    const sortedConcepts = Object.entries(conceptCount)
        .sort((a, b) => b[1] - a[1]);

    const container = document.getElementById('conceptFeedback');

    if (sortedConcepts.length === 0) {
        container.innerHTML = '<p style="color: #4caf50; font-weight: bold;">👏 모든 학생이 전 개념을 잘 이해하고 있습니다!</p>';
        return;
    }

    container.innerHTML = '';

    sortedConcepts.forEach(([concept, count]) => {
        const guidance = conceptGuidance[concept];

        if (guidance) {
            const conceptDiv = document.createElement('div');
            conceptDiv.style.marginBottom = '20px';
            conceptDiv.style.padding = '15px';
            conceptDiv.style.background = 'white';
            conceptDiv.style.borderRadius = '8px';
            conceptDiv.style.borderLeft = '4px solid #ff9800';

            const suggestionsHTML = guidance.suggestions
                .map(s => `<li>${s}</li>`)
                .join('');

            conceptDiv.innerHTML = `
                <h4 style="color: #2a5298; margin-bottom: 10px;">
                    ${concept}
                    <span style="color: #ff9800; font-size: 0.9em;">(${count}명 부족)</span>
                </h4>
                <p style="color: #666; margin-bottom: 10px;">${guidance.description}</p>
                <strong style="color: #555;">지도 방안:</strong>
                <ul style="margin-left: 20px; margin-top: 5px; line-height: 1.8;">
                    ${suggestionsHTML}
                </ul>
            `;

            container.appendChild(conceptDiv);
        }
    });
}
