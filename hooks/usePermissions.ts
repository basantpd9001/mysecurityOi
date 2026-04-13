import { useState, useEffect, useCallback } from 'react';
import {
  checkAllPermissions,
  requestPermission,
  PermissionStatus,
  PermissionType,
} from '@/utils/permissions';

interface UsePermissionsReturn {
  permissions: PermissionStatus;
  isLoading: boolean;
  checkPermissions: () => Promise<void>;
  requestSinglePermission: (type: PermissionType) => Promise<boolean>;
  allCriticalGranted: boolean;
}

const INITIAL_PERMISSIONS: PermissionStatus = {
  camera: false,
  location: false,
  notifications: false,
  mediaLibrary: false,
};

export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<PermissionStatus>(INITIAL_PERMISSIONS);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await checkAllPermissions();
      setPermissions(status);
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestSinglePermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    const granted = await requestPermission(type);
    setPermissions(prev => ({ ...prev, [type]: granted }));
    return granted;
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const allCriticalGranted = permissions.camera && permissions.location;

  return {
    permissions,
    isLoading,
    checkPermissions,
    requestSinglePermission,
    allCriticalGranted,
  };
}
