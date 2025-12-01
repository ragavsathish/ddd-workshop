# EventStorming Standards
## Alberto Brandolini Style EventStorming

> *"EventStorming is not about drawing boxes and arrows. It's about having conversations that matter."* - Alberto Brandolini

## 🎯 The Brandolini Philosophy

### **Core Principles**
1. **Big Paper, Big Conversations** - Use the largest possible space to encourage collective thinking
2. **Domain Events First** - Start with what happened in the past, not what should happen
3. **Multiple Perspectives** - Include developers, domain experts, users, and business stakeholders
4. **Visual Language** - Orange sticky notes for events, pink for commands, blue for actors, yellow for read models
5. **Narrative Flow** - Tell the story of the domain from left to right

### **The EventStorming Mantra**
- **What happened?** → Domain Events (Orange)
- **Who caused it?** → Actors (Blue)  
- **What did they try to do?** → Commands (Pink)
- **What do we need to know?** → Read Models (Yellow)
- **What could go wrong?** → External Systems (Purple)
- **What policies apply?** → Policies (Green)

## EventStorming Process

### Phase 1: Domain Events Discovery
**Duration**: 45-60 minutes
**Participants**: All stakeholders
**Goal**: Identify what happened in the domain

#### Brandolini's Approach
1. **Start with the story** - "Tell me what happens in your business"
2. **Use past tense** - Focus on what actually occurred
3. **Big paper first** - Capture everything before organizing
4. **Question everything** - Challenge assumptions and terminology
5. **Embrace conflict** - Disagreements reveal domain complexity

#### Event Types to Capture
- Business milestones
- State changes
- Decisions made
- External notifications
- System responses
- User interactions
- Policy violations

### Phase 2: Commands and Actors
**Duration**: 30-45 minutes
**Participants**: Product Owner, Developer, Domain Expert
**Goal**: Identify who does what

#### Brandolini's Command Discovery
1. **Ask "Who tried to do what?"** - For each event
2. **Use imperative mood** - Commands are actions
3. **Identify the actors** - Who initiated the action?
4. **Map the intent** - What was the user trying to achieve?
5. **Consider system triggers** - Automated commands

#### Actor Mapping
```yaml
actors:
  - name: "Customer"
    commands: ["PlaceOrder", "CancelOrder", "UpdateProfile"]
    goals: ["Buy products", "Manage account"]
    perspective: "End User"
  
  - name: "Admin"
    commands: ["ApproveOrder", "RefundPayment", "ManageInventory"]
    goals: ["Process orders", "Handle exceptions"]
    perspective: "Business Operations"
    
  - name: "System"
    commands: ["ProcessPayment", "SendNotification", "UpdateInventory"]
    goals: ["Automated processes", "System responses"]
    perspective: "Technical"
```

### Phase 3: Aggregate Design
**Duration**: 45-60 minutes
**Participants**: Developer, Domain Expert
**Goal**: Group events into aggregates

#### Aggregate Identification
- Events that belong together
- Consistency boundaries
- Business invariants
- Transaction scopes

#### Aggregate Rules
- One aggregate root per cluster
- Events belong to one aggregate
- Commands target one aggregate
- Invariants enforced within aggregate

### Phase 4: Bounded Contexts
**Duration**: 30-45 minutes
**Participants**: Developer, Architect, Domain Expert
**Goal**: Define context boundaries

#### Context Mapping
- Natural language boundaries
- Team boundaries
- Deployment boundaries
- Integration points

#### Context Types
- Core Domain: Competitive advantage
- Supporting Domain: Necessary but not differentiating
- Generic Domain: Commodity solutions
- Legacy System: Existing constraints

### Phase 5: Integration and Risk
**Duration**: 30-45 minutes
**Participants**: All stakeholders, Risk Analyst
**Goal**: Identify integration points and risks

#### Integration Patterns
- Event-driven communication
- API contracts
- Shared data concerns
- External system dependencies

#### Risk Assessment
- Hot spot resolution
- Failure scenarios
- Performance concerns
- Security implications

## Visual Organization

### Physical Layout
```
┌─────────────────────────────────────────────────────────┐
│                    TIMELINE (Left → Right)              │
├─────────────────────────────────────────────────────────┤
│  [Event 1] → [Event 2] → [Event 3] → [Event 4] → ...   │
│     ↑           ↑           ↑           ↑              │
│  [Command]   [Command]   [Command]   [Command]         │
│     ↑           ↑           ↑           ↑              │
│  [Actor]     [Actor]     [Actor]     [Actor]           │
└─────────────────────────────────────────────────────────┘
```

### Brandolini Color Coding
- **🟠 Orange**: Domain Events - What happened?
- **🩷 Pink**: Commands - What did they try to do?
- **🔵 Blue**: Actors - Who caused it?
- **🟡 Yellow**: Read Models - What do we need to know?
- **🟣 Purple**: External Systems - What could go wrong?
- **🟢 Green**: Policies - What policies apply?
- **🔴 Red**: Hot Spots - Areas of conflict/uncertainty

### Spatial Grouping
- **Vertical lanes**: Bounded contexts
- **Horizontal flow**: Time progression
- **Clusters**: Related events/aggregates
- **Boundaries**: Context limits

## Output Formats

