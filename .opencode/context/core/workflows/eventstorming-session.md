# EventStorming Session Workflow
## Alberto Brandolini Style

## Session Overview

> *"EventStorming is not about drawing boxes and arrows. It's about having conversations that matter."* - Alberto Brandolini

This workflow guides facilitators through running **Brandolini-style EventStorming** sessions that emphasize collaborative discovery, visual thinking, and domain storytelling over technical diagramming.

## Pre-Session Preparation

### 1. Define Scope
```yaml
session_scope:
  domain: "e.g., Order Management, Customer Onboarding"
  boundaries: "What's in scope vs out of scope"
  participants: "Who needs to be involved"
  duration: "Half-day (4 hours) or Full-day (8 hours)"
  goals: "What we want to achieve"
```

### 2. Participant Preparation
- Send domain overview 1 week before
- Include business context and current challenges
- Provide reading materials on EventStorming basics
- Confirm availability and commitment

### 3. Physical Setup - Brandolini Style
- **Big Paper, Big Conversations** - Largest possible wall space (minimum 6m x 3m)
- **Brandolini Color Coding** - 🟠 Orange (events), 🩷 Pink (commands), 🔵 Blue (actors), 🟡 Yellow (read models), 🟣 Purple (external systems), 🟢 Green (policies), 🔴 Red (hot spots)
- **Multiple Perspectives** - Diverse stakeholder representation
- **Conversation Tools** - Markers, timers, cameras for documentation
- **Comfortable Environment** - Refreshments, breaks, collaborative atmosphere

### 4. Facilitator Preparation - Brandolini's Mindset
- **Embrace "No Experts"** - Everyone contributes domain knowledge
- **Prepare Probing Questions** - The 5 Whys technique
- **Welcome Conflict** - Disagreements reveal domain complexity
- **Storytelling Focus** - Domain narratives over technical diagrams
- **Multiple Perspectives Integration** - Ensure all voices are heard
- **Hot Spot Anticipation** - Areas likely to generate productive conflict

## Session Phases

### Phase 1: Big Picture Domain Events (75 minutes)

#### Brandolini Objectives
- **Discover what happened** - Past tense domain events
- **Tell the domain story** - Left to right narrative flow
- **Use business language** - No technical jargon
- **Surface complexity** - Embrace the messiness

#### Process
1. **Opening (10 min)**
   - Welcome and perspective sharing
   - Explain Brandolini's philosophy
   - Set collaborative ground rules
   - "No experts in the room"

2. **Event Generation (50 min)**
   - **Start with the story** - "Tell me what happens in your business"
   - **Use past tense** - "Order was placed" not "Place order"
   - **Big paper approach** - Capture everything before organizing
   - **Orange sticky notes** - Place events left to right in timeline

3. **Review and Question (15 min)**
   - **Walk the timeline** - Read the story aloud
   - **Apply the 5 Whys** - Dig deep into each event
   - **Mark hot spots** - 🔴 Areas of conflict/uncertainty
   - **Question everything** - Challenge assumptions

#### Brandolini Facilitation Tips
- **Ask "What happened?"** - Not "What should happen?"
- **Use storytelling** - "Sarah wants to buy a book..."
- **Embrace conflict** - Disagreements are valuable
- **Multiple perspectives** - Ensure all voices contribute
- **Visual language** - Make thinking visible

#### Brandolini's Probing Questions
- **"What happened next?"** - Timeline progression
- **"Who was involved?"** - Actor identification
- **"Why did this happen?"** - Root cause analysis
- **"What would have prevented this?"** - Business rules
- **"How did this affect people?"** - Human impact

### Phase 2: Commands & Actors (60 minutes)

#### Brandolini Objectives
- **Discover who tried to do what** - Intent and action
- **Map multiple perspectives** - Different actor viewpoints
- **Understand motivation** - The "why" behind actions
- **Identify system vs human** - Different types of actors

