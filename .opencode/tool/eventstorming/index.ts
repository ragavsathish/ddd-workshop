import { tool } from "@opencode-ai/plugin"
import { SessionManager } from './session-manager/session-manager.js'
import { PhaseManager } from './session-manager/phase-manager.js'
import { ArtifactManager } from './session-manager/artifact-manager.js'

// EventStorming session management functions
async function createEventStormingSession(params: {
  domain: string;
  title: string;
  participants?: string;
  duration?: string;
  scope?: string;
  output?: string;
}): Promise<string> {
  try {
    const sessionManager = new SessionManager()
    
    const config = {
      domain: params.domain,
      title: params.title,
      participants: params.participants ? params.participants.split(',').map(p => p.trim()) : undefined,
      duration: params.duration ? parseInt(params.duration) : undefined,
      scope: params.scope,
      output: params.output
    }
    
    const session = await sessionManager.createSession(config)
    
    return `✅ Created EventStorming session:
📋 Session ID: ${session.id}
🏷️  Title: ${session.title}
🌐 Domain: ${session.domain}
👥 Participants: ${session.participants.join(', ') || 'None'}
⏱️  Duration: ${session.duration} hours
📁 Path: ${session.path}
📊 Status: ${session.status}
📅 Created: ${session.createdAt}`
  } catch (error: any) {
    throw new Error(`Failed to create session: ${error.message}`)
  }
}

async function manageSessionPhase(params: {
  session: string;
  action: 'list' | 'status' | 'next' | 'set';
  current?: string;
}): Promise<string> {
  try {
    const phaseManager = new PhaseManager(params.session)
    
    switch (params.action) {
      case 'list':
        const phases = await phaseManager.listPhases()
        const phaseList = phases.map(phase => 
          `${phase.id}. ${phase.name} (${phase.duration}min) - ${phase.status}`
        ).join('\n')
        return `📋 Session Phases:\n${phaseList}`
        
      case 'status':
        const status = await phaseManager.getCurrentStatus()
        return `📊 Phase Status:
🎯 Current Phase: ${status.currentPhase} - ${status.currentPhaseName}
⏱️  Time Remaining: ${status.timeRemaining}min
📈 Progress: ${status.progress.toFixed(1)}%
📊 Total Phases: ${status.totalPhases}`
        
      case 'next':
        const nextPhase = await phaseManager.moveToNextPhase()
        return `✅ Moved to next phase:
🎯 Phase ${nextPhase.id}: ${nextPhase.name}
📝 Description: ${nextPhase.description}
⏱️  Duration: ${nextPhase.duration}min`
        
      case 'set':
        if (!params.current) {
          return "❌ Phase number required when action is 'set'"
        }
        const setPhase = await phaseManager.setCurrentPhase(parseInt(params.current))
        return `✅ Set current phase:
🎯 Phase ${setPhase.id}: ${setPhase.name}
📝 Description: ${setPhase.description}
⏱️  Duration: ${setPhase.duration}min`
        
      default:
        return `❌ Unknown phase action: ${params.action}`
    }
  } catch (error: any) {
    return `❌ Phase management error: ${error.message}`
  }
}

async function captureArtifacts(params: {
  session: string;
  type: 'events' | 'commands' | 'aggregates' | 'contexts' | 'risks';
  format?: 'yaml' | 'json' | 'markdown';
  output?: string;
  auto?: boolean;
}): Promise<string> {
  try {
    const artifactManager = new ArtifactManager(params.session)
    
    if (params.auto) {
      const artifacts = await artifactManager.autoCapture(params.type)
      const exportPath = await artifactManager.exportArtifacts({
        type: params.type,
        format: params.format || 'yaml',
        output: params.output
      })
      
      return `✅ Auto-captured ${artifacts.length} ${params.type} artifacts:
📁 Export Path: ${exportPath}
📋 Artifacts: ${artifacts.map(a => a.name).join(', ')}`
    } else {
      // Manual capture - create a sample artifact
      const artifact = await artifactManager.captureArtifact({
        type: params.type,
        name: `Manual ${params.type} capture`,
        description: `Manually captured ${params.type} artifact`,
        data: {
          captured_at: new Date().toISOString(),
          session_id: params.session,
          type: params.type
        }
      })
      
      return `✅ Captured artifact:
📋 Name: ${artifact.name}
🏷️  Type: ${artifact.type}
📝 Description: ${artifact.description}
🆔 ID: ${artifact.id}`
    }
  } catch (error: any) {
    return `❌ Artifact capture error: ${error.message}`
  }
}

