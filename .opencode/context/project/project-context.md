# DDD Workshop Project Context
## Alberto Brandolini EventStorming Approach

## Project Overview

This is a Domain-Driven Design (DDD) workshop project focused on learning and applying DDD principles through **Alberto Brandolini's EventStorming** approach - emphasizing collaborative conversations, visual thinking, and domain storytelling.

> *"EventStorming is not about drawing boxes and arrows. It's about having conversations that matter."* - Alberto Brandolini

## Project Structure

```
ddd-workshop/
├── assets/                     # EventStorming visual assets
│   ├── eventstorming-actors.png
│   ├── eventstorming-bounded-contexts.png
│   ├── eventstorming-commands.png
│   ├── eventstorming-entities.png
│   ├── eventstorming-events.png
│   ├── eventstorming-fail-events.png
│   └── eventstorming-final.png
├── .opencode/                  # OpenCode configuration
│   ├── agent/                  # AI agents for DDD roles
│   ├── context/                # Context and guidelines
│   ├── command/                # Domain-specific commands
│   └── tool/                   # Utility tools
├── OpenAgents/                 # Reference implementation
└── *.md                        # Workshop documentation
```

## 🎯 Learning Objectives - Brandolini Style

### Primary Goals - The Conversational Approach
- **Master collaborative domain discovery** through Brandolini's techniques
- **Facilitate Big Picture EventStorming** with multiple perspectives
- **Identify domain conflicts and hot spots** through conversation
- **Develop domain storytelling skills** for shared understanding
- **Apply visual thinking** to complex domain problems

### Secondary Goals - Beyond the Diagram
- **Embrace productive conflict** to reveal domain complexity
- **Practice the 5 Whys technique** for deep domain understanding
- **Learn question-driven facilitation** vs. answer-driven approaches
- **Develop cross-functional empathy** through perspective sharing
- **Create shared mental models** that survive implementation

## 🏊‍♂️ Workshop Phases - Brandolini's Big Picture EventStorming

### Phase 1: Foundation & Mindset (Week 1-2)
- **Brandolini's Philosophy** - Big paper, big conversations
- **Visual Language Mastery** - Orange events, pink commands, blue actors
- **Collaborative Discovery** - No experts in the room
- **Question-Driven Facilitation** - The art of probing
- **Conflict Embracement** - Turning disagreements into insights

### Phase 2: Big Picture EventStorming (Week 3-4)
- **Domain Events Discovery** - "What happened?" (Orange sticky notes)
- **Commands & Actors** - "Who tried to do what?" (Pink & Blue)
- **Read Models & Policies** - "What do we need to know?" (Yellow & Green)
- **Hot Spots Exploration** - Where are the conflicts? (Red markers)
- **Multiple Perspectives Integration** - Business, technical, user viewpoints

### Phase 3: From Conversation to Code (Week 5-6)
- **Aggregate Design** - Consistency boundaries from events
- **Bounded Context Mapping** - Natural language boundaries
- **Integration Patterns** - Event-driven collaboration
- **Implementation Strategies** - Preserving domain conversations

### Phase 4: Advanced Brandolini Techniques (Week 7-8)
- **Strategic EventStorming** - Multiple bounded contexts
- **Legacy System Domain Discovery** - Finding the business in existing code
- **Organizational Design** - Team structures from domain models
- **Evolutionary Architecture** - Changing domains, changing systems

## 🎭 Domain Context
### Sample Domain: Social Media Application (Brandolini Style)

For workshop purposes, we use a **social media application** domain as it provides rich examples of Brandolini's EventStorming principles:
- **Multiple conflicting perspectives** (Users vs Business vs Safety vs Legal)
- **Complex human interactions** and social dynamics
- **Safety vs Growth tensions** - perfect hot spot examples
- **Real-world complexity** that resists simplistic technical solutions

#### Why Social Media for Brandolini EventStorming?
- **Rich domain conversations** - Everyone has experience with social media
- **Natural conflicts** - Privacy vs UX, Safety vs Growth, Free Speech vs Moderation
- **Multiple perspectives** - Users, Parents, Regulators, Advertisers, Developers
- **Emotional complexity** - Human behavior doesn't fit neat technical boxes
- **Real business stakes** - Multi-billion dollar decisions depend on domain understanding

#### Core Domain Stories (Brandolini Narrative Approach)
1. **User Onboarding Journey** - Registration → Verification → Profile Creation
2. **Content Creation & Discovery** - Posting → Moderation → Feed Distribution
3. **Social Interaction** - Following → Liking → Commenting → Blocking
4. **Safety & Governance** - Reporting → Review → Enforcement → Appeals
5. **Community Building** - Groups → Events → Connections → Engagement

#### Brandolini's Hot Spots in Social Media
- **Content Moderation vs. Free Speech** - Who decides what's appropriate?
- **Privacy vs. Personalization** - Data collection vs. user experience
- **Safety vs. Growth** - Strict controls vs. rapid user acquisition
- **Real-time vs. Review** - Immediate posting vs. thorough moderation
- **Global vs. Local** - Universal policies vs. cultural differences