#### Process
1. **Command Discovery (30 min)**
   - **Ask "What did they try to do?"** - For each event
   - **Use imperative mood** - "PlaceOrder" not "Order was placed"
   - **🩷 Pink sticky notes** - Place below triggering events
   - **Focus on intent** - What was the goal?

2. **Actor Identification (20 min)**
   - **Ask "Who caused it?"** - Who initiated the command?
   - **🔵 Blue sticky notes** - Different actor types
   - **Multiple perspectives** - Users, systems, external services
   - **Consider all stakeholders** - Not just obvious ones

3. **Perspective Integration (10 min)**
   - **Map actor motivations** - Why each actor acts
   - **Identify conflicts** - Different actor goals
   - **Question assumptions** - Challenge actor definitions
   - **Look for patterns** - Similar actors, similar intents

#### Brandolini Facilitation Tips
- **Focus on intent** - What were they trying to achieve?
- **Multiple perspectives** - Same event, different viewpoints
- **Question actors** - Are there missing perspectives?
- **Embrace complexity** - Human behavior is messy
- **Consider emotions** - Fear, desire, frustration drive actions

#### Brandolini's Perspective Questions
- **"Who tried to do this?"** - Actor identification
- **"What were they trying to achieve?"** - Intent and motivation
- **"Why this action?"** - Root cause analysis
- **"Who else cares about this?"** - Hidden stakeholders
- **"How did this feel?"** - Emotional impact

### Phase 3: Aggregate Design (60 minutes)

#### Objectives
- Group related events and commands
- Define consistency boundaries
- Identify business invariants
- Establish aggregate roots

#### Process
1. **Event Clustering (25 min)**
   - Group related events together
   - Look for natural boundaries
   - Consider transaction scope
   - Draw boundaries around clusters

2. **Aggregate Identification (20 min)**
   - Name each cluster (Order, Customer, Product)
   - Identify aggregate root
   - Define invariants within each
   - Mark aggregate boundaries clearly

3. **Validation (15 min)**
   - Review aggregate boundaries
   - Check for consistency
   - Verify command assignments
   - Identify cross-aggregate concerns

#### Facilitation Tips
- Look for high cohesion within aggregates
- Ensure loose coupling between aggregates
- Question large aggregates (might be too big)
- Consider performance implications

#### Sample Questions
- "Which events belong together?"
- "What must stay consistent?"
- "Who owns this data?"
- "What are the business rules here?"

### Phase 4: Bounded Contexts (45 minutes)

#### Objectives
- Define context boundaries
- Map team responsibilities
- Identify integration points
- Plan deployment strategy

#### Process
1. **Context Identification (20 min)**
   - Group related aggregates
   - Consider team boundaries
   - Look for natural language boundaries
   - Define context names

2. **Context Mapping (15 min)**
   - Draw context boundaries
   - Identify relationships between contexts
   - Note integration mechanisms
   - Mark external dependencies

3. **Team Assignment (10 min)**
   - Assign contexts to teams
   - Define ownership
   - Plan coordination mechanisms
   - Identify shared responsibilities

#### Facilitation Tips
- Consider Conway's Law
- Look for ubiquitous language changes
- Question context boundaries
- Plan for evolution

#### Sample Questions
- "Who speaks this language?"
- "Which team owns this?"
- "How do these contexts communicate?"
- "What are the integration points?"

### Phase 5: Integration and Risk (30 minutes)

#### Objectives
- Resolve hot spots
- Identify integration patterns
- Assess risks and mitigations
- Plan next steps

#### Process
1. **Hot Spot Resolution (15 min)**
   - Review all 🔴 hot spots
   - Discuss uncertainties
   - Make decisions or plan investigations
   - Document outcomes

2. **Risk Assessment (10 min)**
   - Identify technical risks
   - Consider business risks
   - Plan mitigations
   - Assign owners

3. **Next Steps (5 min)**
   - Define immediate actions
   - Assign responsibilities
   - Schedule follow-ups
   - Document decisions