async function generateSessionReport(params: {
  session: string;
  format?: 'html' | 'pdf' | 'markdown';
  template?: string;
  output?: string;
}): Promise<string> {
  try {
    const sessionManager = new SessionManager()
    const reportPath = await sessionManager.generateReport(params.session, {
      format: params.format || 'html',
      template: params.template
    })
    
    return `✅ Generated session report:
📄 Format: ${params.format || 'html'}
📁 Path: ${reportPath.path}`
  } catch (error: any) {
    return `❌ Report generation error: ${error.message}`
  }
}

async function listSessions(params?: {
  all?: boolean;
  domain?: string;
}): Promise<string> {
  try {
    const sessionManager = new SessionManager()
    const sessions = await sessionManager.listSessions({
      all: params?.all,
      domain: params?.domain
    })
    
    if (sessions.length === 0) {
      return `📋 No sessions found${params?.domain ? ` for domain "${params.domain}"` : ''}`
    }
    
    const sessionList = sessions.map(session => 
      `🆔 ${session.id}
📋 ${session.title}
🌐 Domain: ${session.domain}
📊 Status: ${session.status}
📅 Created: ${new Date(session.createdAt).toLocaleDateString()}
⏱️  Duration: ${session.duration}h
👥 Participants: ${session.participants.length}
${session.currentPhase ? `🎯 Current Phase: ${session.currentPhase}` : ''}`
    ).join('\n\n')
    
    return `📋 EventStorming Sessions (${sessions.length} found):
${sessionList}`
  } catch (error: any) {
    return `❌ Session listing error: ${error.message}`
  }
}

async function getSessionStatus(params: {
  session: string;
}): Promise<string> {
  try {
    const sessionManager = new SessionManager()
    const session = await sessionManager.loadSession(params.session)
    
    if (!session) {
      return `❌ Session ${params.session} not found`
    }
    
    const phaseManager = new PhaseManager(params.session)
    const phaseStatus = await phaseManager.getCurrentStatus()
    
    return `📊 Session Status for ${session.title}:
🆔 Session ID: ${session.id}
🌐 Domain: ${session.domain}
📊 Overall Status: ${session.status}
📅 Created: ${new Date(session.createdAt).toLocaleString()}
📅 Updated: ${new Date(session.updatedAt).toLocaleString()}
👥 Participants: ${session.participants.join(', ') || 'None'}
⏱️  Duration: ${session.duration} hours
🎯 Current Phase: ${phaseStatus.currentPhase} - ${phaseStatus.currentPhaseName}
📈 Progress: ${phaseStatus.progress.toFixed(1)}%
⏱️  Time Remaining: ${phaseStatus.timeRemaining}min
📊 Total Phases: ${phaseStatus.totalPhases}`
  } catch (error: any) {
    return `❌ Status check error: ${error.message}`
  }
}

