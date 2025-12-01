import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export interface SessionConfig {
  domain: string;
  title: string;
  participants?: string[];
  duration?: number;
  scope?: string;
  output?: string;
}

export interface Session {
  id: string;
  domain: string;
  title: string;
  participants: string[];
  duration: number;
  scope?: string;
  status: 'created' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  path: string;
  currentPhase?: number;
  phases: Phase[];
}

export interface Phase {
  id: number;
  name: string;
  description: string;
  duration: number;
  status: 'pending' | 'in_progress' | 'completed';
  startTime?: string;
  endTime?: string;
  artifacts: string[];
}

export class SessionManager {
  private sessionsDir: string;
  private sessionsFile: string;

  constructor(sessionsDir: string = './sessions') {
    this.sessionsDir = sessionsDir;
    this.sessionsFile = path.join(sessionsDir, 'sessions.json');
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    fs.ensureDirSync(this.sessionsDir);
    if (!fs.existsSync(this.sessionsFile)) {
      fs.writeJsonSync(this.sessionsFile, []);
    }
  }

  async createSession(config: SessionConfig): Promise<Session> {
    const sessionId = uuidv4();
    const sessionPath = path.join(this.sessionsDir, sessionId);
    
    const session: Session = {
      id: sessionId,
      domain: config.domain,
      title: config.title,
      participants: config.participants || [],
      duration: config.duration || 4,
      scope: config.scope,
      status: 'created',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      path: sessionPath,
      currentPhase: 0,
      phases: this.getDefaultPhases()
    };

    // Create session directory
    await fs.ensureDir(sessionPath);
    
    // Create subdirectories
    await fs.ensureDir(path.join(sessionPath, 'artifacts'));
    await fs.ensureDir(path.join(sessionPath, 'notes'));
    await fs.ensureDir(path.join(sessionPath, 'photos'));

    // Save session metadata
    await fs.writeJson(path.join(sessionPath, 'session.json'), session);
    
    // Update sessions index
    const sessions = await this.loadSessions();
    sessions.push(session);
    await fs.writeJson(this.sessionsFile, sessions);

    return session;
  }

  async loadSession(sessionId: string): Promise<Session | null> {
    const sessionPath = path.join(this.sessionsDir, sessionId, 'session.json');
    if (!await fs.pathExists(sessionPath)) {
      return null;
    }
    return await fs.readJson(sessionPath);
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session> {
    const session = await this.loadSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: moment().toISOString()
    };

    await fs.writeJson(
      path.join(this.sessionsDir, sessionId, 'session.json'),
      updatedSession
    );

    // Update sessions index
    const sessions = await this.loadSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = updatedSession;
      await fs.writeJson(this.sessionsFile, sessions);
    }

    return updatedSession;
  }

  async listSessions(options: { all?: boolean; domain?: string } = {}): Promise<Session[]> {
    const sessions = await this.loadSessions();
    
    return sessions.filter(session => {
      if (!options.all && session.status === 'completed') {
        return false;
      }
      if (options.domain && session.domain !== options.domain) {
        return false;
      }
      return true;
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessionPath = path.join(this.sessionsDir, sessionId);
    await fs.remove(sessionPath);
    
    const sessions = await this.loadSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    await fs.writeJson(this.sessionsFile, filteredSessions);
  }

  async generateReport(sessionId: string, options: { format: string; template?: string }): Promise<{ path: string }> {
    const session = await this.loadSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const reportPath = path.join(session.path, `report.${options.format}`);
    
    // Generate report based on format
    switch (options.format) {
      case 'html':
        await this.generateHtmlReport(session, reportPath);
        break;
      case 'markdown':
        await this.generateMarkdownReport(session, reportPath);
        break;
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }

    return { path: reportPath };
  }

  private async loadSessions(): Promise<Session[]> {
    if (!await fs.pathExists(this.sessionsFile)) {
      return [];
    }
    return await fs.readJson(this.sessionsFile);
  }

  private getDefaultPhases(): Phase[] {
    return [
      {
        id: 1,
        name: 'Domain Events Discovery',
        description: 'Identify what happens in the domain',
        duration: 60,
        status: 'pending',
        artifacts: ['domain-events']
      },
      {
        id: 2,
        name: 'Commands and Actors',
        description: 'Identify who does what',
        duration: 45,
        status: 'pending',
        artifacts: ['commands', 'actors']
      },
      {
        id: 3,
        name: 'Aggregate Design',
        description: 'Group events into aggregates',
        duration: 60,
        status: 'pending',
        artifacts: ['aggregates']
      },
      {
        id: 4,
        name: 'Bounded Contexts',
        description: 'Define context boundaries',
        duration: 45,
        status: 'pending',
        artifacts: ['bounded-contexts']
      },
      {
        id: 5,
        name: 'Integration and Risk',
        description: 'Identify integration points and risks',
        duration: 30,
        status: 'pending',
        artifacts: ['integration-points', 'risks']
      }
    ];
  }

  private async generateHtmlReport(session: Session, outputPath: string): Promise<void> {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>EventStorming Session Report: ${session.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin: 20px 0; }
        .phase { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
        .completed { background-color: #e8f5e8; }
        .in-progress { background-color: #fff3cd; }
        .pending { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>EventStorming Session Report</h1>
        <h2>${session.title}</h2>
        <p><strong>Domain:</strong> ${session.domain}</p>
        <p><strong>Date:</strong> ${moment(session.createdAt).format('YYYY-MM-DD HH:mm')}</p>
        <p><strong>Status:</strong> ${session.status}</p>
    </div>
    
    <div class="section">
        <h3>Session Details</h3>
        <p><strong>Duration:</strong> ${session.duration} hours</p>
        <p><strong>Participants:</strong> ${session.participants.join(', ')}</p>
        ${session.scope ? `<p><strong>Scope:</strong> ${session.scope}</p>` : ''}
    </div>
    
    <div class="section">
        <h3>Phases</h3>
        ${session.phases.map(phase => `
            <div class="phase ${phase.status}">
                <h4>Phase ${phase.id}: ${phase.name}</h4>
                <p><strong>Description:</strong> ${phase.description}</p>
                <p><strong>Duration:</strong> ${phase.duration} minutes</p>
                <p><strong>Status:</strong> ${phase.status}</p>
                ${phase.startTime ? `<p><strong>Started:</strong> ${moment(phase.startTime).format('HH:mm')}</p>` : ''}
                ${phase.endTime ? `<p><strong>Completed:</strong> ${moment(phase.endTime).format('HH:mm')}</p>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    await fs.writeFile(outputPath, html);
  }

  private async generateMarkdownReport(session: Session, outputPath: string): Promise<void> {
    const markdown = `# EventStorming Session Report

## ${session.title}

**Domain:** ${session.domain}  
**Date:** ${moment(session.createdAt).format('YYYY-MM-DD HH:mm')}  
**Status:** ${session.status}  
**Duration:** ${session.duration} hours

## Session Details

**Participants:** ${session.participants.join(', ')}
${session.scope ? `**Scope:** ${session.scope}` : ''}

## Phases

${session.phases.map(phase => `
### Phase ${phase.id}: ${phase.name}

**Description:** ${phase.description}  
**Duration:** ${phase.duration} minutes  
**Status:** ${phase.status}
${phase.startTime ? `**Started:** ${moment(phase.startTime).format('HH:mm')}` : ''}
${phase.endTime ? `**Completed:** ${moment(phase.endTime).format('HH:mm')}` : ''}
`).join('')}

---
*Generated on ${moment().format('YYYY-MM-DD HH:mm:ss')}*`;

    await fs.writeFile(outputPath, markdown);
  }
}