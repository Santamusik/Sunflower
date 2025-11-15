// Simulator.js - Moon phase simulation
let currentDay = 1;
let isPlaying = false;
let animationInterval = null;

const moonPhases = [
    { day: 1, name: '초승달', phase: 0.05 },
    { day: 4, name: '초승달', phase: 0.15 },
    { day: 7, name: '상현달', phase: 0.25 },
    { day: 11, name: '상현달', phase: 0.4 },
    { day: 15, name: '보름달', phase: 0.5 },
    { day: 19, name: '하현달', phase: 0.6 },
    { day: 22, name: '하현달', phase: 0.75 },
    { day: 26, name: '그믐달', phase: 0.85 },
    { day: 29, name: '그믐달', phase: 0.95 }
];

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('moonCanvas');
    const ctx = canvas.getContext('2d');

    // Check if student info exists
    const studentInfo = sessionStorage.getItem('currentStudent');
    if (!studentInfo) {
        alert('학생 정보가 없습니다. 처음 페이지로 이동합니다.');
        window.location.href = 'index.html';
        return;
    }

    // Event listeners
    document.getElementById('prevDay').addEventListener('click', () => {
        stopAnimation();
        if (currentDay > 1) {
            currentDay--;
            updateMoon();
        }
    });

    document.getElementById('nextDay').addEventListener('click', () => {
        stopAnimation();
        if (currentDay < 30) {
            currentDay++;
            updateMoon();
        }
    });

    document.getElementById('playPause').addEventListener('click', togglePlayPause);
    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('goToQuiz').addEventListener('click', () => {
        window.location.href = 'quiz.html';
    });

    function togglePlayPause() {
        if (isPlaying) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }

    function startAnimation() {
        isPlaying = true;
        document.getElementById('playPause').textContent = '⏸ 일시정지';

        animationInterval = setInterval(() => {
            if (currentDay < 30) {
                currentDay++;
                updateMoon();
            } else {
                stopAnimation();
            }
        }, 800); // 0.8 seconds per day
    }

    function stopAnimation() {
        isPlaying = false;
        document.getElementById('playPause').textContent = '▶ 재생';
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
    }

    function reset() {
        stopAnimation();
        currentDay = 1;
        updateMoon();
    }

    function getMoonPhase(day) {
        // Calculate moon phase based on day (0 = new moon, 0.5 = full moon, 1 = new moon again)
        const phase = (day - 1) / 29.5;
        return phase;
    }

    function getPhaseName(day) {
        if (day >= 1 && day < 7) return '초승달';
        if (day >= 7 && day < 9) return '상현달';
        if (day >= 9 && day < 14) return '상현달 이후';
        if (day >= 14 && day < 16) return '보름달';
        if (day >= 16 && day < 21) return '하현달 이전';
        if (day >= 21 && day < 23) return '하현달';
        if (day >= 23 && day < 29) return '그믐달';
        return '그믐달';
    }

    function drawMoon() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        drawStars();

        // Calculate illumination
        const phase = getMoonPhase(currentDay);

        // Draw moon shadow (dark part)
        ctx.fillStyle = '#2a2a3e';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw illuminated part
        ctx.save();
        ctx.fillStyle = '#f4f1de';

        if (phase <= 0.5) {
            // Waxing (growing) - from new moon to full moon
            const sweepAngle = phase * 2; // 0 to 1

            // Draw the lit portion
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI / 2);

            if (sweepAngle < 0.5) {
                // Waxing crescent to first quarter
                const curveRadius = radius * (1 - sweepAngle * 2);
                ctx.ellipse(centerX, centerY, curveRadius, radius, 0, Math.PI / 2, -Math.PI / 2, true);
            } else {
                // First quarter to full moon
                const curveRadius = radius * (sweepAngle * 2 - 1);
                ctx.ellipse(centerX, centerY, curveRadius, radius, 0, -Math.PI / 2, Math.PI / 2, false);
            }

            ctx.closePath();
            ctx.fill();
        } else {
            // Waning (shrinking) - from full moon to new moon
            const sweepAngle = (phase - 0.5) * 2; // 0 to 1

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, Math.PI / 2, -Math.PI / 2);

            if (sweepAngle < 0.5) {
                // Full moon to last quarter
                const curveRadius = radius * (1 - sweepAngle * 2);
                ctx.ellipse(centerX, centerY, curveRadius, radius, 0, -Math.PI / 2, Math.PI / 2, true);
            } else {
                // Last quarter to new moon
                const curveRadius = radius * (sweepAngle * 2 - 1);
                ctx.ellipse(centerX, centerY, curveRadius, radius, 0, Math.PI / 2, -Math.PI / 2, false);
            }

            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

        // Draw moon craters for realism
        drawCraters(centerX, centerY, radius, phase);

        // Draw moon outline
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawStars() {
        ctx.fillStyle = '#ffffff';
        const stars = 50;
        for (let i = 0; i < stars; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 2;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawCraters(centerX, centerY, moonRadius, phase) {
        const craters = [
            { x: 0.3, y: -0.2, r: 0.15 },
            { x: -0.2, y: 0.3, r: 0.1 },
            { x: 0.1, y: 0.4, r: 0.08 },
            { x: -0.4, y: -0.1, r: 0.12 },
            { x: 0.2, y: 0.1, r: 0.07 }
        ];

        ctx.fillStyle = 'rgba(100, 100, 120, 0.3)';
        craters.forEach(crater => {
            const x = centerX + crater.x * moonRadius;
            const y = centerY + crater.y * moonRadius;
            const r = crater.r * moonRadius;

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateMoon() {
        drawMoon();
        document.getElementById('currentDay').textContent = `${currentDay}일째`;
        document.getElementById('phaseName').textContent = getPhaseName(currentDay);
    }

    // Initial draw
    updateMoon();
});
