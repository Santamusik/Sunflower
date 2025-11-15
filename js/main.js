// Main.js - Student information handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const studentInfo = {
                school: document.getElementById('school').value,
                grade: document.getElementById('grade').value,
                class: document.getElementById('class').value,
                name: document.getElementById('name').value,
                timestamp: new Date().toISOString()
            };

            // Save student info to session storage
            sessionStorage.setItem('currentStudent', JSON.stringify(studentInfo));

            // Redirect to simulator
            window.location.href = 'simulator.html';
        });
    }
});
