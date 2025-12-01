---
description: "Command to facilitate and manage EventStorming sessions"
mode: command
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
---

# EventStorming Session Command
## Alberto Brandolini Style

Facilitates and manages EventStorming sessions using Alberto Brandolini's collaborative approach for domain-driven design workshops.

> *"EventStorming is not about drawing boxes and arrows. It's about having conversations that matter."*

## Usage

```bash
/opencode eventstorming-session [action] [options]
```

## Actions

### `start`
Start a new EventStorming session.

**Options:**
- `--domain <name>`: Domain to explore (required)
- `--duration <hours>`: Session duration in hours (default: 4)
- `--participants <list>`: Participant roles (default: all)
- `--scope <description>`: Session scope and boundaries

**Example:**
```bash
/opencode eventstorming-session start --domain "Order Management" --duration 6 --participants "Product Owner,Developer,Domain Expert"
```

### `phase`
Manage session phases.

**Options:**
- `--current <phase>`: Current phase number (1-5)
- `--next`: Move to next phase
- `--status`: Show current phase status

**Brandolini Phases:**
1. **Big Picture Events** - What happens in the domain?
2. **Commands & Actors** - Who tries to do what?
3. **Read Models & Policies** - What do we need to know?
4. **Hot Spots Exploration** - Where are the conflicts?
5. **Context Mapping** - How does everything fit together?

**Example:**
```bash
/opencode eventstorming-session phase --current 1
/opencode eventstorming-session phase --next
```

### `capture`
Capture session outputs and artifacts.

**Options:**
- `--type <type>`: Type of capture (events, commands, aggregates, contexts, risks)
- `--format <format>`: Output format (yaml, markdown, json)
- `--output <path>`: Output file path

**Example:**
```bash
/opencode eventstorming-session capture --type events --format yaml --output ./domain-events.yaml
```

### `analyze`
Analyze session results and generate insights.

**Options:**
- `--input <path>`: Input file with session data
- `--focus <area>`: Analysis focus (aggregates, contexts, integration, risks)
- `--report <format>`: Report format (summary, detailed, recommendations)

**Example:**
```bash
/opencode eventstorming-session analyze --input ./session-data.json --focus aggregates --report detailed
```

### `validate`
Validate session outputs against DDD principles.

**Options:**
- `--input <path>`: Input file to validate
- `--rules <type>`: Validation rules (basic, comprehensive, custom)
- `--fix`: Attempt to fix identified issues

**Example:**
```bash
/opencode eventstorming-session validate --input ./bounded-contexts.yaml --rules comprehensive
```

## Session Templates

### Brandolini Domain Events Template
```yaml
domain_events:
  - name: "OrderPlaced"
    color: "🟠 Orange"
    question: "What happened?"
    description: "Customer has successfully placed an order"
    business_meaning: "A commitment to purchase has been made"
    narrative: "Customer decided to buy items and completed the purchase process"
    
    trigger:
      command: "PlaceOrder"
      actor: "Customer"
      intent: "Buy desired products"
    
    data:
      order_id: "UUID"
      customer_id: "UUID"
      items: "Array[OrderItem]"
      total_amount: "Decimal"
      placed_at: "Timestamp"
    
    business_rules:
      - "Order must have at least one item"
      - "Customer must be active"
      - "Items must be in stock"
    
    five_whys:
      - "Why place order? → To acquire desired products"
      - "Why acquire products? → To fulfill needs/wants"
      - "Why fulfill needs? → To improve quality of life"
      - "Why improve life? → To achieve personal goals"
      - "Why achieve goals? → To find happiness and satisfaction"
```

### Brandolini Command Template
```yaml
commands:
  - name: "PlaceOrder"
    color: "🩷 Pink"
    question: "What did they try to do?"
    description: "Customer attempts to place a new order"
    actor: "Customer"
    intent: "Purchase desired products"
    
    input_validation:
      required_fields: ["customer_id", "items", "payment_method"]
      business_rules:
        - "Customer must be authenticated"
        - "All items must be valid"
        - "Payment method must be supported"
    
    business_logic:
      - "Validate customer status"
      - "Check inventory availability"
      - "Calculate total amount"
      - "Validate payment method"
      - "Generate OrderPlaced event"
    
    output_events: ["OrderPlaced"]
    error_scenarios:
      - "Customer not found"
      - "Items out of stock"
      - "Invalid payment method"
      - "Insufficient funds"
      - "System unavailable"
    
    user_story: "As a customer, I want to place an order so that I can purchase products I need"
```

### Aggregate Template
```yaml
aggregates:
  - name: "Order"
    root: "Order"
    invariants:
      - "Order must have at least one item"
      - "Order total must match sum of items"
      - "Order status transitions must be valid"
    commands:
      - "PlaceOrder"
      - "CancelOrder"
      - "UpdateShippingAddress"
    events:
      - "OrderPlaced"
      - "OrderCancelled"
      - "ShippingAddressUpdated"
    consistency_rules:
      - "All operations within Order are atomic"
      - "No cross-aggregate transactions"
```