async function autoCapturePhase(params: {
  session: string;
  phase?: '1' | '2' | '3' | '4' | '5';
}): Promise<string> {
  try {
    const artifactManager = new ArtifactManager(params.session)
    const phase = params.phase || '1'
    
    // Define artifacts by phase with proper typing
    const phaseArtifacts = {
      '1': ['events'] as const,
      '2': ['commands'] as const,
      '3': ['aggregates'] as const,
      '4': ['contexts'] as const,
      '5': ['risks'] as const
    }
    
    const artifacts = phaseArtifacts[phase as keyof typeof phaseArtifacts] || []
    const results = []
    
    for (const artifactType of artifacts) {
      try {
        const capturedArtifacts = await artifactManager.autoCapture(artifactType)
        const exportPath = await artifactManager.exportArtifacts({
          type: artifactType,
          format: 'yaml'
        })
        results.push(`✅ ${artifactType}: ${capturedArtifacts.length} artifacts captured`)
      } catch (error: any) {
        results.push(`❌ ${artifactType}: ${error.message}`)
      }
    }
    
    return `🤖 Auto-capture for Phase ${phase}:
${results.join('\n')}`
  } catch (error: any) {
    return `❌ Auto-capture error: ${error.message}`
  }
}

// Tool definition for OpenCode agent system
export const eventstormingTool = tool({
  description: "Manage EventStorming sessions and capture domain-driven design artifacts",
  args: {
    action: tool.schema.string().describe("Action to perform: create, phase, capture, report, list, status, auto-capture"),
    session: tool.schema.string().optional().describe("Session ID for session-specific actions"),
    domain: tool.schema.string().optional().describe("Domain name for new sessions"),
    title: tool.schema.string().optional().describe("Session title for new sessions"),
    participants: tool.schema.string().optional().describe("Comma-separated list of participants"),
    duration: tool.schema.string().optional().describe("Session duration in hours"),
    scope: tool.schema.string().optional().describe("Session scope and boundaries"),
    type: tool.schema.string().optional().describe("Artifact type: events, commands, aggregates, contexts, risks"),
    format: tool.schema.string().optional().describe("Output format: yaml, json, markdown, html, pdf"),
    phase: tool.schema.string().optional().describe("Phase number (1-5) for phase-specific actions"),
    current: tool.schema.string().optional().describe("Current phase number when setting phase"),
    template: tool.schema.string().optional().describe("Report template name"),
    output: tool.schema.string().optional().describe("Output file path"),
    auto: tool.schema.boolean().optional().describe("Auto-capture flag"),
    all: tool.schema.boolean().optional().describe("Include all sessions flag")
  },
  async execute(args, context) {
    try {
      switch (args.action) {
        case 'create':
          if (!args.domain || !args.title) {
            return "❌ Domain and title are required for creating sessions"
          }
          return await createEventStormingSession({
            domain: args.domain,
            title: args.title,
            participants: args.participants,
            duration: args.duration,
            scope: args.scope,
            output: args.output
          })

        case 'phase':
          if (!args.session) {
            return "❌ Session ID is required for phase management"
          }
          return await manageSessionPhase({
            session: args.session,
            action: args.phase as 'list' | 'status' | 'next' | 'set',
            current: args.current
          })

        case 'capture':
          if (!args.session || !args.type) {
            return "❌ Session ID and artifact type are required for capture"
          }
          return await captureArtifacts({
            session: args.session,
            type: args.type as 'events' | 'commands' | 'aggregates' | 'contexts' | 'risks',
            format: args.format as 'yaml' | 'json' | 'markdown',
            output: args.output,
            auto: args.auto
          })

        case 'report':
          if (!args.session) {
            return "❌ Session ID is required for report generation"
          }
          return await generateSessionReport({
            session: args.session,
            format: args.format as 'html' | 'pdf' | 'markdown',
            template: args.template,
            output: args.output
          })

        case 'list':
          return await listSessions({
            all: args.all,
            domain: args.domain
          })

        case 'status':
          if (!args.session) {
            return "❌ Session ID is required for status check"
          }
          return await getSessionStatus({
            session: args.session
          })

        case 'auto-capture':
          if (!args.session) {
            return "❌ Session ID is required for auto-capture"
          }
          return await autoCapturePhase({
            session: args.session,
            phase: args.phase as '1' | '2' | '3' | '4' | '5'
          })

        default:
          return "❌ Unknown action. Available actions: create, phase, capture, report, list, status, auto-capture"
      }
    } catch (error: any) {
      return `❌ Error: ${error.message}`
    }
  },
})

// Default export
export default eventstormingTool