### Domain Event Specification
```yaml
domain_event:
  name: "OrderPlaced"
  past_tense: true
  business_meaning: "Customer has successfully placed an order"
  
  trigger:
    command: "PlaceOrder"
    actor: "Customer"
    preconditions:
      - "Customer exists"
      - "Items in stock"
      - "Payment method valid"
  
  data:
    order_id: "UUID"
    customer_id: "UUID"
    items: "Array[OrderItem]"
    total_amount: "Decimal"
    placed_at: "Timestamp"
  
  consumers:
    - "Inventory Service (reserve stock)"
    - "Payment Service (process payment)"
    - "Notification Service (send confirmation)"
```

### Command Specification
```yaml
command:
  name: "PlaceOrder"
  imperative: true
  actor: "Customer"
  
  input_validation:
    required_fields: ["customer_id", "items", "payment_method"]
    business_rules:
      - "Customer must be active"
      - "All items must be in stock"
      - "Order total must be positive"
  
  business_logic:
    - "Validate customer status"
    - "Check inventory availability"
    - "Calculate total amount"
    - "Reserve inventory"
    - "Generate OrderPlaced event"
  
  error_scenarios:
    - "Customer not found"
    - "Items out of stock"
    - "Payment method invalid"
    - "Insufficient funds"
```

### Aggregate Specification
```yaml
aggregate:
  name: "Order"
  root: "Order"
  
  invariants:
    - "Order must have at least one item"
    - "Order total must match sum of item prices"
    - "Order status transitions must be valid"
  
  commands:
    - "PlaceOrder"
    - "CancelOrder"
    - "UpdateShippingAddress"
    - "AddItem"
    - "RemoveItem"
  
  events:
    - "OrderPlaced"
    - "OrderCancelled"
    - "ShippingAddressUpdated"
    - "ItemAdded"
    - "ItemRemoved"
  
  consistency_rules:
    - "All operations within Order are atomic"
    - "No cross-aggregate transactions"
    - "Eventual consistency with other contexts"
```

### Bounded Context Specification
```yaml
bounded_context:
  name: "Order Management"
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
      consumers: ["Inventory", "Payment", "Notification"]
    
    - type: "api"
      direction: "consumes"
      service: "Customer Service"
      operations: ["GetCustomer", "ValidateCustomer"]
  
  team: "Order Team"
  deployment: "order-service"
```

## 🎭 Brandolini's Facilitation Techniques

### Session Setup
- **Big Paper, Big Conversations** - Use the largest possible space
- **Sticky notes in Brandolini colors** - Orange, pink, blue, yellow, purple, green
- **Multiple perspectives in the room** - No experts, all contributors
- **Camera for documentation** - Capture the evolution
- **Timer for phase management** - Keep the energy flowing

### Participant Roles
- **Facilitator**: Manages process, asks probing questions
- **Domain Experts**: Everyone contributes domain knowledge
- **Developers**: Technical perspective and feasibility
- **Business Stakeholders**: Value and priorities
- **End Users**: Real-world experience and needs

### Brandolini's Conflict Resolution
- **Embrace conflict** - Disagreements reveal domain complexity
- **Use the "5 Whys"** - Dig deep into root causes
- **Multiple perspectives** - Ensure all voices are heard
- **Document hot spots** - Mark areas needing deeper exploration
- **Storytelling approach** - Use narratives to resolve disagreements

### The Human Side of EventStorming
- **No experts in the room** - Everyone has valuable knowledge
- **Question everything** - Challenge assumptions and terminology
- **Visual language** - Make thinking visible with sticky notes
- **Collaborative discovery** - Build shared understanding together
- **Iterative refinement** - Evolve the model through conversation

### Documentation
- Photograph each phase's evolution
- Capture the conversations, not just the diagram
- Document decisions and open questions
- Record the "aha!" moments and insights
- Archive for future reference and onboarding

## 🎯 Brandolini's Quality Indicators

### Good Signs - The Brandolini Way
✅ **Rich domain conversations** - Not just language, but deep discussions
✅ **Narrative flow** - The story makes sense from left to right
✅ **Multiple perspectives aligned** - Everyone sees their world reflected
✅ **Hot spots identified** - Areas of conflict are surfaced and discussed
✅ **Collaborative energy** - High engagement and participation
✅ **Actionable insights** - Clear next steps emerge naturally

### Warning Signs - Brandolini's Red Flags
⚠️ **Technical jargon in events** - Events should be business language
⚠️ **Missing "why"** - Events without business meaning
⚠️ **Silent participants** - Not all perspectives are contributing
⚠️ **No conflicts** - Might indicate lack of depth or engagement
⚠️ **Perfect diagram** - Real domains are messy and complex
⚠️ **Single perspective** - Only one viewpoint dominates

### Brandolini's Success Metrics
- **Quality of conversations** - Depth and richness of dialogue
- **Shared understanding** - Everyone can explain the domain story
- **Hot spots resolved** - Critical conflicts addressed
- **Multiple perspectives integrated** - All stakeholders see themselves
- **Actionable next steps** - Clear path forward identified
- **Domain language captured** - Ubiquitous language emerges

## 🚨 Hot Spots Identification (Brandolini Style)

### Critical Hot Spots to Watch For
1. **Business vs Technical Priorities** - Different value systems
2. **Speed vs Quality** - Time to market vs. robustness
3. **Safety vs Growth** - User protection vs. acquisition
4. **Privacy vs Personalization** - Data protection vs. user experience
5. **Automation vs Human Touch** - Efficiency vs. personal service

### Hot Spot Resolution Techniques
- **Stakeholder mapping** - Who cares about this and why?
- **Impact analysis** - What are the consequences of each option?
- **Experiment design** - How can we test different approaches?
- **Phased implementation** - Can we evolve toward a solution?
- **Decision recording** - Document the rationale for choices made