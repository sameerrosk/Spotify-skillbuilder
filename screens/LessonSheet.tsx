import React, { useState } from 'react';
import { LessonSheet as LessonSheetType, Quiz } from '../types';
import { Header, PrimaryButton, Badge } from '../components/Shared';
import { Check, X } from 'lucide-react';

interface LessonSheetProps {
  data: LessonSheetType;
  quiz: Quiz;
  dayCount: number;
  onFinish: () => void;
}

const LessonSheet: React.FC<LessonSheetProps> = ({ data, quiz, dayCount, onFinish }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[qIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    let newScore = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-spotify-base pb-24">
      <Header title={`Lesson Sheet: Day ${dayCount}`} subtitle="Review your key takeaways." />

      <div className="px-4 space-y-8">
        
        {/* AI Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-white">AI Summary</h3>
            <Badge color="bg-purple-600">Generated</Badge>
          </div>
          <div className="bg-spotify-surface p-5 rounded-lg text-gray-300 leading-relaxed text-sm border-l-4 border-purple-500">
            {data.aiSummary}
          </div>
        </section>

        {/* Vocabulary */}
        <section>
          <h3 className="text-lg font-bold text-white mb-3">Key Vocabulary</h3>
          <div className="grid gap-3">
            {data.vocabulary.map((vocab, idx) => (
              <div key={idx} className="bg-spotify-surface p-4 rounded-lg flex flex-col gap-1 border border-white/5">
                <span className="text-spotify-primary font-bold text-lg">{vocab.word}</span>
                <span className="text-gray-400 text-sm">{vocab.definition}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mini Quiz */}
        <section>
          <h3 className="text-lg font-bold text-white mb-3">Mini Quiz</h3>
          <div className="space-y-6">
            {quiz.questions.map((q, qIdx) => {
                const isCorrect = selectedAnswers[qIdx] === q.correctIndex;
                const showResult = submitted;

                return (
                    <div key={qIdx} className="bg-spotify-surface p-5 rounded-lg border border-white/5">
                        <p className="font-medium text-white mb-4">{q.q}</p>
                        <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                            let style = "border-white/20 text-gray-300 hover:bg-white/5";
                            if (selectedAnswers[qIdx] === optIdx) style = "border-spotify-primary bg-spotify-primary/10 text-spotify-primary font-medium";
                            
                            if (showResult) {
                                if (optIdx === q.correctIndex) style = "border-green-500 bg-green-500/20 text-green-400";
                                else if (selectedAnswers[qIdx] === optIdx) style = "border-red-500 bg-red-500/20 text-red-400";
                                else style = "border-transparent opacity-50";
                            }

                            return (
                                <button
                                    key={optIdx}
                                    onClick={() => handleOptionSelect(qIdx, optIdx)}
                                    disabled={submitted}
                                    className={`w-full text-left p-3 rounded border text-sm transition-all flex justify-between items-center ${style}`}
                                >
                                    {opt}
                                    {showResult && optIdx === q.correctIndex && <Check size={16} />}
                                    {showResult && selectedAnswers[qIdx] === optIdx && optIdx !== q.correctIndex && <X size={16} />}
                                </button>
                            );
                        })}
                        </div>
                    </div>
                );
            })}
          </div>

          {!submitted ? (
             <div className="mt-6">
                <PrimaryButton 
                    fullWidth 
                    onClick={handleSubmitQuiz}
                    disabled={selectedAnswers.includes(-1)}
                >
                    Submit Quiz
                </PrimaryButton>
             </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center animate-fade-in">
                <p className="text-gray-300 mb-2">You scored <span className="text-spotify-primary font-bold text-xl">{score}/{quiz.questions.length}</span></p>
                <PrimaryButton fullWidth onClick={onFinish}>
                    Return to Dashboard
                </PrimaryButton>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default LessonSheet;