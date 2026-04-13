import { useState, useRef, useCallback } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { PhotoResult } from '@/types';

interface UseCameraReturn {
  hasCameraPermission: boolean | null;
  isCapturing: boolean;
  requestCameraPermission: () => Promise<boolean>;
  takePhoto: (cameraRef: React.RefObject<CameraView>, facing?: 'front' | 'back') => Promise<PhotoResult | null>;
}

export function useCamera(): UseCameraReturn {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      setHasCameraPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasCameraPermission(false);
      return false;
    }
  }, []);

  const takePhoto = useCallback(
    async (
      cameraRef: React.RefObject<CameraView>,
      _facing: 'front' | 'back' = 'front',
    ): Promise<PhotoResult | null> => {
      if (!cameraRef.current) {
        console.error('Camera ref is not available');
        return null;
      }

      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: false,
        });

        if (!photo) return null;

        return {
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error('Error taking photo:', error);
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    [],
  );

  return {
    hasCameraPermission,
    isCapturing,
    requestCameraPermission,
    takePhoto,
  };
}
