import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Target, 
  Award, 
  Eye, 
  Zap,
  TrendingUp
} from 'lucide-react';

export interface AnalysisResult {
  breed: {
    name: string;
    confidence: number;
    category: 'Cattle' | 'Buffalo';
  };
  gender: {
    prediction: 'Male' | 'Female';
    confidence: number;
  };
  features: {
    hump: { present: boolean; size: 'Small' | 'Medium' | 'Large' | 'None' };
    horns: { present: boolean; type: 'Curved' | 'Straight' | 'Short' | 'None' };
    coat: { color: string; pattern: string };
  };
  qualityScore: {
    overall: number;
    health: number;
    build: number;
    conformation: number;
  };
}

interface AnalysisResultsProps {
  results: AnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Classification Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Target className="h-5 w-5 text-primary mr-2" />
            <CardTitle className="text-lg">Breed Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{results.breed.name}</span>
                <Badge variant="outline" className="bg-primary text-primary-foreground border-0">
                  {results.breed.category}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span className={`font-medium ${getConfidenceColor(results.breed.confidence)}`}>
                    {(results.breed.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={results.breed.confidence * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Eye className="h-5 w-5 text-accent mr-2" />
            <CardTitle className="text-lg">Gender Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">{results.gender.prediction}</span>
                <Badge variant="secondary">
                  {(results.gender.confidence * 100).toFixed(1)}% sure
                </Badge>
              </div>
              <Progress 
                value={results.gender.confidence * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Quality Score
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="animate-slide-up">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Physical Features Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold text-foreground mb-2">Hump</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.features.hump.present ? 
                      `Present (${results.features.hump.size})` : 
                      'Not present'
                    }
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold text-foreground mb-2">Horns</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.features.horns.present ? 
                      `${results.features.horns.type} horns` : 
                      'No horns'
                    }
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold text-foreground mb-2">Coat</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.features.coat.color} with {results.features.coat.pattern} pattern
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="animate-slide-up">
          <Card className="bg-gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Quality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 rounded-lg bg-muted">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {results.qualityScore.overall}/100
                </div>
                <p className="text-muted-foreground">Overall Quality Score</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Health Assessment', value: results.qualityScore.health },
                  { label: 'Body Build', value: results.qualityScore.build },
                  { label: 'Conformation', value: results.qualityScore.conformation }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold">{item.value}/100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(item.value)}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};