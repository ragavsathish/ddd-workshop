#!/usr/bin/env node

/**
 * EventStorming Session Manager
 * 
 * Manages the lifecycle of EventStorming sessions including:
 * - Session creation and configuration
 * - Phase management and timing
 * - Participant coordination
 * - Artifact capture and organization
 */

import { program } from 'commander';
import { SessionManager } from './session-manager.js';
import { PhaseManager } from './phase-manager.js';
import { ArtifactManager } from './artifact-manager.js';

program
  .name('eventstorming-session-manager')
  .description('Manage EventStorming sessions')
  .version('1.0.0');

// Create new session
program
  .command('create')
  .description('Create a new EventStorming session')
  .requiredOption('-d, --domain <name>', 'Domain name')
  .requiredOption('-t, --title <title>', 'Session title')
  .option('-p, --participants <list>', 'Comma-separated list of participants')
  .option('-d, --duration <hours>', 'Session duration in hours', '4')
  .option('-s, --scope <description>', 'Session scope and boundaries')
  .option('-o, --output <path>', 'Output directory for session files')
  .action(async (options) => {
    const manager = new SessionManager();
    const session = await manager.createSession(options);
    console.log(`Session created: ${session.id}`);
    console.log(`Directory: ${session.path}`);
  });

// Start session phase
program
  .command('phase')
  .description('Manage session phases')
  .requiredOption('-s, --session <id>', 'Session ID')
  .option('-c, --current <number>', 'Current phase number (1-5)')
  .option('-n, --next', 'Move to next phase')
  .option('-l, --list', 'List all phases')
  .option('-s, --status', 'Show current phase status')
  .action(async (options) => {
    const phaseManager = new PhaseManager(options.session);
    
    if (options.list) {
      const phases = await phaseManager.listPhases();
      console.log('Available phases:');
      phases.forEach((phase, index) => {
        console.log(`${index + 1}. ${phase.name} (${phase.duration}min)`);
      });
    } else if (options.status) {
      const status = await phaseManager.getCurrentStatus();
      console.log(`Current phase: ${status.currentPhase}`);
      console.log(`Time remaining: ${status.timeRemaining}min`);
      console.log(`Progress: ${status.progress}%`);
    } else if (options.next) {
      const nextPhase = await phaseManager.moveToNextPhase();
      console.log(`Moved to phase: ${nextPhase.name}`);
    } else if (options.current) {
      await phaseManager.setCurrentPhase(parseInt(options.current));
      console.log(`Set current phase to: ${options.current}`);
    }
  });

// Capture artifacts
program
  .command('capture')
  .description('Capture session artifacts')
  .requiredOption('-s, --session <id>', 'Session ID')
  .requiredOption('-t, --type <type>', 'Artifact type (events, commands, aggregates, contexts, risks)')
  .option('-f, --format <format>', 'Output format (yaml, json, markdown)', 'yaml')
  .option('-o, --output <path>', 'Output file path')
  .option('-a, --auto', 'Auto-capture from session data')
  .action(async (options) => {
    const artifactManager = new ArtifactManager(options.session);
    
    if (options.auto) {
      const artifacts = await artifactManager.autoCapture(options.type);
      console.log(`Captured ${artifacts.length} ${options.type}`);
    } else {
      // Interactive capture mode
      console.log(`Starting ${options.type} capture...`);
      console.log('Enter data (Ctrl+D to finish):');
    }
  });

// Generate session report
program
  .command('report')
  .description('Generate session report')
  .requiredOption('-s, --session <id>', 'Session ID')
  .option('-f, --format <format>', 'Report format (html, pdf, markdown)', 'html')
  .option('-t, --template <name>', 'Report template', 'standard')
  .option('-o, --output <path>', 'Output file path')
  .action(async (options) => {
    const manager = new SessionManager();
    const report = await manager.generateReport(options.session, options);
    console.log(`Report generated: ${report.path}`);
  });

// List sessions
program
  .command('list')
  .description('List all sessions')
  .option('-a, --all', 'Include completed sessions')
  .option('-d, --domain <name>', 'Filter by domain')
  .action(async (options) => {
    const manager = new SessionManager();
    const sessions = await manager.listSessions(options);
    
    console.log('Sessions:');
    sessions.forEach(session => {
      console.log(`${session.id}: ${session.title} (${session.domain})`);
      console.log(`  Status: ${session.status}`);
      console.log(`  Created: ${session.createdAt}`);
    });
  });

program.parse();

export { SessionManager, PhaseManager, ArtifactManager };