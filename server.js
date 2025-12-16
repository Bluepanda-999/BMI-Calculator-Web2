const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// BMI calculation function
function calculateBMI(weight, height) {
    const bmi = weight / (height * height);
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3498db';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        color = '#2ecc71';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = '#f39c12';
    } else {
        category = 'Obese';
        color = '#e74c3c';
    }
    
    return {
        bmi: bmi.toFixed(2),
        category,
        color
    };
}

// Get interpretation
function getInterpretation(category) {
    const interpretations = {
        'Underweight': 'You may need to gain some weight. Consider consulting a nutritionist.',
        'Normal weight': 'You have a healthy weight. .',
        'Overweight': 'Consider some lifestyle changes like regular exercise and balanced diet.',
        'Obese': 'It is recommended to consult a healthcare professional for guidance.'
    };
    return interpretations[category] || '';
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/calculate-bmi', (req, res) => {
    try {
        const { weight, height } = req.body;
        
        // Validation
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        
        if (isNaN(weightNum) || isNaN(heightNum)) {
            return res.status(400).json({
                error: 'Please enter valid numbers for weight and height'
            });
        }
        
        if (weightNum <= 0 || heightNum <= 0) {
            return res.status(400).json({
                error: 'Weight and height must be positive numbers'
            });
        }
        
        if (heightNum > 3) {
            return res.status(400).json({
                error: 'Height should be in meters (e.g., 1.75 not 175)'
            });
        }
        
        // Calculate BMI
        const result = calculateBMI(weightNum, heightNum);
        
        res.json({
            success: true,
            bmi: result.bmi,
            category: result.category,
            color: result.color,
            message: `Your BMI is ${result.bmi} (${result.category})`,
            interpretation: getInterpretation(result.category)
        });
        
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred during calculation'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📊 BMI Calculator is ready!`);
    console.log(`📁 Folder: ${__dirname}`);
});