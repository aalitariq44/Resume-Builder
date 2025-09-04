'use client';

import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: string, shape: 'circle' | 'square') => void;
  initialShape?: 'circle' | 'square';
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  initialShape = 'circle'
}) => {
  const [shape, setShape] = useState<'circle' | 'square'>(initialShape);
  const cropperRef = useRef<HTMLImageElement>(null);

  const handleCrop = () => {
    const cropper = (cropperRef.current as any)?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
        fillColor: '#fff'
      });

      if (canvas) {
        const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
        onCropComplete(croppedImage, shape);
        onClose();
      }
    }
  };

  const handleShapeChange = (value: string) => {
    const newShape = value as 'circle' | 'square';
    setShape(newShape);
    const cropper = (cropperRef.current as any)?.cropper;
    if (cropper) {
      // Reset crop area when shape changes
      cropper.setAspectRatio(newShape === 'circle' ? 1 : 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>قص الصورة</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Shape Selection */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Label className="text-sm font-medium">شكل الصورة:</Label>
            <RadioGroup
              value={shape}
              onValueChange={handleShapeChange}
              className="flex space-x-4 space-x-reverse"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="circle" id="circle" />
                <Label htmlFor="circle">دائرية</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="square" id="square" />
                <Label htmlFor="square">مربعة</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Cropper */}
          <div className="relative">
            {imageSrc ? (
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={true}
                viewMode={1}
                dragMode="move"
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                background={false}
              />
            ) : (
              <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                <p className="text-muted-foreground">جاري تحميل الصورة...</p>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            اسحب وأعد تحجيم المربع لقص الجزء المطلوب من الصورة
          </p>
        </div>

        <DialogFooter className="flex space-x-2 space-x-reverse">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleCrop}>
            حفظ الصورة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
