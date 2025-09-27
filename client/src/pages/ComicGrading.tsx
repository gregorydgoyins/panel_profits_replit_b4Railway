import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, Camera, CheckCircle, AlertCircle, Star, TrendingUp, Search, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ConditionFactor {
  corners: number;
  spine: number;
  pages: number;
  colors: number;
  cover: number;
  creases: number;
  tears: number;
  staples: number;
}

interface GradingResult {
  id: string;
  predictedGrade: number;
  gradeCategory: string;
  conditionFactors: ConditionFactor;
  confidenceScore: number;
  analysisDetails: string;
  gradingNotes?: string;
  processingTimeMs: number;
  createdAt: Date;
}

interface GradingResponse {
  success: boolean;
  prediction: GradingResult;
  error?: string;
}

interface SimilarComic {
  id: string;
  predictedGrade: number;
  gradeCategory: string;
  conditionFactors: ConditionFactor;
  confidenceScore: number;
  analysisDetails: string;
  imageName?: string;
  similarityScore: number;
  createdAt: Date;
}

interface SimilarComicsResponse {
  success: boolean;
  gradingId: string;
  similarComics: SimilarComic[];
  count: number;
  error?: string;
}

export default function ComicGrading() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [similarComics, setSimilarComics] = useState<SimilarComic[]>([]);
  const [showSimilarComics, setShowSimilarComics] = useState(false);
  const { toast } = useToast();

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix (data:image/jpeg;base64,)
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Comic grading mutation
  const gradingMutation = useMutation({
    mutationFn: async (file: File): Promise<GradingResponse> => {
      const imageData = await fileToBase64(file);
      
      const response = await apiRequest('POST', '/api/grading/analyze', {
        imageData,
        imageName: file.name,
        userId: null // Optional - could come from auth context
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setGradingResult(data.prediction);
        setSimilarComics([]); // Reset similar comics when new grading is done
        setShowSimilarComics(false);
        toast({
          title: "Analysis Complete!",
          description: `Your comic received a grade of ${data.prediction.predictedGrade} (${data.prediction.gradeCategory})`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Grading analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.response?.data?.error || "Failed to analyze comic image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate embedding and find similar comics mutation
  const similarComicsMutation = useMutation({
    mutationFn: async (): Promise<SimilarComicsResponse> => {
      if (!gradingResult || !selectedFile) {
        throw new Error('No grading result or image available');
      }

      // First, generate embedding for the current comic
      const imageData = await fileToBase64(selectedFile);
      const embeddingResponse = await apiRequest('POST', `/api/vectors/embeddings/comics/${gradingResult.id}`, {
        imageData
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to generate image embedding');
      }

      // Then find similar comics
      const similarResponse = await apiRequest('GET', `/api/vectors/comics/${gradingResult.id}/similar?limit=6&threshold=0.6`);
      
      return similarResponse.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setSimilarComics(data.similarComics);
        setShowSimilarComics(true);
        toast({
          title: "Similar Comics Found!",
          description: `Found ${data.count} visually similar comics for comparison`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Similar comics search failed:', error);
      toast({
        title: "Search Failed",
        description: error.response?.data?.error || "Failed to find similar comics. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, WebP, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large", 
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setGradingResult(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [toast]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // File input handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Start analysis
  const handleAnalyze = () => {
    if (selectedFile) {
      gradingMutation.mutate(selectedFile);
    }
  };

  // Reset for new analysis
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setGradingResult(null);
    setSimilarComics([]);
    setShowSimilarComics(false);
    setIsDragging(false);
  };

  // Get grade color based on score
  const getGradeColor = (grade: number) => {
    if (grade >= 9.0) return "text-emerald-400 bg-emerald-900/30";
    if (grade >= 8.0) return "text-green-400 bg-green-900/30";
    if (grade >= 7.0) return "text-yellow-400 bg-yellow-900/30";
    if (grade >= 6.0) return "text-orange-400 bg-orange-900/30";
    return "text-red-400 bg-red-900/30";
  };

  // Condition factor labels
  const conditionFactorLabels = {
    corners: "Corners",
    spine: "Spine", 
    pages: "Pages",
    colors: "Colors",
    cover: "Cover",
    creases: "Creases",
    tears: "Tears",
    staples: "Staples"
  };

  return (
    <div className="space-y-6" data-testid="comic-grading-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">AI Comic Grading</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Upload photos of your comics for professional CGC-style grading analysis
          </p>
        </div>
        <Badge variant="outline" className="text-cyan-400 border-cyan-400" data-testid="badge-ai-powered">
          <Star className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card data-testid="card-upload-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload Comic Image
            </CardTitle>
            <CardDescription>
              Drop an image or click to select. Best results with clear, well-lit photos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover-elevate
                ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'}
                ${selectedFile ? 'border-green-500/50 bg-green-500/5' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              data-testid="dropzone-upload"
            >
              {previewUrl ? (
                <div className="space-y-4" data-testid="preview-container">
                  <img 
                    src={previewUrl} 
                    alt="Comic preview" 
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                    data-testid="img-preview"
                  />
                  <div className="text-sm text-muted-foreground" data-testid="text-file-info">
                    {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(1)}MB)
                  </div>
                </div>
              ) : (
                <div className="space-y-4" data-testid="upload-placeholder">
                  <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop comic image here</p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WebP • Max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              data-testid="input-file-hidden"
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleAnalyze}
                disabled={!selectedFile || gradingMutation.isPending}
                className="flex-1"
                data-testid="button-analyze"
              >
                {gradingMutation.isPending ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze Comic
                  </>
                )}
              </Button>
              {(selectedFile || gradingResult) && (
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Progress */}
            {gradingMutation.isPending && (
              <div className="space-y-2" data-testid="progress-container">
                <div className="flex justify-between text-sm">
                  <span>AI Analysis in Progress...</span>
                  <span>This may take 10-30 seconds</span>
                </div>
                <Progress value={undefined} className="w-full" data-testid="progress-analyzing" />
              </div>
            )}

            {/* Error Display */}
            {gradingMutation.isError && (
              <Alert variant="destructive" data-testid="alert-error">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  {gradingMutation.error?.message || "Analysis failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card data-testid="card-results-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Grading Results
            </CardTitle>
            <CardDescription>
              Professional CGC-style assessment powered by AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gradingResult ? (
              <div className="space-y-6" data-testid="results-container">
                {/* Main Grade Display */}
                <div className="text-center p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg border">
                  <div className="space-y-2" data-testid="grade-display">
                    <div className="text-sm text-muted-foreground">CGC Grade</div>
                    <div className={`text-6xl font-bold ${getGradeColor(gradingResult.predictedGrade)}`} data-testid="text-predicted-grade">
                      {gradingResult.predictedGrade.toFixed(1)}
                    </div>
                    <div className="text-xl font-semibold" data-testid="text-grade-category">
                      {gradingResult.gradeCategory}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span data-testid="text-confidence">
                        {gradingResult.confidenceScore.toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Condition Breakdown */}
                <div className="space-y-4" data-testid="condition-breakdown">
                  <h3 className="text-lg font-semibold">Condition Analysis</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(gradingResult.conditionFactors).map(([key, value]) => (
                      <div key={key} className="space-y-2" data-testid={`condition-${key}`}>
                        <div className="flex justify-between text-sm">
                          <span>{conditionFactorLabels[key as keyof ConditionFactor]}</span>
                          <span className="font-medium">{value}/10</span>
                        </div>
                        <Progress 
                          value={value * 10} 
                          className="h-2"
                          data-testid={`progress-${key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="space-y-3" data-testid="analysis-details">
                  <h3 className="text-lg font-semibold">Analysis Details</h3>
                  <div className="text-sm text-muted-foreground leading-relaxed p-4 bg-slate-800/50 rounded-lg border">
                    <p data-testid="text-analysis-details">{gradingResult.analysisDetails}</p>
                  </div>
                  {gradingResult.gradingNotes && (
                    <div className="text-sm text-muted-foreground leading-relaxed p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                      <div className="font-medium text-amber-400 mb-2">Grading Notes</div>
                      <p data-testid="text-grading-notes">{gradingResult.gradingNotes}</p>
                    </div>
                  )}
                </div>

                {/* Processing Info */}
                <div className="flex justify-between text-xs text-muted-foreground pt-4 border-t" data-testid="processing-info">
                  <span>Processed in {(gradingResult.processingTimeMs / 1000).toFixed(1)}s</span>
                  <span>Analyzed with GPT-5 Vision</span>
                </div>

                {/* Find Similar Comics Button */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => similarComicsMutation.mutate()}
                    disabled={similarComicsMutation.isPending}
                    className="w-full"
                    variant="outline"
                    data-testid="button-find-similar"
                  >
                    {similarComicsMutation.isPending ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Finding Similar Comics...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Find Similar Comics
                      </>
                    )}
                  </Button>
                  {similarComicsMutation.isPending && (
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                      Analyzing visual patterns and generating embeddings...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground" data-testid="no-results-placeholder">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Upload and analyze a comic to see grading results</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Similar Comics Results */}
        {showSimilarComics && similarComics.length > 0 && (
          <Card data-testid="card-similar-comics">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visually Similar Comics
              </CardTitle>
              <CardDescription>
                Comics with similar visual patterns and condition factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="similar-comics-grid">
                {similarComics.map((comic) => (
                  <div
                    key={comic.id}
                    className="border rounded-lg p-4 bg-slate-800/30 hover-elevate"
                    data-testid={`similar-comic-${comic.id}`}
                  >
                    {/* Similarity Score Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" data-testid={`similarity-score-${comic.id}`}>
                        {(comic.similarityScore * 100).toFixed(1)}% Match
                      </Badge>
                      <Badge
                        variant={comic.predictedGrade >= 8.0 ? "default" : "outline"}
                        data-testid={`similar-grade-${comic.id}`}
                      >
                        Grade {comic.predictedGrade.toFixed(1)}
                      </Badge>
                    </div>

                    {/* Grade Category */}
                    <div className="text-sm font-medium mb-2" data-testid={`similar-category-${comic.id}`}>
                      {comic.gradeCategory}
                    </div>

                    {/* Condition Factors Mini Display */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex justify-between">
                        <span>Corners:</span>
                        <span className="font-medium">{comic.conditionFactors.corners}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cover:</span>
                        <span className="font-medium">{comic.conditionFactors.cover}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pages:</span>
                        <span className="font-medium">{comic.conditionFactors.pages}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Colors:</span>
                        <span className="font-medium">{comic.conditionFactors.colors}/10</span>
                      </div>
                    </div>

                    {/* Analysis Preview */}
                    <div className="text-xs text-muted-foreground line-clamp-3" data-testid={`similar-analysis-${comic.id}`}>
                      {comic.analysisDetails}
                    </div>

                    {/* Confidence & Date */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-muted-foreground">
                      <span>{comic.confidenceScore.toFixed(1)}% confidence</span>
                      <span>{new Date(comic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold" data-testid="text-similar-count">
                      {similarComics.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Similar Comics</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold" data-testid="text-avg-similarity">
                      {(similarComics.reduce((acc, comic) => acc + comic.similarityScore, 0) / similarComics.length * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Similarity</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold" data-testid="text-avg-grade">
                      {(similarComics.reduce((acc, comic) => acc + comic.predictedGrade, 0) / similarComics.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Grade</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error handling for similar comics */}
        {similarComicsMutation.isError && (
          <Alert variant="destructive" data-testid="alert-similar-error">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              {similarComicsMutation.error?.message || "Failed to find similar comics. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}