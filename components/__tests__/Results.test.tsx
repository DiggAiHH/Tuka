import React from 'react';
import { render, screen } from '@testing-library/react';
import Results from '../Results';

describe('Results', () => {
  test('shows correction button when there are wrong answers', () => {
    render(
      <Results
        results={{
          score: 1,
          total: 3,
          history: [
            { problem: { question: '1+1', answer: '2', explanation: '2', steps: [], hints: [] }, userAnswer: '2', isCorrect: true },
            { problem: { question: '2+2', answer: '4', explanation: '4', steps: [], hints: [] }, userAnswer: '5', isCorrect: false }
          ]
        }}
        onRestart={() => {}}
        onPracticeAgain={() => {}}
        onCorrectWrong={() => {}}
      />
    );

    expect(screen.getByText(/Fehler korrigieren!/i)).toBeInTheDocument();
  });

  test('renders grade label', () => {
    render(
      <Results
        results={{ score: 5, total: 5, history: [] }}
        onRestart={() => {}}
        onPracticeAgain={() => {}}
        onCorrectWrong={() => {}}
      />
    );

    expect(screen.getByText(/Tukas Note/i)).toBeInTheDocument();
  });
});
