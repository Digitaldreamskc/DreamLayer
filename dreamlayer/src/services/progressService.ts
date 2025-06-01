import { supabase } from '@/lib/supabaseClient';

export interface ModuleProgress {
  moduleId: string;
  progress: number;
  completed: boolean;
  lastAccessed: Date;
  quizScores?: { [quizId: string]: number };
}

export interface LearningPathProgress {
  pathId: string;
  modules: { [moduleId: string]: ModuleProgress };
  overallProgress: number;
  lastAccessed: Date;
}

export interface UserProgress {
  walletAddress: string;
  paths: { [pathId: string]: LearningPathProgress };
  achievements: string[];
  certificates: string[];
}

class ProgressService {
  private static instance: ProgressService;
  private cache: Map<string, UserProgress> = new Map();

  private constructor() {}

  static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  async getUserProgress(walletAddress: string): Promise<UserProgress | null> {
    // Check cache first
    if (this.cache.has(walletAddress)) {
      return this.cache.get(walletAddress)!;
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }

    if (!data) {
      // Initialize new progress for user
      const newProgress: UserProgress = {
        walletAddress,
        paths: {},
        achievements: [],
        certificates: []
      };
      await this.saveUserProgress(newProgress);
      return newProgress;
    }

    // Cache the result
    this.cache.set(walletAddress, data);
    return data;
  }

  async saveUserProgress(progress: UserProgress): Promise<void> {
    // Update cache
    this.cache.set(progress.walletAddress, progress);

    // Save to Supabase
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        wallet_address: progress.walletAddress,
        paths: progress.paths,
        achievements: progress.achievements,
        certificates: progress.certificates,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  async updateModuleProgress(
    walletAddress: string,
    pathId: string,
    moduleId: string,
    progress: number,
    completed: boolean = false,
    quizScores?: { [quizId: string]: number }
  ): Promise<void> {
    const userProgress = await this.getUserProgress(walletAddress);
    if (!userProgress) return;

    // Initialize path if it doesn't exist
    if (!userProgress.paths[pathId]) {
      userProgress.paths[pathId] = {
        pathId,
        modules: {},
        overallProgress: 0,
        lastAccessed: new Date()
      };
    }

    // Update module progress
    userProgress.paths[pathId].modules[moduleId] = {
      moduleId,
      progress,
      completed,
      lastAccessed: new Date(),
      quizScores
    };

    // Recalculate overall path progress
    const modules = Object.values(userProgress.paths[pathId].modules);
    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
    userProgress.paths[pathId].overallProgress = totalProgress / modules.length;
    userProgress.paths[pathId].lastAccessed = new Date();

    // Save updated progress
    await this.saveUserProgress(userProgress);
  }

  async addAchievement(walletAddress: string, achievementId: string): Promise<void> {
    const userProgress = await this.getUserProgress(walletAddress);
    if (!userProgress) return;

    if (!userProgress.achievements.includes(achievementId)) {
      userProgress.achievements.push(achievementId);
      await this.saveUserProgress(userProgress);
    }
  }

  async addCertificate(walletAddress: string, certificateId: string): Promise<void> {
    const userProgress = await this.getUserProgress(walletAddress);
    if (!userProgress) return;

    if (!userProgress.certificates.includes(certificateId)) {
      userProgress.certificates.push(certificateId);
      await this.saveUserProgress(userProgress);
    }
  }

  async getModuleProgress(
    walletAddress: string,
    pathId: string,
    moduleId: string
  ): Promise<ModuleProgress | null> {
    const userProgress = await this.getUserProgress(walletAddress);
    if (!userProgress) return null;

    return userProgress.paths[pathId]?.modules[moduleId] || null;
  }

  async getPathProgress(
    walletAddress: string,
    pathId: string
  ): Promise<LearningPathProgress | null> {
    const userProgress = await this.getUserProgress(walletAddress);
    if (!userProgress) return null;

    return userProgress.paths[pathId] || null;
  }
}

export const progressService = ProgressService.getInstance(); 