#### Facilitation Tips
- Prioritize critical hot spots
- Focus on actionable mitigations
- Document decisions clearly
- Ensure ownership is clear

## Post-Session Activities

### 1. Documentation
- Photograph the entire wall
- Create digital versions
- Transcribe sticky notes
- Archive session materials

### 2. Analysis and Refinement
- Review event flows
- Validate aggregate designs
- Check context boundaries
- Identify gaps

### 3. Follow-up Planning
- Schedule technical deep-dives
- Plan implementation phases
- Assign development tasks
- Set up governance processes

### 4. Communication
- Share results with stakeholders
- Update project documentation
- Communicate decisions made
- Plan next workshop

## Session Variations

### Big Room EventStorming
- Multiple teams working together
- Large domain exploration
- Full-day sessions
- Multiple facilitators

### Domain EventStorming
- Focus on specific domain
- Smaller group (5-8 people)
- Half-day sessions
- Deep technical exploration

### Process EventStorming
- Focus on business processes
- Cross-functional participation
- Process improvement focus
- Workflow optimization

### System Context Mapping
- High-level system boundaries
- Architecture focus
- Technical stakeholders
- Integration planning

## Troubleshooting

### Common Issues

#### Low Participation
- **Problem**: People not contributing
- **Solution**: Direct questions, break into smaller groups, use round-robin

#### Technical Dominance
- **Problem**: Technical terms overwhelming business discussion
- **Solution**: Reframe in business language, use domain expert as translator

#### Analysis Paralysis
- **Problem**: Getting stuck on details
- **Solution**: Timebox discussions, move on and come back, use parking lot

#### Scope Creep
- **Problem**: Expanding beyond agreed boundaries
- **Solution**: Refer back to scope, defer out-of-scope items, schedule separate session

#### Conflict Resolution
- **Problem**: Disagreements on domain concepts
- **Solution**: Document both views, gather more data, escalate to decision makers

### Emergency Procedures

#### Running Out of Time
- Prioritize most important areas
- Schedule follow-up sessions
- Document current state
- Plan continuation

#### Key Person Missing
- Document assumptions
- Schedule validation session
- Proceed with available expertise
- Mark uncertainties clearly

#### Wall Space Insufficient
- Use multiple walls
- Create digital backup
- Prioritize most important flows
- Use vertical space efficiently

## 🎯 Brandolini's Success Metrics

### Conversational Metrics
- **Quality of dialogue** - Depth and richness of discussions
- **Multiple perspectives integrated** - All stakeholders see themselves
- **Hot spots identified** - Critical conflicts surfaced and explored
- **Domain stories created** - Narrative flows that make sense
- **Shared understanding** - Team can explain domain together

### Human-Centered Metrics
- **Cross-functional empathy** - Understanding different viewpoints
- **Productive conflict** - Disagreements leading to insights
- **Collaborative energy** - High engagement and participation
- **Question-driven discovery** - Probing vs. answering mindset
- **Shared mental models** - Common understanding emerges

### Brandolini's Leading Indicators
✅ **"No experts in the room" behavior** - Everyone contributes knowledge
✅ **5 Whys technique applied** - Deep domain understanding
✅ **Visual thinking visible** - Sticky notes capture conversations
✅ **Storytelling approach** - Domain narratives over technical diagrams
✅ **Conflict embraced** - Tensions explored productively

### Brandolini's Lagging Indicators
✅ **Implementation preserves conversations** - Code reflects domain insights
✅ **Domain language survives** - Ubiquitous language in daily work
✅ **Hot spots resolved** - Critical conflicts addressed
✅ **Multiple perspectives maintained** - Diverse stakeholders engaged
✅ **Collaborative culture** - Team continues conversational approach

### The Ultimate Brandolini Success Metric
**"Can the team tell the domain story together?"** - If everyone can explain the domain narrative from their perspective and understand how it fits with others, the EventStorming succeeded.