### Bounded Context Template
```yaml
bounded_contexts:
  - name: "Order Management"
    type: "Core Domain"
    responsibilities:
      - "Order lifecycle management"
      - "Order validation"
      - "Order status tracking"
    aggregates:
      - "Order"
      - "OrderItem"
    integration_points:
      - type: "event_driven"
        direction: "publishes"
        events: ["OrderPlaced", "OrderCancelled"]
        consumers: ["Inventory", "Payment"]
    team: "Order Team"
    deployment: "order-service"
```

## Integration with Agents

This command coordinates with specialized agents:

- **Facilitator Agent**: Orchestrates session flow and timing
- **Product Owner Agent**: Provides business perspective and domain knowledge
- **Developer Agent**: Provides technical perspective and DDD patterns
- **Service Designer Agent**: Focuses on user experience and journey mapping
- **Risk Analyst Agent**: Identifies potential failures and edge cases
- **Test Engineer Agent**: Defines acceptance criteria and test scenarios

## Output Formats

### Session Summary
```yaml
session_summary:
  domain: "Order Management"
  duration: "6 hours"
  participants: ["Product Owner", "Developer", "Domain Expert", "Facilitator"]
  
  phases_completed:
    - phase: "Domain Events Discovery"
      duration: "90 minutes"
      events_identified: 23
      hot_spots: 3
    
    - phase: "Commands and Actors"
      duration: "60 minutes"
      commands_identified: 18
      actors_identified: 5
  
  key_findings:
    - "Identified 3 clear bounded contexts"
    - "Discovered 2 major integration points"
    - "Found 5 critical business rules"
  
  next_steps:
    - "Resolve hot spots with domain experts"
    - "Define integration contracts"
    - "Create implementation roadmap"
```

### Analysis Report
```yaml
analysis_report:
  session_id: "ES-2024-01-19-001"
  domain: "Order Management"
  
  aggregate_analysis:
    well_defined:
      - "Order: Clear invariants and boundaries"
      - "Customer: Good consistency boundaries"
    needs_refinement:
      - "Payment: May be too large, consider splitting"
      - "Inventory: Unclear transaction boundaries"
  
  context_mapping:
    clear_boundaries:
      - "Order Management vs Inventory"
      - "Payment vs Notification"
    integration_challenges:
      - "Order Management ↔ Payment: Complex compensation logic"
      - "Inventory ↔ Shipping: Real-time synchronization needed"
  
  risk_assessment:
    high_risk:
      - "Payment processing failures"
      - "Inventory consistency issues"
    mitigations:
      - "Implement saga pattern for payment"
      - "Use eventual consistency for inventory"
```

## 🎯 Brandolini's Best Practices

### Session Preparation - The Brandolini Way
1. **Big Paper, Big Conversations** - Use the largest possible space
2. **Multiple Perspectives** - Include diverse stakeholders
3. **No Experts in the Room** - Everyone contributes domain knowledge
4. **Storytelling Mindset** - Focus on domain narratives, not technical diagrams
5. **Conflict Embracement** - Prepare for and welcome disagreements

### During Session - Brandolini Techniques
1. **Ask "What Happened?"** - Start with past tense domain events
2. **Use the 5 Whys** - Dig deep into root causes and motivations
3. **Question Everything** - Challenge assumptions and terminology
4. **Visual Language** - Make thinking visible with colored sticky notes
5. **Embrace Messiness** - Real domains are complex and imperfect

### Post-Session - Capturing the Value
1. **Document Conversations** - Not just the diagram, but the discussions
2. **Record Insights** - Capture the "aha!" moments and breakthroughs
3. **Validate with Stories** - Ensure the domain narrative makes sense
4. **Plan Hot Spot Resolution** - Schedule follow-up for conflict areas
5. **Share Understanding** - Distribute the shared mental model

### Brandolini's Facilitation Secrets
- **Start with the story** - "Tell me what happens in your business"
- **Use past tense** - Forces focus on what actually occurred
- **Color psychology** - Orange events catch attention, pink commands show action
- **Spatial organization** - Left to right narrative flow
- **Collaborative energy** - Keep the conversation moving and engaging

## Troubleshooting

### Common Issues

#### Low Participation
- Use direct questions to engage quiet participants
- Break into smaller groups for discussions
- Use round-robin technique for idea generation

#### Analysis Paralysis
- Timebox discussions strictly
- Use parking lot for off-topic discussions
- Focus on most important areas first

#### Scope Creep
- Refer back to defined scope
- Defer out-of-scope items to follow-up
- Maintain focus on core domain

#### Technical Dominance
- Reframe technical discussions in business terms
- Use domain expert as translator
- Focus on business outcomes, not implementation

### Error Recovery

#### Session Interruption
- Document current state
- Schedule continuation
- Prepare summary for restart

#### Key Participant Missing
- Document assumptions
- Plan validation session
- Proceed with available expertise

#### Technology Issues
- Have backup collaboration methods
- Use manual documentation
- Focus on discussion over tools