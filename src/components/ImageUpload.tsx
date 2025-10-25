import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onValidationError: (error: string) => void;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onValidationError, isAnalyzing }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Size validation - enforce 10MB limit
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }
    
    // Type validation - strict MIME type checking
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' };
    }
    
    return { valid: true };
  };

  const validateImageContent = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      img.src = url;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Client-side validation
      const validation = validateFile(file);
      if (!validation.valid) {
        onValidationError(validation.error || 'File validation failed');
        return;
      }

      // Validate actual image content
      const isValidImage = await validateImageContent(file);
      if (!isValidImage) {
        onValidationError('File is not a valid image or is corrupted');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload, onValidationError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled: isAnalyzing
  });

  const clearImage = () => {
    setPreviewImage(null);
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
      {!previewImage ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-border hover:border-primary hover:bg-primary/5'
            }
            ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Upload className="h-16 w-16 text-muted-foreground" />
              <Camera className="h-6 w-6 text-primary absolute -bottom-1 -right-1" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isDragActive ? 'Drop your image here' : 'Upload Cattle/Buffalo Image'}
              </h3>
              <p className="text-muted-foreground">
                Drag and drop or click to select an image for analysis
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WEBP (max 10MB)
              </p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-gradient-primary text-primary-foreground border-0 hover:opacity-90 transition-opacity"
              disabled={isAnalyzing}
            >
              Select Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={previewImage}
              alt="Uploaded cattle/buffalo"
              className="w-full h-64 object-cover rounded-lg shadow-medium"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={clearImage}
              disabled={isAnalyzing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {isAnalyzing && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-primary font-medium">Analyzing image...</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};