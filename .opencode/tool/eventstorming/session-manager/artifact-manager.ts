import * as fs from 'fs-extra';
import * as path from 'path';
import { SessionManager, Session } from './session-manager';
import * as yaml from 'yaml';

export interface Artifact {
  id: string;
  type: string;
  name: string;
  description: string;
  data: any;
  createdAt: string;
  sessionId: string;
  phaseId?: number;
}

export interface CaptureOptions {
  type: 'events' | 'commands' | 'aggregates' | 'contexts' | 'risks';
  format?: 'yaml' | 'json' | 'markdown';
  output?: string;
  auto?: boolean;
}

export class ArtifactManager {
  private sessionManager: SessionManager;
  private sessionId: string;
  private artifactsDir: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.sessionManager = new SessionManager();
    this.artifactsDir = path.join('./sessions', sessionId, 'artifacts');
  }

  async captureArtifact(artifact: Omit<Artifact, 'id' | 'createdAt' | 'sessionId'>): Promise<Artifact> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const fullArtifact: Artifact = {
      ...artifact,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId
    };

    await fs.ensureDir(this.artifactsDir);
    const artifactPath = path.join(this.artifactsDir, `${fullArtifact.id}.json`);
    await fs.writeJson(artifactPath, fullArtifact, { spaces: 2 });

    return fullArtifact;
  }

  async autoCapture(type: string): Promise<Artifact[]> {
    const session = await this.sessionManager.loadSession(this.sessionId);
    if (!session) {
      throw new Error(`Session ${this.sessionId} not found`);
    }

    const artifacts: Artifact[] = [];

    switch (type) {
      case 'events':
        artifacts.push(...await this.generateDomainEvents(session));
        break;
      case 'commands':
        artifacts.push(...await this.generateCommands(session));
        break;
      case 'aggregates':
        artifacts.push(...await this.generateAggregates(session));
        break;
      case 'contexts':
        artifacts.push(...await this.generateBoundedContexts(session));
        break;
      case 'risks':
        artifacts.push(...await this.generateRisks(session));
        break;
      default:
        throw new Error(`Unknown artifact type: ${type}`);
    }

    // Save all artifacts
    for (const artifact of artifacts) {
      await this.captureArtifact(artifact);
    }

    return artifacts;
  }

  async getArtifacts(type?: string): Promise<Artifact[]> {
    await fs.ensureDir(this.artifactsDir);
    const files = await fs.readdir(this.artifactsDir);
    
    const artifacts: Artifact[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const artifact = await fs.readJson(path.join(this.artifactsDir, file));
        if (!type || artifact.type === type) {
          artifacts.push(artifact);
        }
      }
    }

    return artifacts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async exportArtifacts(options: CaptureOptions): Promise<string> {
    const artifacts = await this.getArtifacts(options.type);
    const format = options.format || 'yaml';
    
    let content: string;
    let extension: string;

    switch (format) {
      case 'yaml':
        content = yaml.stringify(artifacts);
        extension = 'yaml';
        break;
      case 'json':
        content = JSON.stringify(artifacts, null, 2);
        extension = 'json';
        break;
      case 'markdown':
        content = this.generateMarkdownReport(artifacts);
        extension = 'md';
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const outputPath = options.output || path.join(this.artifactsDir, `${options.type}-export.${extension}`);
    await fs.writeFile(outputPath, content);

    return outputPath;
  }

  private async generateDomainEvents(session: Session): Promise<Artifact[]> {
    // Sample domain events based on session domain
    const events = this.getSampleEvents(session.domain);
    
    return events.map(event => ({
      id: this.generateId(),
      type: 'domain-event',
      name: event.name,
      description: event.description,
      data: event,
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId,
      phaseId: 1 // Domain Events Discovery phase
    }));
  }

  private async generateCommands(session: Session): Promise<Artifact[]> {
    const commands = this.getSampleCommands(session.domain);
    
    return commands.map(command => ({
      id: this.generateId(),
      type: 'command',
      name: command.name,
      description: command.description,
      data: command,
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId,
      phaseId: 2 // Commands and Actors phase
    }));
  }

  private async generateAggregates(session: Session): Promise<Artifact[]> {
    const aggregates = this.getSampleAggregates(session.domain);
    
    return aggregates.map(aggregate => ({
      id: this.generateId(),
      type: 'aggregate',
      name: aggregate.name,
      description: aggregate.description,
      data: aggregate,
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId,
      phaseId: 3 // Aggregate Design phase
    }));
  }

  private async generateBoundedContexts(session: Session): Promise<Artifact[]> {
    const contexts = this.getSampleBoundedContexts(session.domain);
    
    return contexts.map(context => ({
      id: this.generateId(),
      type: 'bounded-context',
      name: context.name,
      description: context.description,
      data: context,
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId,
      phaseId: 4 // Bounded Contexts phase
    }));
  }

  private async generateRisks(session: Session): Promise<Artifact[]> {
    const risks = this.getSampleRisks(session.domain);
    
    return risks.map(risk => ({
      id: this.generateId(),
      type: 'risk',
      name: risk.name,
      description: risk.description,
      data: risk,
      createdAt: new Date().toISOString(),
      sessionId: this.sessionId,
      phaseId: 5 // Integration and Risk phase
    }));
  }

  private generateMarkdownReport(artifacts: Artifact[]): string {
    const grouped = artifacts.reduce((acc, artifact) => {
      if (!acc[artifact.type]) {
        acc[artifact.type] = [];
      }
      acc[artifact.type].push(artifact);
      return acc;
    }, {} as Record<string, Artifact[]>);

    let markdown = `# EventStorming Artifacts Report\n\n`;
    markdown += `Generated on: ${new Date().toISOString()}\n\n`;

    Object.entries(grouped).forEach(([type, items]) => {
      markdown += `## ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
      
      items.forEach(item => {
        markdown += `### ${item.name}\n\n`;
        markdown += `**Description:** ${item.description}\n\n`;
        markdown += `**Created:** ${new Date(item.createdAt).toLocaleString()}\n\n`;
        
        if (item.data) {
          markdown += `**Details:**\n\n`;
          markdown += '```yaml\n';
          markdown += yaml.stringify(item.data);
          markdown += '\n```\n\n';
        }
        
        markdown += '---\n\n';
      });
    });

    return markdown;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  private getSampleEvents(domain: string): any[] {
    // Sample events based on common domains
    const eventTemplates: Record<string, any[]> = {
      'Order Management': [
        {
          name: 'OrderPlaced',
          description: 'Customer has successfully placed an order',
          data: {
            order_id: 'uuid',
            customer_id: 'uuid',
            items: [],
            total_amount: 'decimal',
            placed_at: 'timestamp'
          }
        },
        {
          name: 'OrderCancelled',
          description: 'Order has been cancelled',
          data: {
            order_id: 'uuid',
            reason: 'string',
            cancelled_at: 'timestamp'
          }
        }
      ],
      'Customer Management': [
        {
          name: 'CustomerRegistered',
          description: 'New customer has registered',
          data: {
            customer_id: 'uuid',
            email: 'string',
            name: 'string',
            registered_at: 'timestamp'
          }
        }
      ]
    };

    return eventTemplates[domain] || [
      {
        name: 'DomainEvent',
        description: 'Sample domain event',
        data: {}
      }
    ];
  }

  private getSampleCommands(domain: string): any[] {
    const commandTemplates: Record<string, any[]> = {
      'Order Management': [
        {
          name: 'PlaceOrder',
          description: 'Place a new order',
          data: {
            customer_id: 'uuid',
            items: [],
            shipping_address: {}
          }
        }
      ]
    };

    return commandTemplates[domain] || [
      {
        name: 'Command',
        description: 'Sample command',
        data: {}
      }
    ];
  }

  private getSampleAggregates(domain: string): any[] {
    const aggregateTemplates: Record<string, any[]> = {
      'Order Management': [
        {
          name: 'Order',
          description: 'Order aggregate root',
          data: {
            invariants: ['Order must have at least one item'],
            commands: ['PlaceOrder', 'CancelOrder'],
            events: ['OrderPlaced', 'OrderCancelled']
          }
        }
      ]
    };

    return aggregateTemplates[domain] || [
      {
        name: 'Aggregate',
        description: 'Sample aggregate',
        data: {}
      }
    ];
  }

  private getSampleBoundedContexts(domain: string): any[] {
    const contextTemplates: Record<string, any[]> = {
      'Order Management': [
        {
          name: 'Order Management',
          description: 'Manages order lifecycle',
          data: {
            responsibilities: ['Order processing', 'Order tracking'],
            aggregates: ['Order'],
            integration_points: []
          }
        }
      ]
    };

    return contextTemplates[domain] || [
      {
        name: 'Bounded Context',
        description: 'Sample bounded context',
        data: {}
      }
    ];
  }

  private getSampleRisks(domain: string): any[] {
    const riskTemplates: Record<string, any[]> = {
      'Order Management': [
        {
          name: 'Payment Processing Failure',
          description: 'Risk of payment processing failures',
          data: {
            severity: 'high',
            likelihood: 'medium',
            impact: 'Customer charged but order not confirmed',
            mitigation: ['Implement idempotent payment processing']
          }
        }
      ]
    };

    return riskTemplates[domain] || [
      {
        name: 'Risk',
        description: 'Sample risk',
        data: {}
      }
    ];
  }
}