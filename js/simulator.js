// Simulator.js - Moon phase simulation with real moon photo
let currentDay = 1;
let isPlaying = false;
let animationInterval = null;
let moonImage = null;
let imageLoaded = false;

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

    // Load real moon image
    moonImage = new Image();
    moonImage.crossOrigin = "anonymous";

    // Use a high-quality moon image (from NASA or similar)
    // For now, we'll create a realistic one procedurally
    createRealisticMoonImage().then(() => {
        imageLoaded = true;
        updateMoon();
    });

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
        }, 800);
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

    function createRealisticMoonImage() {
        return new Promise((resolve) => {
            const size = 400;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tempCtx = tempCanvas.getContext('2d');

            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size / 2;

            // Create base moon with radial gradient
            const gradient = tempCtx.createRadialGradient(
                centerX - radius * 0.2, centerY - radius * 0.2, 0,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, '#fafaf8');
            gradient.addColorStop(0.3, '#f0f0ea');
            gradient.addColorStop(0.6, '#e0e0d8');
            gradient.addColorStop(0.85, '#c8c8b8');
            gradient.addColorStop(1, '#a0a090');

            tempCtx.fillStyle = gradient;
            tempCtx.beginPath();
            tempCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            tempCtx.fill();

            // Add large craters (inspired by real moon features)
            const largeCraters = [
                { x: 0.3, y: -0.2, r: 0.2, depth: 0.7 },
                { x: -0.25, y: 0.3, r: 0.15, depth: 0.6 },
                { x: 0.15, y: 0.4, r: 0.12, depth: 0.5 },
                { x: -0.4, y: -0.15, r: 0.18, depth: 0.65 },
            ];

            largeCraters.forEach(crater => {
                const cx = centerX + crater.x * radius;
                const cy = centerY + crater.y * radius;
                const r = crater.r * radius;

                // Crater floor (dark)
                const craterGrad = tempCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
                craterGrad.addColorStop(0, `rgba(60, 60, 55, ${crater.depth * 0.4})`);
                craterGrad.addColorStop(0.7, `rgba(80, 80, 75, ${crater.depth * 0.3})`);
                craterGrad.addColorStop(1, 'rgba(100, 100, 95, 0)');

                tempCtx.fillStyle = craterGrad;
                tempCtx.beginPath();
                tempCtx.arc(cx, cy, r, 0, Math.PI * 2);
                tempCtx.fill();

                // Crater rim (bright)
                tempCtx.strokeStyle = `rgba(255, 255, 250, ${crater.depth * 0.2})`;
                tempCtx.lineWidth = 2;
                tempCtx.beginPath();
                tempCtx.arc(cx - r * 0.15, cy - r * 0.15, r * 0.9, Math.PI * 0.8, Math.PI * 1.3);
                tempCtx.stroke();
            });

            // Add medium craters
            const mediumCraters = [
                { x: 0.5, y: 0.15, r: 0.1, depth: 0.5 },
                { x: -0.15, y: -0.35, r: 0.12, depth: 0.55 },
                { x: 0.25, y: 0.2, r: 0.08, depth: 0.45 },
                { x: -0.5, y: 0.1, r: 0.09, depth: 0.5 },
            ];

            mediumCraters.forEach(crater => {
                const cx = centerX + crater.x * radius;
                const cy = centerY + crater.y * radius;
                const r = crater.r * radius;

                const craterGrad = tempCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
                craterGrad.addColorStop(0, `rgba(70, 70, 65, ${crater.depth * 0.35})`);
                craterGrad.addColorStop(1, 'rgba(100, 100, 95, 0)');

                tempCtx.fillStyle = craterGrad;
                tempCtx.beginPath();
                tempCtx.arc(cx, cy, r, 0, Math.PI * 2);
                tempCtx.fill();
            });

            // Add maria (dark regions - lunar seas)
            const maria = [
                { x: -0.2, y: 0.25, r: 0.3, opacity: 0.2 },
                { x: 0.3, y: -0.15, r: 0.25, opacity: 0.18 },
                { x: -0.35, y: -0.25, r: 0.22, opacity: 0.15 },
            ];

            maria.forEach(mare => {
                const mx = centerX + mare.x * radius;
                const my = centerY + mare.y * radius;
                const r = mare.r * radius;

                const mareGrad = tempCtx.createRadialGradient(mx, my, 0, mx, my, r);
                mareGrad.addColorStop(0, `rgba(80, 80, 70, ${mare.opacity})`);
                mareGrad.addColorStop(1, 'rgba(80, 80, 70, 0)');

                tempCtx.fillStyle = mareGrad;
                tempCtx.beginPath();
                tempCtx.arc(mx, my, r, 0, Math.PI * 2);
                tempCtx.fill();
            });

            // Add small craters for detail
            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 0.85;
                const cx = centerX + Math.cos(angle) * dist * radius;
                const cy = centerY + Math.sin(angle) * dist * radius;
                const r = 3 + Math.random() * 8;

                tempCtx.fillStyle = `rgba(60, 60, 55, ${0.15 + Math.random() * 0.15})`;
                tempCtx.beginPath();
                tempCtx.arc(cx, cy, r, 0, Math.PI * 2);
                tempCtx.fill();
            }

            // Add texture noise
            const imageData = tempCtx.getImageData(0, 0, size, size);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 12;
                data[i] += noise;
                data[i + 1] += noise;
                data[i + 2] += noise;
            }
            tempCtx.putImageData(imageData, 0, 0);

            moonImage.src = tempCanvas.toDataURL();
            moonImage.onload = () => resolve();
        });
    }

    function getMoonPhase(day) {
        // phase: 0 = new moon, 0.5 = full moon, 1 = new moon
        return (day - 1) / 29.5;
    }

    function getPhaseName(day) {
        if (day >= 1 && day <= 2) return '삭 (그믐)';
        if (day >= 3 && day <= 6) return '초승달';
        if (day >= 7 && day <= 8) return '상현달';
        if (day >= 9 && day <= 14) return '상현달 이후';
        if (day === 15) return '보름달';
        if (day >= 16 && day <= 21) return '하현달 이전';
        if (day >= 22 && day <= 23) return '하현달';
        if (day >= 24 && day <= 26) return '그믐달';
        if (day >= 27) return '그믐달';
        return '달';
    }

    function drawMoon() {
        if (!imageLoaded) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        // Clear and draw night sky
        const skyGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width);
        skyGrad.addColorStop(0, '#1a1a3e');
        skyGrad.addColorStop(1, '#0a0a1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        drawStars();

        // Get moon phase
        const phase = getMoonPhase(currentDay);

        // Draw moon with phase
        drawMoonWithPhase(centerX, centerY, radius, phase);

        // Add glow
        const glowGrad = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 25);
        glowGrad.addColorStop(0, 'rgba(255, 255, 240, 0.4)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 240, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 25, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawMoonWithPhase(cx, cy, radius, phase) {
        // phase: 0-1 where 0=new, 0.5=full, 1=new

        ctx.save();

        // Calculate how much of moon is illuminated
        // 0-0.5: waxing (growing from right)
        // 0.5-1: waning (shrinking from right)

        let illumination;
        if (phase <= 0.5) {
            // Waxing: 0 to 1
            illumination = phase * 2;
        } else {
            // Waning: 1 to 0
            illumination = 2 - (phase * 2);
        }

        // Draw moon base (full circle, will be masked)
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        // Fill dark background
        ctx.fillStyle = '#0a0a1e';
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

        // Now draw the illuminated part
        if (phase <= 0.5) {
            // Waxing: light appears from right, grows left
            drawWaxingPhase(cx, cy, radius, illumination);
        } else {
            // Waning: light disappears from right, remains on left
            drawWaningPhase(cx, cy, radius, illumination);
        }

        ctx.restore();
        ctx.restore();
    }

    function drawWaxingPhase(cx, cy, radius, illumination) {
        // illumination: 0 (new) to 1 (full)

        ctx.save();

        if (illumination <= 0.5) {
            // Crescent to first quarter (0 to 0.5)
            // Only right side visible with ellipse
            ctx.beginPath();
            ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI/2); // Right semicircle

            // Ellipse for shadow boundary
            const ellipseWidth = radius * (illumination * 2);
            ctx.ellipse(cx, cy, ellipseWidth, radius, 0, Math.PI/2, -Math.PI/2, true);

            ctx.closePath();
            ctx.clip();

            // Draw moon image
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);

        } else {
            // First quarter to full (0.5 to 1)
            // Right half always visible, left side growing

            // Draw right half
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI/2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);
            ctx.restore();

            // Draw growing left side
            const leftIllumination = (illumination - 0.5) * 2; // 0 to 1
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI/2, -Math.PI/2); // Left semicircle

            const ellipseWidth = radius * leftIllumination;
            ctx.ellipse(cx, cy, ellipseWidth, radius, 0, -Math.PI/2, Math.PI/2, true);

            ctx.closePath();
            ctx.clip();
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);
            ctx.restore();
        }

        ctx.restore();
    }

    function drawWaningPhase(cx, cy, radius, illumination) {
        // illumination: 1 (full) to 0 (new)

        ctx.save();

        if (illumination >= 0.5) {
            // Full to last quarter (1 to 0.5)
            // Left half always visible, right side shrinking

            // Draw left half
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI/2, -Math.PI/2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);
            ctx.restore();

            // Draw shrinking right side
            const rightIllumination = (illumination - 0.5) * 2; // 1 to 0
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI/2); // Right semicircle

            const ellipseWidth = radius * rightIllumination;
            ctx.ellipse(cx, cy, ellipseWidth, radius, 0, Math.PI/2, -Math.PI/2, true);

            ctx.closePath();
            ctx.clip();
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);
            ctx.restore();

        } else {
            // Last quarter to new (0.5 to 0)
            // Only left side visible with ellipse
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI/2, -Math.PI/2); // Left semicircle

            // Ellipse for shadow boundary
            const ellipseWidth = radius * (illumination * 2);
            ctx.ellipse(cx, cy, ellipseWidth, radius, 0, -Math.PI/2, Math.PI/2, true);

            ctx.closePath();
            ctx.clip();

            // Draw moon image
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);
        }

        ctx.restore();
    }

    function drawStars() {
        ctx.save();
        for (let i = 0; i < 100; i++) {
            const seed = i * 9876;
            const x = (seed % canvas.width);
            const y = ((seed * 13) % canvas.height);
            const size = 0.5 + ((seed % 15) / 15) * 1.5;
            const brightness = 0.3 + Math.random() * 0.7;

            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function updateMoon() {
        drawMoon();
        document.getElementById('currentDay').textContent = `음력 ${currentDay}일`;
        document.getElementById('phaseName').textContent = getPhaseName(currentDay);
    }

    // Initial draw
    if (imageLoaded) {
        updateMoon();
    }
});
