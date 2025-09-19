import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults, AnalysisResult } from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Scan, 
  Brain, 
  Zap, 
  Target, 
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Mock analysis function - in real app this would call your AI service
const mockAnalyzeImage = (file: File): Promise<AnalysisResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate animal detection - check if image contains non-cattle/buffalo animals
      const fileName = file.name.toLowerCase();
      const nonCattleAnimals = [
        'dog', 'cat', 'horse', 'pig', 'sheep', 'goat', 'chicken', 'duck', 
        'elephant', 'lion', 'tiger', 'bird', 'fish', 'rabbit', 'deer',
        'monkey', 'bear', 'wolf', 'fox', 'snake', 'lizard', 'frog'
      ];
      
      // Check if filename contains any non-cattle animal names
      const hasNonCattleAnimal = nonCattleAnimals.some(animal => 
        fileName.includes(animal)
      );
      
      // Only reject if it's actually a non-cattle animal
      if (hasNonCattleAnimal) {
        reject(new Error('INVALID_ANIMAL'));
        return;
      }
      
      // Simulate different results for valid cattle/buffalo images
      const mockResults: AnalysisResult[] = [
        {
          breed: { name: 'Holstein Friesian', confidence: 0.94, category: 'Cattle' },
          gender: { prediction: 'Female', confidence: 0.87 },
          features: {
            hump: { present: false, size: 'None' },
            horns: { present: true, type: 'Short' },
            coat: { color: 'Black and White', pattern: 'Spotted' }
          },
          qualityScore: { overall: 87, health: 92, build: 85, conformation: 84 }
        },
        {
          breed: { name: 'Murrah Buffalo', confidence: 0.91, category: 'Buffalo' },
          gender: { prediction: 'Male', confidence: 0.82 },
          features: {
            hump: { present: true, size: 'Medium' },
            horns: { present: true, type: 'Curved' },
            coat: { color: 'Black', pattern: 'Solid' }
          },
          qualityScore: { overall: 79, health: 85, build: 78, conformation: 74 }
        },
        {
          breed: { name: 'Zebu Cattle', confidence: 0.88, category: 'Cattle' },
          gender: { prediction: 'Male', confidence: 0.89 },
          features: {
            hump: { present: true, size: 'Large' },
            horns: { present: true, type: 'Straight' },
            coat: { color: 'Brown', pattern: 'Solid' }
          },
          qualityScore: { overall: 82, health: 88, build: 80, conformation: 79 }
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      resolve(randomResult);
    }, 2500); // Simulate processing time
  });
};

const CattleClassifier: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);
    
    try {
      const result = await mockAnalyzeImage(file);
      setAnalysisResult(result);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      if (error.message === 'INVALID_ANIMAL') {
        setError('⚠️ Invalid Animal Detected! This app only analyzes cattle and buffalo images. Please upload an image containing cattle or buffalo.');
      } else {
        setError('Analysis failed. Please try again with a different image.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Scan className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">NANDI X</h1>
                <p className="text-muted-foreground">Advanced Livestock Classification</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent text-accent-foreground border-0 px-3 py-1">
              <Brain className="h-4 w-4 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!analysisResult ? (
          // Upload and Analysis Section
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground">
                Identify Your Livestock
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload an image to get instant breed identification, gender detection, 
                and comprehensive quality assessment powered by advanced AI.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
              {[
                {
                  icon: Target,
                  title: 'Breed Recognition',
                  description: 'Accurate identification of cattle and buffalo breeds with confidence scores'
                },
                {
                  icon: Users,
                  title: 'Gender Detection',
                  description: 'Automated male/female classification using advanced visual analysis'
                },
                {
                  icon: Award,
                  title: 'Quality Assessment',
                  description: 'Comprehensive scoring of health, build, and conformation traits'
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                  <CardContent className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-8" />

            {/* Upload Section */}
            <div className="animate-scale-in space-y-4">
              <ImageUpload onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />
              
              {/* Error Display */}
              {error && (
                <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-fade-in">
              {[
                { label: 'Breeds Supported', value: '50+', icon: Target },
                { label: 'Accuracy Rate', value: '94%', icon: CheckCircle },
                { label: 'Analysis Speed', value: '<3s', icon: Zap },
                { label: 'Quality Metrics', value: '12', icon: TrendingUp }
              ].map((stat, index) => (
                <Card key={index} className="text-center p-4 bg-card shadow-soft">
                  <CardContent className="space-y-2">
                    <stat.icon className="h-6 w-6 text-primary mx-auto" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Results Section
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                className="shadow-soft hover:shadow-medium"
              >
                Analyze Another Image
              </Button>
            </div>
            
            <AnalysisResults results={analysisResult} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 NANDI X. All rights reserved to THIRUMALAI. Advanced livestock classification technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CattleClassifier;