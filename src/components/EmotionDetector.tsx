import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

type Emotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'disgusted' | 'fearful' | 'neutral';

interface EmotionData {
  emotion: Emotion;
  score: number;
}

interface SongRecommendation {
  title: string;
  artist: string;
  url: string;
  mood: Emotion[];
}

const EmotionDetector: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState<Emotion | null>(null);
  const [emotionScores, setEmotionScores] = useState<EmotionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [finalReport, setFinalReport] = useState<{
    dominant: Emotion | null;
    scores: EmotionData[];
  }>({ dominant: null, scores: [] });
  const [songRecommendations, setSongRecommendations] = useState<SongRecommendation[]>([]);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Updated music database with Spotify URLs
  const moodMusicDatabase: Record<Emotion, SongRecommendation[]> = {
    happy: [
      { title: "Don't Stop Me Now", artist: "Queen", url: "https://open.spotify.com/track/7hQJA50XrCWABAu5v6QZ4i", mood: ['happy'] },
      { title: "Happy", artist: "Pharrell Williams", url: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH", mood: ['happy'] },
      { title: "Walking on Sunshine", artist: "Katrina & The Waves", url: "https://open.spotify.com/track/05qwRGnKxOkuPvXzF4JfHR", mood: ['happy'] }
    ],
    sad: [
      { title: "Someone Like You", artist: "Adele", url: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV", mood: ['sad'] },
      { title: "Everybody Hurts", artist: "R.E.M.", url: "https://open.spotify.com/track/4tCWWnk3BXip7vjYiH8zCg", mood: ['sad'] },
      { title: "Hurt", artist: "Johnny Cash", url: "https://open.spotify.com/track/6gAqtDMQH6m56KQ1sdH3JE", mood: ['sad'] }
    ],
    angry: [
      { title: "Break Stuff", artist: "Limp Bizkit", url: "https://open.spotify.com/track/2ysaNoGVk5fZ4XmRh3O7cz", mood: ['angry'] },
      { title: "Killing in the Name", artist: "Rage Against the Machine", url: "https://open.spotify.com/track/59WN2psjkt1tyaxjspN8fp", mood: ['angry'] },
      { title: "Bodies", artist: "Drowning Pool", url: "https://open.spotify.com/track/3Px7aD2grqiAXe7UZ365Jl", mood: ['angry'] }
    ],
    surprised: [
      { title: "Bohemian Rhapsody", artist: "Queen", url: "https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J", mood: ['surprised'] },
      { title: "Thriller", artist: "Michael Jackson", url: "https://open.spotify.com/track/3S2R0EVwBSAVMd5UMgKTL0", mood: ['surprised'] },
      { title: "Somebody That I Used To Know", artist: "Gotye", url: "https://open.spotify.com/track/4CJ6zxihz2tu7lcIqP7WVI", mood: ['surprised'] }
    ],
    disgusted: [
      { title: "My Way", artist: "Frank Sinatra", url: "https://open.spotify.com/track/3gSUsCWAvF2T1G4jDqHBNI", mood: ['disgusted'] },
      { title: "You Oughta Know", artist: "Alanis Morissette", url: "https://open.spotify.com/track/3X1Lr3Q62EC0Tqe7hnSFDm", mood: ['disgusted'] },
      { title: "Smack My Bitch Up", artist: "The Prodigy", url: "https://open.spotify.com/track/2lA6cLb1lxth6B7MJGmH3t", mood: ['disgusted'] }
    ],
    fearful: [
      { title: "Fear of the Dark", artist: "Iron Maiden", url: "https://open.spotify.com/track/6m1MOUXhfbFvHKtLk4dVl7", mood: ['fearful'] },
      { title: "Runaway", artist: "Kanye West", url: "https://open.spotify.com/track/3DK6m7It6Pw857FcQftMds", mood: ['fearful'] },
      { title: "The Number of the Beast", artist: "Iron Maiden", url: "https://open.spotify.com/track/3XG5dfVd6YAdaxBmMQhQYA", mood: ['fearful'] }
    ],
    neutral: [
      { title: "Imagine", artist: "John Lennon", url: "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9", mood: ['neutral'] },
      { title: "What a Wonderful World", artist: "Louis Armstrong", url: "https://open.spotify.com/track/29U7stRjqHU6rMiS8BfaI9", mood: ['neutral'] },
      { title: "Here Comes the Sun", artist: "The Beatles", url: "https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2", mood: ['neutral'] }
    ]
  };

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setIsModelLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Failed to load emotion detection models. Please check your console for more details.');
        setIsLoading(false);
      }
    };

    loadModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  // Face detection and emotion analysis
  useEffect(() => {
    if (!isCameraActive || !isModelLoaded) return;

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        const canvas = canvasRef.current;
        const displaySize = {
          width: videoRef.current.offsetWidth,
          height: videoRef.current.offsetHeight
        };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        if (detections.length > 0) {
          setFaceDetectionError(null);
          const expressions = detections[0].expressions;
          const emotionData: EmotionData[] = Object.entries(expressions)
            .map(([emotion, score]) => ({
              emotion: emotion as Emotion,
              score: score as number
            }))
            .sort((a, b) => b.score - a.score);

          setEmotionScores(emotionData);
          setDominantEmotion(emotionData[0].emotion);
        } else {
          setFaceDetectionError('No face detected. Please ensure your face is visible.');
          setDominantEmotion(null);
          setEmotionScores([]);
        }
      } catch (err) {
        console.error('Error detecting faces:', err);
      }
    };

    detectionIntervalRef.current = setInterval(detectFaces, 300);
    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, [isCameraActive, isModelLoaded]);

  const getMusicRecommendations = (emotion: Emotion | null): SongRecommendation[] => {
    if (!emotion) return [];
    const songsForMood = [...moodMusicDatabase[emotion]];
    const shuffled = songsForMood.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const startCamera = async () => {
    if (!isModelLoaded) {
      setError('Models are not loaded yet');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setFaceDetectionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
          setError(null);
          setTimeLeft(10);
          setFinalReport({ dominant: null, scores: [] });
          setSongRecommendations([]);
          
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current!);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        };
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
    if (timerRef.current) clearInterval(timerRef.current);
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
  };

  useEffect(() => {
    if (timeLeft === 0 && isCameraActive) {
      stopCamera();
      if (dominantEmotion) {
        const recommendations = getMusicRecommendations(dominantEmotion);
        setFinalReport({
          dominant: dominantEmotion,
          scores: emotionScores
        });
        setSongRecommendations(recommendations);
      } else {
        setError('No face detected during analysis. Please try again.');
      }
    }
  }, [timeLeft, isCameraActive]);

  const getEmotionColor = (emotion: Emotion): string => {
    switch (emotion) {
      case 'happy': return 'bg-yellow-400';
      case 'sad': return 'bg-blue-400';
      case 'angry': return 'bg-red-500';
      case 'surprised': return 'bg-purple-400';
      case 'disgusted': return 'bg-green-500';
      case 'fearful': return 'bg-indigo-500';
      default: return 'bg-gray-400';
    }
  };

  const getEmotionEmoji = (emotion: Emotion): string => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😲';
      case 'disgusted': return '🤢';
      case 'fearful': return '😨';
      default: return '😐';
    }
  };

  const getEmotionDescription = (emotion: Emotion): string => {
    switch (emotion) {
      case 'happy': return 'You seem happy and joyful!';
      case 'sad': return 'You appear to be feeling down.';
      case 'angry': return 'You seem angry or frustrated.';
      case 'surprised': return 'You look surprised!';
      case 'disgusted': return 'You appear disgusted.';
      case 'fearful': return 'You seem fearful or anxious.';
      default: return 'Your expression appears neutral.';
    }
  };

  const generateReport = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`inline-block text-6xl p-6 rounded-full ${getEmotionColor(finalReport.dominant!)} mb-4`}>
          {getEmotionEmoji(finalReport.dominant!)}
        </div>
        <h3 className="text-2xl font-bold capitalize">{finalReport.dominant}</h3>
        <p className="text-lg text-gray-600 mt-2">
          {getEmotionDescription(finalReport.dominant!)}
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Detailed Analysis</h4>
        <div className="space-y-4">
          {finalReport.scores.map((emotion) => (
            <div key={emotion.emotion} className="flex items-center">
              <span className="w-24 capitalize">{emotion.emotion}</span>
              <div className="flex-1 ml-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getEmotionColor(emotion.emotion)}`}
                    style={{ width: `${Math.round(emotion.score * 100)}%` }}
                  />
                </div>
              </div>
              <span className="w-12 text-right ml-4">
                {Math.round(emotion.score * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {songRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Recommended Playlist</h4>
          <p className="text-gray-600 mb-4">
            Based on your mood, we recommend these songs:
          </p>
          <div className="space-y-3">
            {songRecommendations.map((song, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                <div className="mr-4 text-2xl">
                  {getEmotionEmoji(song.mood[0])}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{song.title}</h5>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
                <a 
                  href={song.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-4 px-3 py-1 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors"
                >
                  Listen
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={startCamera}
        className="w-full mt-6"
        variant="outline"
      >
        Start New Analysis
      </Button>
    </div>
  );

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Emotion Detection
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI analyzes your facial expressions to detect your current emotional state.
            The analysis takes 10 seconds - just look at your camera and stay still.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <motion.div 
              className="rounded-lg overflow-hidden shadow-xl bg-gray-100 aspect-video relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {isCameraActive && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
                  {timeLeft}s remaining
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
                className="absolute top-0 left-0 w-full h-full pointer-events-none" 
              />
              
              {!isCameraActive && !finalReport.dominant && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-6">
                  <Button 
                    onClick={startCamera}
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Start Mood Analysis
                  </Button>
                  <p className="mt-4 text-sm opacity-80">
                    We'll analyze your facial expressions for 10 seconds
                  </p>
                </div>
              )}

              {(faceDetectionError || error) && (
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {faceDetectionError || error}
                </motion.div>
              )}
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            <div className="bg-white rounded-lg shadow-lg p-8 h-full">
              <h3 className="text-2xl font-bold mb-6">
                {finalReport.dominant ? 'Mood Analysis Report' : 'Emotional Profile'}
              </h3>
              
              {finalReport.dominant ? (
                generateReport()
              ) : (
                <div className="text-center py-8 h-full flex flex-col items-center justify-center">
                  {isCameraActive ? (
                    <>
                      <div className="animate-pulse flex space-x-4 mb-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Analyzing your facial expressions...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">😊</div>
                      <p className="text-gray-500 max-w-md">
                        Click "Start Mood Analysis" to begin. The system will detect your 
                        emotions based on your facial expressions over 10 seconds.
                      </p>
                    </>
                  )}
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