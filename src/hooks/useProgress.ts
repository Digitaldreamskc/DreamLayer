import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { progressService, type UserProgress, type ModuleProgress, type LearningPathProgress } from '@/services/progressService';

export function useProgress() {
  const { address } = useAccount();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user progress
  const loadProgress = useCallback(async () => {
    if (!address) {
      setUserProgress(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const progress = await progressService.getUserProgress(address);
      setUserProgress(progress);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load progress'));
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Update module progress
  const updateModuleProgress = useCallback(async (
    pathId: string,
    moduleId: string,
    progress: number,
    completed: boolean = false,
    quizScores?: { [quizId: string]: number }
  ) => {
    if (!address) return;

    try {
      await progressService.updateModuleProgress(
        address,
        pathId,
        moduleId,
        progress,
        completed,
        quizScores
      );
      await loadProgress(); // Reload progress after update
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update progress'));
    }
  }, [address, loadProgress]);

  // Add achievement
  const addAchievement = useCallback(async (achievementId: string) => {
    if (!address) return;

    try {
      await progressService.addAchievement(address, achievementId);
      await loadProgress(); // Reload progress after update
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add achievement'));
    }
  }, [address, loadProgress]);

  // Add certificate
  const addCertificate = useCallback(async (certificateId: string) => {
    if (!address) return;

    try {
      await progressService.addCertificate(address, certificateId);
      await loadProgress(); // Reload progress after update
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add certificate'));
    }
  }, [address, loadProgress]);

  // Get module progress
  const getModuleProgress = useCallback(async (
    pathId: string,
    moduleId: string
  ): Promise<ModuleProgress | null> => {
    if (!address) return null;

    try {
      return await progressService.getModuleProgress(address, pathId, moduleId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get module progress'));
      return null;
    }
  }, [address]);

  // Get path progress
  const getPathProgress = useCallback(async (
    pathId: string
  ): Promise<LearningPathProgress | null> => {
    if (!address) return null;

    try {
      return await progressService.getPathProgress(address, pathId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get path progress'));
      return null;
    }
  }, [address]);

  // Load progress when wallet address changes
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    userProgress,
    loading,
    error,
    updateModuleProgress,
    addAchievement,
    addCertificate,
    getModuleProgress,
    getPathProgress,
    refreshProgress: loadProgress
  };
} 