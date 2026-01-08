const express = require('express');
const { saveQuizResult, getQuizHistory, updateUserLevel } = require('./database');

const router = express.Router();

// Quiz questions (chemistry, increasing difficulty)
const questions = [
  { id: 1, question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'O2', 'N2'], answer: 'H2O', difficulty: 1 },
  { id: 2, question: 'What is the atomic number of carbon?', options: ['6', '8', '12', '14'], answer: '6', difficulty: 1 },
  { id: 3, question: 'What is the pH of pure water?', options: ['7', '0', '14', '1'], answer: '7', difficulty: 2 },
  { id: 4, question: 'Which element has the highest electronegativity?', options: ['Fluorine', 'Oxygen', 'Nitrogen', 'Chlorine'], answer: 'Fluorine', difficulty: 2 },
  { id: 5, question: 'What is Avogadro\'s number?', options: ['6.022 × 10^23', '3.14', '1.602 × 10^-19', '9.81'], answer: '6.022 × 10^23', difficulty: 3 },
  { id: 6, question: 'What is the name of the process where a solid turns directly into a gas?', options: ['Sublimation', 'Evaporation', 'Condensation', 'Melting'], answer: 'Sublimation', difficulty: 3 },
  { id: 7, question: 'Which quantum number describes the orientation of an electron?', options: ['Magnetic', 'Principal', 'Azimuthal', 'Spin'], answer: 'Magnetic', difficulty: 4 },
  { id: 8, question: 'What is the formula for calculating Gibbs free energy?', options: ['ΔG = ΔH - TΔS', 'E = mc²', 'F = ma', 'PV = nRT'], answer: 'ΔG = ΔH - TΔS', difficulty: 4 },
];

// Get questions
router.get('/questions', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(questions);
});

// Submit quiz
router.post('/submit', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const { answers } = req.body;
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        score += q.difficulty;
      }
    });

    let level = 'Beginner';
    if (score >= 15) level = 'Advanced';
    else if (score >= 10) level = 'Intermediate';
    
    // Save quiz result to database
    await saveQuizResult(req.session.userId, score, level);
    
    // Update user level
    await updateUserLevel(req.session.userId, level);
    
    res.json({ 
      score, 
      level, 
      totalQuestions: questions.length,
      maxScore: questions.reduce((sum, q) => sum + q.difficulty, 0)
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ 
      error: 'Failed to save quiz result',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get quiz history
router.get('/history', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  
  try {
    const results = await getQuizHistory(req.session.userId);
    res.json(results);
  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve quiz history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