#### Key Domain Questions (5 Whys Style)
- **Why do users share content?** → To connect → To belong → To be heard → To matter → To exist
- **Why do we moderate content?** → To protect users → To build trust → To retain users → To grow business → To survive
- **Why do users block others?** → To stop harm → To feel safe → To stay engaged → To remain users → To sustain platform

## 🎭 Agent Roles - Brandolini's Multiple Perspectives

### EventStorming Participants (No Experts in the Room!)
- **Facilitator**: Orchestrates conversations, asks probing questions, manages time
- **Product Owner**: Business value perspective, user needs, market understanding
- **Developer**: Technical feasibility, DDD patterns, implementation concerns
- **Service Designer**: User experience, human-centered design, emotional impact
- **Risk Analyst**: Safety implications, failure scenarios, compliance requirements
- **Test Engineer**: Quality criteria, acceptance scenarios, edge cases

### Brandolini's Agent Philosophy
- **Everyone contributes domain knowledge** - No single expert
- **Multiple perspectives reveal complexity** - Each role sees different aspects
- **Structured outputs capture conversations** - YAML preserves the dialogue
- **Cross-agent questioning challenges assumptions** - Built-in peer review
- **Conflict between agents is valuable** - Reveals domain tensions

### Agent Collaboration Patterns
- **Perspective sharing** - Each agent explains their worldview
- **Question-driven dialogue** - Agents probe each other's assumptions
- **Hot spot identification** - Disagreements mark important domain areas
- **Consensus through understanding** - Not compromise, but shared insight
- **Narrative building** - Together they construct the domain story

## Workshop Materials

### Visual Assets
- EventStorming session photographs
- Domain model diagrams
- Bounded context maps
- Aggregate designs
- Integration patterns

### Documentation
- EventStorming guides and templates
- DDD pattern references
- Implementation examples
- Best practices and anti-patterns

### Tools and Templates
- EventStorming session templates
- Domain model documentation formats
- Code structure templates
- Integration testing patterns

## 🎯 Success Criteria - Brandolini's Conversational Metrics

### Learning Outcomes - Beyond Technical Skills
- **Facilitate rich domain conversations** that reveal hidden complexity
- **Master Brandolini's questioning techniques** for deep domain discovery
- **Identify and embrace hot spots** as sources of domain insight
- **Build shared understanding** across diverse perspectives
- **Translate conversations** into actionable domain models

### Practical Outcomes - Conversation to Implementation
- **Rich domain narratives** that capture business complexity
- **Well-defined hot spots** with resolution strategies
- **Multiple perspective integration** in bounded contexts
- **Human-centered domain models** that serve real needs
- **Collaborative decision records** explaining the "why"

### Collaboration Outcomes - The Human Side
- **Cross-functional empathy** through perspective sharing
- **Productive conflict resolution** skills
- **Shared domain language** that everyone understands
- **Conversational facilitation** abilities
- **Collective ownership** of domain understanding

### Brandolini's Success Indicators
✅ **Conversations over diagrams** - Rich dialogue captured
✅ **Multiple perspectives integrated** - All stakeholders see themselves
✅ **Hot spots identified and explored** - Conflicts become insights
✅ **Domain stories make sense** - Narrative flows naturally
✅ **Shared understanding emerges** - Team can explain the domain together
✅ **Implementation preserves conversations** - Code reflects domain insights

## Assessment Methods

### Knowledge Assessment
- Domain modeling exercises
- EventStorming facilitation practice
- DDD pattern identification
- Integration design challenges

### Practical Assessment
- Code structure design
- Implementation of aggregates
- Integration between contexts
- Test scenario creation

### Collaboration Assessment
- Team participation quality
- Cross-functional communication
- Decision-making effectiveness
- Conflict resolution skills

## Resources and References

### Primary Resources
- Domain-Driven Design by Eric Evans
- EventStorming by Alberto Brandolini
- Implementing Domain-Driven Design by Vaughn Vernon
- Patterns, Principles, and Practices of Domain-Driven Design by Scott Millett

### Online Resources
- DDD Community forums
- EventStorming case studies
- Open-source DDD examples
- Video tutorials and workshops

### Tools
- EventStorming collaboration tools
- Domain modeling software
- Code generation tools
- Testing frameworks

## Next Steps

### Immediate Actions
1. Complete agent configuration and testing
2. Prepare sample domain materials
3. Set up collaboration tools
4. Schedule initial workshop sessions

### Medium-term Goals
1. Conduct full EventStorming workshop
2. Develop implementation examples
3. Create advanced scenario exercises
4. Document lessons learned

### Long-term Vision
1. Expand to multiple domains
2. Develop certification program
3. Create community resources
4. Contribute to DDD knowledge base