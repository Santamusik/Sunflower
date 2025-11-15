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

    // Load actual moon image
    moonImage = new Image();
    moonImage.crossOrigin = "anonymous";

    // Use high-quality moon image from reliable source
    moonImage.src = 'https://images.unsplash.com/photo-1526039330210-c60a84fe1f99?w=800&q=80';

    moonImage.onload = () => {
        imageLoaded = true;
        updateMoon();
    };

    moonImage.onerror = () => {
        console.log('Failed to load external image, using fallback');
        // Fallback: create simple moon texture
        createSimpleMoonTexture().then(() => {
            imageLoaded = true;
            updateMoon();
        });
    };

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

    function createSimpleMoonTexture() {
        return new Promise((resolve) => {
            const size = 500;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tempCtx = tempCanvas.getContext('2d');

            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size / 2;

            // Simple gradient moon
            const gradient = tempCtx.createRadialGradient(
                centerX - radius * 0.25, centerY - radius * 0.25, radius * 0.1,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.4, '#f5f5f0');
            gradient.addColorStop(0.7, '#e0e0d5');
            gradient.addColorStop(1, '#b0b0a0');

            tempCtx.fillStyle = gradient;
            tempCtx.beginPath();
            tempCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            tempCtx.fill();

            moonImage.src = tempCanvas.toDataURL();
            moonImage.onload = () => resolve();
        });
    }

    function getMoonPhase(day) {
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

        // Night sky background
        const skyGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width);
        skyGrad.addColorStop(0, '#1a1a3e');
        skyGrad.addColorStop(1, '#0a0a1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        drawStars();

        // Get phase (0 to 1)
        const phase = getMoonPhase(currentDay);

        // Draw moon with correct phase
        drawMoonPhase(centerX, centerY, radius, phase);

        // Glow effect
        const glowGrad = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 30);
        glowGrad.addColorStop(0, 'rgba(255, 255, 245, 0.5)');
        glowGrad.addColorStop(1, 'rgba(255, 255, 245, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawMoonPhase(cx, cy, radius, phase) {
        ctx.save();

        // Clip to circle
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        // Dark background
        ctx.fillStyle = '#0a0a1e';
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

        // Calculate illumination
        // phase 0 = new moon, 0.5 = full moon, 1 = new moon
        let illuminatedFraction;
        let isWaxing;

        if (phase < 0.5) {
            // Waxing (growing)
            illuminatedFraction = phase * 2; // 0 to 1
            isWaxing = true;
        } else {
            // Waning (shrinking)
            illuminatedFraction = 2 - (phase * 2); // 1 to 0
            isWaxing = false;
        }

        // Draw illuminated part
        ctx.save();

        // Create clipping path for illuminated region
        ctx.beginPath();

        if (illuminatedFraction === 0) {
            // New moon - no illumination (already dark)
            ctx.restore();
            ctx.restore();
            return;
        }

        if (illuminatedFraction >= 0.99) {
            // Full moon - draw entire moon
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);
            ctx.restore();
            ctx.restore();
            return;
        }

        // Calculate the position of the terminator (shadow line)
        // For waxing: light comes from right
        // For waning: light comes from left

        if (isWaxing) {
            // Waxing moon (light from right)
            if (illuminatedFraction <= 0.5) {
                // Crescent - right side only
                drawCrescent(ctx, cx, cy, radius, illuminatedFraction, true);
            } else {
                // Gibbous - mostly lit, shadow on left
                drawGibbous(ctx, cx, cy, radius, illuminatedFraction, true);
            }
        } else {
            // Waning moon (light from left)
            if (illuminatedFraction <= 0.5) {
                // Crescent - left side only
                drawCrescent(ctx, cx, cy, radius, illuminatedFraction, false);
            } else {
                // Gibbous - mostly lit, shadow on right
                drawGibbous(ctx, cx, cy, radius, illuminatedFraction, false);
            }
        }

        ctx.drawImage(moonImage, cx - radius, cy - radius, radius * 2, radius * 2);

        ctx.restore();
        ctx.restore();
    }

    function drawCrescent(ctx, cx, cy, radius, fraction, isRight) {
        // fraction: 0 to 0.5
        // Draw a crescent shape

        ctx.beginPath();

        if (isRight) {
            // Right crescent (waxing)
            ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI/2); // Right semicircle

            // Inner curve (shadow boundary)
            const curveOffset = radius * (1 - fraction * 2);
            ctx.ellipse(cx, cy, curveOffset, radius, 0, Math.PI/2, -Math.PI/2, true);
        } else {
            // Left crescent (waning)
            ctx.arc(cx, cy, radius, Math.PI/2, -Math.PI/2); // Left semicircle

            // Inner curve
            const curveOffset = radius * (1 - fraction * 2);
            ctx.ellipse(cx, cy, curveOffset, radius, 0, -Math.PI/2, Math.PI/2, true);
        }

        ctx.closePath();
        ctx.clip();
    }

    function drawGibbous(ctx, cx, cy, radius, fraction, isRight) {
        // fraction: 0.5 to 1
        // Draw a gibbous shape (mostly full with shadow on one side)

        const shadowFraction = 1 - fraction; // How much is in shadow

        if (isRight) {
            // Right side lit, left side has shadow (waxing gibbous)
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2); // Full circle

            // Cut out left shadow
            const shadowWidth = radius * shadowFraction * 2;
            ctx.moveTo(cx, cy - radius);
            ctx.arc(cx, cy, radius, -Math.PI/2, Math.PI/2); // Right side
            ctx.ellipse(cx, cy, shadowWidth, radius, 0, Math.PI/2, -Math.PI/2, true);
            ctx.closePath();
            ctx.clip();

        } else {
            // Left side lit, right side has shadow (waning gibbous)
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2); // Full circle

            // Cut out right shadow
            const shadowWidth = radius * shadowFraction * 2;
            ctx.moveTo(cx, cy - radius);
            ctx.arc(cx, cy, radius, Math.PI/2, -Math.PI/2); // Left side
            ctx.ellipse(cx, cy, shadowWidth, radius, 0, -Math.PI/2, Math.PI/2, true);
            ctx.closePath();
            ctx.clip();
        }
    }

    function drawStars() {
        ctx.save();
        for (let i = 0; i < 120; i++) {
            const seed = i * 9876;
            const x = (seed % canvas.width);
            const y = ((seed * 13) % canvas.height);
            const size = 0.5 + ((seed % 20) / 20) * 2;
            const brightness = 0.2 + Math.random() * 0.8;

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
