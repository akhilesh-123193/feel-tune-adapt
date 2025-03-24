import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

type Emotion = 'joy' | 'sadness' | 'anger' | 'calm' | 'neutral';

interface EmotionData {
  emotion: Emotion;
  score: number;
}

const EmotionDetector: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState<Emotion | null>(null);
  const [emotionScores, setEmotionScores] = useState<EmotionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setIsModelLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load emotion detection models');
        setIsLoading(false);
      }
    };

    loadModels();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    if (!isModelLoaded) {
      setError('Models are not loaded yet');
      return;
    }

    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setError(null);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    setDominantEmotion(null);
    setEmotionScores([]);
  };

  const mapFaceApiToEmotions = (expressions: faceapi.FaceExpressions): EmotionData[] => {
    const mappedEmotions: EmotionData[] = [];
    
    // Map joy
    mappedEmotions.push({
      emotion: 'joy',
      score: expressions.happy
    });
    
    // Map sadness
    mappedEmotions.push({
      emotion: 'sadness',
      score: expressions.sad
    });
    
    // Map anger
    mappedEmotions.push({
      emotion: 'anger',
      score: expressions.angry
    });
    
    // Map calm (using a combination of neutral and relaxed if available)
    mappedEmotions.push({
      emotion: 'calm',
      score: (expressions.neutral + (expressions as any).relaxed || 0) / 2
    });
    
    // Sort by score in descending order
    return mappedEmotions.sort((a, b) => b.score - a.score);
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const detectEmotions = async () => {
        if (video.readyState === 4) { // Video is ready
          // Match canvas dimensions to video
          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);
          
          // Detect faces with expressions
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
          
          // Clear previous drawings
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw results on canvas
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          
          // Update emotion state if faces detected
          if (detections.length > 0) {
            const expressions = detections[0].expressions;
            const mappedEmotions = mapFaceApiToEmotions(expressions);
            setEmotionScores(mappedEmotions);
            setDominantEmotion(mappedEmotions[0].emotion);
          }
        }
        
        // Continue detection loop
        if (isCameraActive) {
          requestAnimationFrame(detectEmotions);
        }
      };
      
      detectEmotions();
    }
  }, [isCameraActive]);

  const getEmotionColor = (emotion: Emotion): string => {
    switch (emotion) {
      case 'joy': return 'bg-emotion-joy';
      case 'sadness': return 'bg-emotion-sadness';
      case 'anger': return 'bg-emotion-anger';
      case 'calm': return 'bg-emotion-calm';
      default: return 'bg-gray-400';
    }
  };

  const getEmotionEmoji = (emotion: Emotion): string => {
    switch (emotion) {
      case 'joy': return '😊';
      case 'sadness': return '😢';
      case 'anger': return '😠';
      case 'calm': return '😌';
      default: return '😐';
    }
  };

  const getEmotionDescription = (emotion: Emotion): string => {
    switch (emotion) {
      case 'joy':
        return 'You seem happy! We recommend upbeat, energetic music to match your mood.';
      case 'sadness':
        return 'You seem a bit down. How about some soothing, reflective music to help process your emotions?';
      case 'anger':
        return 'You seem frustrated. We suggest calming music to help reduce stress and tension.';
      case 'calm':
        return 'You seem relaxed. We recommend ambient or acoustic music to maintain your peaceful state.';
      default:
        return 'We\'ll recommend music based on your emotional state.';
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Emotion Detection
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our AI analyzes your facial expressions to detect your current emotional state and recommend music that matches or enhances your mood.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <motion.div 
              className="rounded-lg overflow-hidden shadow-xl bg-gray-100 aspect-video relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full"
              />
              
              {!isCameraActive && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-6">
                  <p className="text-xl mb-4 text-center">
                    Click below to activate your camera and detect your emotions in real-time
                  </p>
                  <Button 
                    onClick={startCamera}
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Scan Emotions Now
                  </Button>
                </div>
              )}
            </motion.div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {isCameraActive && (
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Stop Camera
                </Button>
              </div>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Your Emotional Profile</h3>
              
              {dominantEmotion ? (
                <>
                  <div className="mb-8">
                    <div className={`inline-block text-5xl p-4 rounded-full ${getEmotionColor(dominantEmotion)}`}>
                      {getEmotionEmoji(dominantEmotion)}
                    </div>
                    <h4 className="text-xl font-semibold mt-4 capitalize">{dominantEmotion}</h4>
                    <p className="text-gray-600 mt-2">
                      {getEmotionDescription(dominantEmotion)}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-3">Emotion Breakdown</h5>
                    <div className="space-y-3">
                      {emotionScores.map((item) => (
                        <div key={item.emotion}>
                          <div className="flex justify-between mb-1">
                            <span className="capitalize">{item.emotion}</span>
                            <span>{Math.round(item.score * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getEmotionColor(item.emotion)}`}
                              style={{ width: `${Math.round(item.score * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {isLoading 
                      ? 'Loading emotion detection...' 
                      : isCameraActive 
                        ? 'Looking for your face...' 
                        : 'Activate the camera to see your emotional profile'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmotionDetector;
