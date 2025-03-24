import React, { useState } from 'react';
import { Button } from './ui/button';

const FeedbackBox: React.FC = () => {
  const [songFeedback, setSongFeedback] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple submission handling
    console.log('Feedback submitted:', { songFeedback, improvements });
    setIsSubmitted(true);
    setSongFeedback('');
    setImprovements('');
    
    // Reset submission status after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Share Your Feedback</h2>
          <p className="text-lg text-gray-600">
            We'd love to hear your thoughts on the song recommendations and how we can improve your experience.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p>Your feedback has been submitted successfully. We appreciate your input!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <label htmlFor="songFeedback" className="block text-lg font-medium mb-2">
                What did you think about the song recommendations?
              </label>
              <textarea
                id="songFeedback"
                value={songFeedback}
                onChange={(e) => setSongFeedback(e.target.value)}
                placeholder="Were the songs appropriate for your mood? Did you enjoy them?"
                className="w-full p-3 border rounded-md"
                rows={4}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="improvements" className="block text-lg font-medium mb-2">
                How can we improve?
              </label>
              <textarea
                id="improvements"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Any suggestions for improving our mood detection or song recommendations?"
                className="w-full p-3 border rounded-md"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              Submit Feedback
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default FeedbackBox;
