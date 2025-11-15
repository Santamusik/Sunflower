// Simulator.js - Moon phase simulation with realistic graphics
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

    // Load moon texture image
    moonImage = new Image();
    moonImage.crossOrigin = "anonymous";

    // Create a realistic moon texture using canvas
    createMoonTexture().then(() => {
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

    function createMoonTexture() {
        return new Promise((resolve) => {
            const textureCanvas = document.createElement('canvas');
            textureCanvas.width = 300;
            textureCanvas.height = 300;
            const tctx = textureCanvas.getContext('2d');

            // Create realistic moon texture with craters and gradient
            const centerX = 150;
            const centerY = 150;
            const radius = 150;

            // Base moon color with radial gradient for 3D effect
            const gradient = tctx.createRadialGradient(
                centerX - 30, centerY - 30, 0,
                centerX, centerY, radius
            );
            gradient.addColorStop(0, '#f5f5f0');
            gradient.addColorStop(0.5, '#e8e8dc');
            gradient.addColorStop(0.8, '#d0d0c0');
            gradient.addColorStop(1, '#a8a898');

            tctx.fillStyle = gradient;
            tctx.beginPath();
            tctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            tctx.fill();

            // Add detailed craters with shadows
            const craters = [
                { x: 0.35, y: -0.25, r: 0.18, depth: 0.6 },
                { x: -0.25, y: 0.35, r: 0.12, depth: 0.5 },
                { x: 0.15, y: 0.45, r: 0.10, depth: 0.4 },
                { x: -0.45, y: -0.15, r: 0.15, depth: 0.55 },
                { x: 0.25, y: 0.15, r: 0.08, depth: 0.45 },
                { x: -0.15, y: -0.35, r: 0.11, depth: 0.5 },
                { x: 0.5, y: 0.2, r: 0.09, depth: 0.4 },
                { x: -0.3, y: -0.4, r: 0.07, depth: 0.35 },
                { x: 0.4, y: -0.45, r: 0.06, depth: 0.3 },
                { x: -0.5, y: 0.15, r: 0.08, depth: 0.4 },
                { x: 0.1, y: -0.15, r: 0.05, depth: 0.3 },
                { x: -0.1, y: 0.1, r: 0.06, depth: 0.35 }
            ];

            craters.forEach(crater => {
                const cx = centerX + crater.x * radius;
                const cy = centerY + crater.y * radius;
                const r = crater.r * radius;

                // Crater shadow
                const craterGradient = tctx.createRadialGradient(
                    cx - r * 0.3, cy - r * 0.3, 0,
                    cx, cy, r
                );
                craterGradient.addColorStop(0, `rgba(80, 80, 70, ${crater.depth * 0.3})`);
                craterGradient.addColorStop(0.6, `rgba(100, 100, 90, ${crater.depth * 0.2})`);
                craterGradient.addColorStop(1, 'rgba(120, 120, 110, 0)');

                tctx.fillStyle = craterGradient;
                tctx.beginPath();
                tctx.arc(cx, cy, r, 0, Math.PI * 2);
                tctx.fill();

                // Crater rim highlight
                tctx.strokeStyle = `rgba(255, 255, 245, ${crater.depth * 0.15})`;
                tctx.lineWidth = 1;
                tctx.beginPath();
                tctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.95, Math.PI, Math.PI * 1.5);
                tctx.stroke();
            });

            // Add some maria (dark patches)
            const maria = [
                { x: -0.2, y: 0.2, r: 0.25, opacity: 0.15 },
                { x: 0.3, y: -0.1, r: 0.2, opacity: 0.12 },
                { x: -0.35, y: -0.3, r: 0.18, opacity: 0.1 }
            ];

            maria.forEach(mare => {
                const mx = centerX + mare.x * radius;
                const my = centerY + mare.y * radius;
                const r = mare.r * radius;

                const mareGradient = tctx.createRadialGradient(mx, my, 0, mx, my, r);
                mareGradient.addColorStop(0, `rgba(100, 100, 90, ${mare.opacity})`);
                mareGradient.addColorStop(1, 'rgba(100, 100, 90, 0)');

                tctx.fillStyle = mareGradient;
                tctx.beginPath();
                tctx.arc(mx, my, r, 0, Math.PI * 2);
                tctx.fill();
            });

            // Add subtle noise for texture
            const imageData = tctx.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 10;
                data[i] += noise;     // R
                data[i + 1] += noise; // G
                data[i + 2] += noise; // B
            }
            tctx.putImageData(imageData, 0, 0);

            // Convert to image
            moonImage.src = textureCanvas.toDataURL();
            moonImage.onload = () => resolve();
        });
    }

    function getMoonPhase(day) {
        // Calculate accurate moon phase based on lunar cycle
        // 0 = new moon (삭), 0.25 = first quarter (상현), 0.5 = full moon (망), 0.75 = last quarter (하현)
        const phase = (day - 1) / 29.5;
        return phase;
    }

    function getPhaseName(day) {
        // Updated to match correct lunar calendar
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

        // Clear canvas with night sky
        const skyGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, canvas.width
        );
        skyGradient.addColorStop(0, '#1a1a3e');
        skyGradient.addColorStop(1, '#0a0a1e');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars
        drawStars();

        // Calculate illumination phase (0 to 1)
        const phase = getMoonPhase(currentDay);

        // Draw the moon with proper phase
        drawMoonPhase(centerX, centerY, radius, phase);

        // Draw subtle moon glow
        const glowGradient = ctx.createRadialGradient(
            centerX, centerY, radius,
            centerX, centerY, radius + 20
        );
        glowGradient.addColorStop(0, 'rgba(255, 255, 240, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 240, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawMoonPhase(centerX, centerY, radius, phase) {
        // phase: 0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter, 1 = new moon

        ctx.save();

        // Create circular clipping region for the moon
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();

        // Fill with dark background first
        ctx.fillStyle = '#0a0a1e';
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

        // Calculate the illuminated fraction
        // phase 0-0.5: waxing (right side appears first, grows to full)
        // phase 0.5-1: waning (left side remains, shrinks to nothing)

        ctx.save();

        if (phase <= 0.5) {
            // Waxing phase (0 to 0.5): moon grows from right
            const illumination = phase * 2; // 0 to 1

            if (illumination < 0.5) {
                // Waxing crescent (0 to 0.25): thin crescent on right
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, -Math.PI/2, Math.PI/2); // Right semicircle

                // Draw the ellipse for the shadow edge
                const shadowWidth = radius * (1 - illumination * 2);
                ctx.ellipse(centerX, centerY, shadowWidth, radius, 0, Math.PI/2, -Math.PI/2, true);

                ctx.closePath();
                ctx.clip();
                ctx.drawImage(moonImage, centerX - radius, centerY - radius, radius * 2, radius * 2);

            } else {
                // Waxing gibbous (0.25 to 0.5): right half + growing left side
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, -Math.PI/2, Math.PI/2); // Right semicircle
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(moonImage, centerX - radius, centerY - radius, radius * 2, radius * 2);

                ctx.restore();
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.clip();

                // Add left side illumination
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, Math.PI/2, -Math.PI/2); // Left semicircle

                const leftWidth = radius * ((illumination - 0.5) * 2);
                ctx.ellipse(centerX, centerY, leftWidth, radius, 0, -Math.PI/2, Math.PI/2, true);

                ctx.closePath();
                ctx.clip();
                ctx.drawImage(moonImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
            }

        } else {
            // Waning phase (0.5 to 1): moon shrinks from right
            const illumination = 1 - ((phase - 0.5) * 2); // 1 to 0

            if (illumination > 0.5) {
                // Waning gibbous (0.5 to 0.75): left half + shrinking right side
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, Math.PI/2, -Math.PI/2); // Left semicircle
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(moonImage, centerX - radius, centerY - radius, radius * 2, radius * 2);

                ctx.restore();
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.clip();

                // Add right side illumination
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, -Math.PI/2, Math.PI/2); // Right semicircle

                const rightWidth = radius * ((illumination - 0.5) * 2);
                ctx.ellipse(centerX, centerY, rightWidth, radius, 0, Math.PI/2, -Math.PI/2, true);

                ctx.closePath();
                ctx.clip();
                ctx.drawImage(moonImage, centerX - radius, centerY - radius, radius * 2, radius * 2);

            } else {
                // Waning crescent (0.75 to 1): thin crescent on left
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, Math.PI/2, -Math.PI/2); // Left semicircle

                const shadowWidth = radius * (1 - illumination * 2);
                ctx.ellipse(centerX, centerY, shadowWidth, radius, 0, -Math.PI/2, Math.PI/2, true);

                ctx.closePath();
                ctx.clip();
                ctx.drawImage(moonImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
            }
        }

        ctx.restore();
        ctx.restore();

        // Add terminator shadow for 3D effect
        addTerminatorShadow(centerX, centerY, radius, phase);
    }

    function addTerminatorShadow(centerX, centerY, radius, phase) {
        // Add a subtle shadow along the terminator for 3D depth
        ctx.save();

        ctx.globalCompositeOperation = 'source-atop';

        let shadowGradient;
        if (phase < 0.5) {
            // Waxing: shadow on the left
            const shadowPosition = centerX - radius + (phase * 2) * radius;
            shadowGradient = ctx.createLinearGradient(
                shadowPosition - 30, centerY,
                shadowPosition + 30, centerY
            );
            shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
            shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            // Waning: shadow on the right
            const shadowPosition = centerX + radius - ((phase - 0.5) * 2) * radius;
            shadowGradient = ctx.createLinearGradient(
                shadowPosition + 30, centerY,
                shadowPosition - 30, centerY
            );
            shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
            shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function drawStars() {
        // Draw twinkling stars
        ctx.save();
        const starCount = 80;

        for (let i = 0; i < starCount; i++) {
            // Use seed for consistent star positions
            const seed = i * 12345;
            const x = (seed % canvas.width);
            const y = ((seed * 7) % canvas.height);
            const size = 0.5 + ((seed % 10) / 10) * 1.5;

            // Random brightness
            const brightness = 0.4 + (Math.random() * 0.6);

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
