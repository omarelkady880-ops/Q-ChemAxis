const request = require('supertest');
const express = require('express');

// Mock quiz data
const mockQuizzes = {
  organic: {
    title: 'Organic Chemistry Basics',
    questions: [
      {
        id: 1,
        question: 'What is the general formula for alkanes?',
        options: ['CnH2n+2', 'CnH2n', 'CnHn', 'CnH2n-2'],
        correctAnswer: 0,
        explanation: 'Alkanes are saturated hydrocarbons with the formula CnH2n+2.'
      },
      {
        id: 2,
        question: 'Which functional group is present in alcohols?',
        options: ['-OH', '-COOH', '-NH2', '-CHO'],
        correctAnswer: 0,
        explanation: 'Alcohols contain the hydroxyl (-OH) functional group.'
      }
    ]
  },
  inorganic: {
    title: 'Inorganic Chemistry Fundamentals',
    questions: [
      {
        id: 1,
        question: 'What is the oxidation state of oxygen in most compounds?',
        options: ['-2', '+2', '0', '+1'],
        correctAnswer: 0,
        explanation: 'Oxygen typically has an oxidation state of -2 in compounds.'
      }
    ]
  }
};

// Mock quiz functions
const quiz = {
  getQuiz: (req, res) => {
    const { subject } = req.params;
    const quizData = mockQuizzes[subject];

    if (!quizData) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      title: quizData.title,
      questions: quizData.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
      }))
    });
  },

  submitQuiz: (req, res) => {
    const { subject, answers } = req.body;
    const quizData = mockQuizzes[subject];

    if (!quizData) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correct = 0;
    let total = quizData.questions.length;
    const results = [];

    quizData.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;

      results.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    const score = Math.round((correct / total) * 100);

    res.json({
      score,
      correct,
      total,
      results,
      feedback: score >= 80 ? 'Excellent!' : score >= 60 ? 'Good job!' : 'Keep studying!'
    });
  }
};

// Create test app
const app = express();
app.use(express.json());
app.get('/api/quiz/:subject', quiz.getQuiz);
app.post('/api/quiz/submit', quiz.submitQuiz);

describe('Quiz Logic Tests', () => {
  describe('GET /api/quiz/:subject', () => {
    test('should return quiz data for valid subject', async () => {
      const response = await request(app)
        .get('/api/quiz/organic')
        .expect(200);

      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('questions');
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);

      // Check that questions don't include correct answers
      response.body.questions.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('options');
        expect(question).not.toHaveProperty('correctAnswer');
        expect(question).not.toHaveProperty('explanation');
      });
    });

    test('should return 404 for invalid subject', async () => {
      const response = await request(app)
        .get('/api/quiz/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('Quiz not found');
    });
  });

  describe('POST /api/quiz/submit', () => {
    test('should grade quiz correctly', async () => {
      const answers = {
        1: 0, // Correct answer for question 1
        2: 0  // Correct answer for question 2
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({
          subject: 'organic',
          answers
        })
        .expect(200);

      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('correct');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('feedback');

      expect(response.body.correct).toBe(2);
      expect(response.body.total).toBe(2);
      expect(response.body.score).toBe(100);
      expect(response.body.results.length).toBe(2);

      response.body.results.forEach(result => {
        expect(result).toHaveProperty('questionId');
        expect(result).toHaveProperty('userAnswer');
        expect(result).toHaveProperty('correctAnswer');
        expect(result).toHaveProperty('isCorrect');
        expect(result).toHaveProperty('explanation');
      });
    });

    test('should handle partial correct answers', async () => {
      const answers = {
        1: 0, // Correct
        2: 1  // Incorrect
      };

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({
          subject: 'organic',
          answers
        })
        .expect(200);

      expect(response.body.correct).toBe(1);
      expect(response.body.total).toBe(2);
      expect(response.body.score).toBe(50);

      const correctResult = response.body.results.find(r => r.questionId === 1);
      const incorrectResult = response.body.results.find(r => r.questionId === 2);

      expect(correctResult.isCorrect).toBe(true);
      expect(incorrectResult.isCorrect).toBe(false);
    });

    test('should return 404 for invalid subject', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({
          subject: 'nonexistent',
          answers: {}
        })
        .expect(404);

      expect(response.body.error).toBe('Quiz not found');
    });

    test('should handle empty answers', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({
          subject: 'organic',
          answers: {}
        })
        .expect(200);

      expect(response.body.correct).toBe(0);
      expect(response.body.total).toBe(2);
      expect(response.body.score).toBe(0);
    });
  });
});
