document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bmiForm');
    const resultContainer = document.getElementById('resultContainer');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');

    // Real-time validation
    weightInput.addEventListener('input', validateInput);
    heightInput.addEventListener('input', validateInput);

    function validateInput(e) {
        const input = e.target;
        const value = parseFloat(input.value);
        
        if (input.value && (isNaN(value) || value <= 0)) {
            input.style.borderColor = '#e74c3c';
            input.style.backgroundColor = '#ffe6e6';
        } else {
            input.style.borderColor = '#ddd';
            input.style.backgroundColor = 'white';
        }
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const weight = weightInput.value;
        const height = heightInput.value;
        
        // Basic client-side validation
        if (!weight || !height) {
            showError('Please fill in all fields');
            return;
        }
        
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        
        if (isNaN(weightNum) || isNaN(heightNum)) {
            showError('Please enter valid numbers');
            return;
        }
        
        if (weightNum <= 0 || heightNum <= 0) {
            showError('Weight and height must be positive numbers');
            return;
        }
        
        if (heightNum > 3) {
            showError('Height should be in meters (e.g., 1.75 not 175)');
            return;
        }
        
        // Send data to server
        try {
            const response = await fetch('/calculate-bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight: weightNum, height: heightNum })
            });
            
            const data = await response.json();
            
            if (data.success) {
                displayResult(data);
            } else {
                showError(data.error || 'An error occurred');
            }
        } catch (error) {
            showError('Network error. Please try again.');
        }
    });

    function displayResult(data) {
        const html = `
            <div class="result-display">
                <div class="bmi-value" style="color: ${data.color}">
                    ${data.bmi}
                </div>
                <div class="bmi-category" style="background-color: ${data.color}20; color: ${data.color};">
                    ${data.category}
                </div>
                <p style="color: #666; margin: 15px 0;">${data.message}</p>
                <div class="interpretation">
                    <i class="fas fa-info-circle" style="color: ${data.color};"></i>
                    ${data.interpretation}
                </div>
            </div>
        `;
        
        resultContainer.innerHTML = html;
        resultContainer.style.border = `2px solid ${data.color}`;
        resultContainer.style.borderStyle = 'solid';
    }

    function showError(message) {
        const html = `
            <div class="result-display" style="color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
        
        resultContainer.innerHTML = html;
        resultContainer.style.borderColor = '#e74c3c';
    }
});