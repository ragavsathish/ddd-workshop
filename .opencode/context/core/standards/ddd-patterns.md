# DDD Patterns and Standards

## Domain-Driven Design Principles

### Core Concepts

**Bounded Contexts**: Explicit boundaries within which a particular domain model is defined and applicable.

**Aggregates**: Clusters of domain objects that can be treated as a single unit. The aggregate root is the entry point.

**Domain Events**: Events that represent something meaningful that happened in the domain.

**Entities**: Objects with a distinct identity that runs through time and different states.

**Value Objects**: Objects defined by their attributes rather than identity.

### EventStorming Patterns

#### Event Types
- **Domain Events**: Past tense, business-meaningful events (OrderPlaced, PaymentProcessed)
- **Commands**: Imperative, user-initiated actions (PlaceOrder, ProcessPayment)
- **Read Models**: Projections optimized for queries (OrderStatusView, ProductCatalog)
- **External Systems**: Third-party integrations (PaymentGateway, InventoryService)

#### Visual Organization
- **Timeline**: Left to right flow of events
- **Actors**: Who performs commands (Customer, Admin, System)
- **Bounded Contexts**: Grouped by domain responsibility
- **Hot Spots**: 🔴 Areas of uncertainty or risk

### Aggregate Design Rules

#### Invariants
- Business rules that must always hold true
- Enforced within aggregate boundaries
- Never violated by external operations

#### Consistency Boundaries
- Each aggregate is a consistency boundary
- Transactions should not span multiple aggregates
- Use eventual consistency between aggregates

#### Command Handling
```yaml
command_validation:
  - Validate business rules
  - Check aggregate state
  - Generate domain events
  - Persist changes atomically
```

### Bounded Context Mapping

#### Context Relationships
- **Customer/Supplier**: One context provides services to another
- **Conformist**: One context adopts the model of another
- **Anti-Corruption Layer**: Protects one context from another's model
- **Shared Kernel**: Common model between contexts
- **Separate Ways**: No integration needed

#### Integration Patterns
- **Event-Driven**: Asynchronous communication via events
- **API**: Synchronous request/response
- **Shared Database**: Direct data access (avoid when possible)
- **Message Bus**: Reliable message delivery

### Event Design Standards

#### Event Naming
- Past tense (OrderPlaced, not PlaceOrder)
- Business language, not technical
- Clear and unambiguous
- Include key business entities

#### Event Payload
```yaml
event_structure:
  event_id: "unique-identifier"
  event_type: "OrderPlaced"
  occurred_at: "2024-01-19T10:30:00Z"
  aggregate_id: "order-123"
  aggregate_type: "Order"
  version: 1
  data:
    customer_id: "cust-456"
    items: [...]
    total_amount: 99.99
```

#### Event Versioning
- Never remove fields from existing events
- Add new fields as optional
- Use version numbers for breaking changes
- Maintain backward compatibility

### Command Design Standards

#### Command Naming
- Imperative mood (PlaceOrder, not OrderPlaced)
- Clear intent
- Include target aggregate when needed
- Use business terminology

#### Command Validation
```yaml
validation_layers:
  input_validation:
    - Required fields
    - Data types
    - Format validation
  
  business_rules:
    - Domain invariants
    - Authorization
    - Business constraints
  
  state_validation:
    - Aggregate state
    - Pre-conditions
    - Idempotency checks
```

### Testing Strategies

#### Unit Tests
- Test aggregate behavior in isolation
- Verify business rules
- Test command handling
- Validate event generation

#### Integration Tests
- Test bounded context interactions
- Verify event handling
- Test external integrations
- Validate data consistency

#### Acceptance Tests
- Given-When-Then scenarios
- Business language
- End-to-end workflows
- User journey validation

### Common Anti-Patterns

#### Anemic Domain Model
- Domain objects with no behavior
- All logic in service layer
- **Fix**: Move behavior to domain objects

#### God Aggregate
- Single aggregate doing too much
- Performance issues
- **Fix**: Split into focused aggregates

#### Ubiquitous Language Violation
- Technical terms in domain model
- Inconsistent terminology
- **Fix**: Use business language consistently

#### Tight Coupling
- Direct database access between contexts
- Shared domain models
- **Fix**: Use events and APIs

### Quality Checklist

For each bounded context:
- [ ] Clear boundaries defined
- [ ] Ubiquitous language established
- [ ] Aggregates identified
- [ ] Events defined
- [ ] Commands specified
- [ ] Integration points mapped
- [ ] Tests written
- [ ] Documentation created

For each aggregate:
- [ ] Aggregate root identified
- [ ] Invariants defined
- [ ] Commands handled
- [ ] Events generated
- [ ] Consistency boundaries respected
- [ ] Idempotency ensured
- [ ] Business rules enforced

For each event:
- [ ] Past tense naming
- [ ] Clear business meaning
- [ ] Complete payload
- [ ] Version strategy
- [ ] Consumers identified
- [ ] Handling defined

For each command:
- [ ] Imperative naming
- [ ] Clear validation
- [ ] Authorization checks
- [ ] Idempotency handling
- [ ] Error scenarios
- [ ] Rollback strategy