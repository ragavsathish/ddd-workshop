import { SessionManager, Phase } from './session-manager';
import moment from 'moment';

export interface PhaseStatus {
  currentPhase: number;
  currentPhaseName: string;
  timeRemaining: number;
  progress: number;
  totalPhases: number;
}

export class PhaseManager {
  private sessionManager: SessionManager;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.sessionManager = new SessionManager();
  }

  async listPhases(): Promise<Phase[]> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }
    return session.phases;
  }

  async getCurrentStatus(): Promise<PhaseStatus> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const currentPhase = session.currentPhase || 0;
    const currentPhaseData = session.phases[currentPhase - 1] || session.phases[0];
    
    let timeRemaining = 0;
    if (currentPhaseData.status === 'in_progress' && currentPhaseData.startTime) {
      const elapsed = moment().diff(moment(currentPhaseData.startTime), 'minutes');
      timeRemaining = Math.max(0, currentPhaseData.duration - elapsed);
    }

    const completedPhases = session.phases.filter(p => p.status === 'completed').length;
    const progress = (completedPhases / session.phases.length) * 100;

    return {
      currentPhase,
      currentPhaseName: currentPhaseData.name,
      timeRemaining,
      progress,
      totalPhases: session.phases.length
    };
  }

  async moveToNextPhase(): Promise<Phase> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const currentPhaseIndex = (session.currentPhase || 1) - 1;
    
    // Complete current phase
    if (currentPhaseIndex >= 0 && currentPhaseIndex < session.phases.length) {
      session.phases[currentPhaseIndex].status = 'completed';
      session.phases[currentPhaseIndex].endTime = moment().toISOString();
    }

    // Move to next phase
    const nextPhaseIndex = currentPhaseIndex + 1;
    if (nextPhaseIndex >= session.phases.length) {
      throw new Error('No more phases available');
    }

    session.phases[nextPhaseIndex].status = 'in_progress';
    session.phases[nextPhaseIndex].startTime = moment().toISOString();
    session.currentPhase = nextPhaseIndex + 1;
    session.status = 'in_progress';

    await this.sessionManager.updateSession(this.sessionId, session);
    return session.phases[nextPhaseIndex];
  }

  async setCurrentPhase(phaseNumber: number): Promise<Phase> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    if (phaseNumber < 1 || phaseNumber > session.phases.length) {
      throw new Error(`Invalid phase number: ${phaseNumber}`);
    }

    const phaseIndex = phaseNumber - 1;
    
    // Reset all phases
    session.phases.forEach((phase, index) => {
      if (index < phaseIndex) {
        phase.status = 'completed';
        phase.endTime = moment().toISOString();
      } else if (index === phaseIndex) {
        phase.status = 'in_progress';
        phase.startTime = moment().toISOString();
      } else {
        phase.status = 'pending';
        delete phase.startTime;
        delete phase.endTime;
      }
    });

    session.currentPhase = phaseNumber;
    session.status = 'in_progress';

    await this.sessionManager.updateSession(this.sessionId, session);
    return session.phases[phaseIndex];
  }

  async startPhase(phaseNumber: number): Promise<Phase> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const phaseIndex = phaseNumber - 1;
    if (phaseIndex < 0 || phaseIndex >= session.phases.length) {
      throw new Error(`Invalid phase number: ${phaseNumber}`);
    }

    const phase = session.phases[phaseIndex];
    if (phase.status !== 'pending') {
      throw new Error(`Phase ${phaseNumber} is not pending`);
    }

    phase.status = 'in_progress';
    phase.startTime = moment().toISOString();
    session.currentPhase = phaseNumber;
    session.status = 'in_progress';

    await this.sessionManager.updateSession(this.sessionId, session);
    return phase;
  }

  async completePhase(phaseNumber: number): Promise<Phase> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const phaseIndex = phaseNumber - 1;
    if (phaseIndex < 0 || phaseIndex >= session.phases.length) {
      throw new Error(`Invalid phase number: ${phaseNumber}`);
    }

    const phase = session.phases[phaseIndex];
    if (phase.status !== 'in_progress') {
      throw new Error(`Phase ${phaseNumber} is not in progress`);
    }

    phase.status = 'completed';
    phase.endTime = moment().toISOString();

    // Check if all phases are completed
    const allCompleted = session.phases.every(p => p.status === 'completed');
    if (allCompleted) {
      session.status = 'completed';
    }

    await this.sessionManager.updateSession(this.sessionId, session);
    return phase;
  }

  async pausePhase(phaseNumber: number): Promise<Phase> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const phaseIndex = phaseNumber - 1;
    if (phaseIndex < 0 || phaseIndex >= session.phases.length) {
      throw new Error(`Invalid phase number: ${phaseNumber}`);
    }

    const phase = session.phases[phaseIndex];
    if (phase.status !== 'in_progress') {
      throw new Error(`Phase ${phaseNumber} is not in progress`);
    }

    // Store pause time in metadata
    if (!phase.startTime) {
      throw new Error(`Phase ${phaseNumber} has not been started`);
    }

    // For simplicity, we'll just mark as pending but keep start time
    // In a real implementation, you might want to track pause/resume cycles
    phase.status = 'pending';

    await this.sessionManager.updateSession(this.sessionId, session);
    return phase;
  }

  async resumePhase(phaseNumber: number): Promise<Phase> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const phaseIndex = phaseNumber - 1;
    if (phaseIndex < 0 || phaseIndex >= session.phases.length) {
      throw new Error(`Invalid phase number: ${phaseNumber}`);
    }

    const phase = session.phases[phaseIndex];
    if (phase.status !== 'pending') {
      throw new Error(`Phase ${phaseNumber} is not paused`);
    }

    phase.status = 'in_progress';
    session.currentPhase = phaseNumber;
    session.status = 'in_progress';

    await this.sessionManager.updateSession(this.sessionId, session);
    return phase;
  }

  async getPhaseSummary(): Promise<any> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const summary = {
      sessionId: this.sessionId,
      sessionTitle: session.title,
      totalPhases: session.phases.length,
      completedPhases: session.phases.filter(p => p.status === 'completed').length,
      currentPhase: session.currentPhase || 0,
      estimatedTotalDuration: session.phases.reduce((sum, phase) => sum + phase.duration, 0),
      phases: session.phases.map(phase => ({
        id: phase.id,
        name: phase.name,
        duration: phase.duration,
        status: phase.status,
        startTime: phase.startTime,
        endTime: phase.endTime,
        actualDuration: phase.startTime && phase.endTime 
          ? moment(phase.endTime).diff(moment(phase.startTime), 'minutes')
          : null
      }))
    };

    return summary;
  }
}