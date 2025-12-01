---
description: "Command for domain modeling and DDD pattern application"
mode: command
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
---

# Domain Modeling Command

Provides tools and workflows for creating, analyzing, and refining domain models using DDD patterns.

## Usage

```bash
/opencode domain-modeling [action] [options]
```

## Actions

### `create`
Create new domain model components.

**Options:**
- `--type <type>`: Component type (aggregate, entity, value-object, event, command)
- `--name <name>`: Component name (required)
- `--context <context>`: Bounded context (required)
- `--template <template>`: Template to use (basic, comprehensive, custom)

**Example:**
```bash
/opencode domain-modeling create --type aggregate --name Order --context "Order Management"
```

### `analyze`
Analyze existing domain models for DDD compliance.

**Options:**
- `--input <path>`: Input file or directory
- `--focus <area>`: Analysis focus (aggregates, boundaries, invariants, events)
- `--rules <level>`: Analysis rules (basic, standard, comprehensive)
- `--report <format>`: Report format (summary, detailed, recommendations)

**Example:**
```bash
/opencode domain-modeling analyze --input ./domain-models --focus aggregates --rules comprehensive
```

### `refactor`
Refactor domain models to improve DDD compliance.

**Options:**
- `--input <path>`: Input model file
- `--pattern <pattern>`: Refactoring pattern (split-aggregate, extract-value-object, define-context)
- `--validate`: Validate refactored model
- `--backup`: Create backup before refactoring

**Example:**
```bash
/opencode domain-modeling refactor --input ./order-aggregate.yaml --pattern split-aggregate --validate
```

### `validate`
Validate domain models against DDD principles.

**Options:**
- `--input <path>`: Input file or directory
- `--rules <ruleset>`: Validation ruleset (basic, ddd-principles, eventstorming, custom)
- `--fix`: Attempt to fix identified issues
- `--report <format>`: Report format (json, yaml, markdown)

**Example:**
```bash
/opencode domain-modeling validate --input ./domain-models --rules ddd-principles --fix
```

### `generate`
Generate code or documentation from domain models.

**Options:**
- `--input <path>`: Input model file
- `--target <type>`: Target type (code, docs, tests, api)
- `--language <lang>`: Programming language (typescript, java, csharp, python)
- `--framework <fw>`: Framework (nestjs, spring, aspnet, fastapi)

**Example:**
```bash
/opencode domain-modeling generate --input ./order-model.yaml --target code --language typescript --framework nestjs
```

## Templates

### Aggregate Template
```yaml
aggregate:
  name: "Order"
  bounded_context: "Order Management"
  type: "Aggregate Root"
  
  description: "Represents a customer order in the system"
  
  identity:
    type: "UUID"
    field: "id"
  
  attributes:
    - name: "customer_id"
      type: "UUID"
      required: true
      description: "Identifier of the customer who placed the order"
    
    - name: "status"
      type: "OrderStatus"
      required: true
      default: "PENDING"
      description: "Current status of the order"
    
    - name: "total_amount"
      type: "Decimal"
      required: true
      description: "Total amount including tax and shipping"
    
    - name: "placed_at"
      type: "Timestamp"
      required: true
      description: "When the order was placed"
  
  invariants:
    - rule: "Order must have at least one item"
      description: "An order cannot be empty"
      validation: "items.length > 0"
    
    - rule: "Order total must match sum of item totals"
      description: "Prevent calculation errors"
      validation: "total_amount == sum(items.price * items.quantity)"
    
    - rule: "Order status transitions must be valid"
      description: "Ensure proper state machine"
      validation: "status in valid_transitions[current_status]"
  
  commands:
    - name: "PlaceOrder"
      description: "Place a new order"
      input:
        customer_id: "UUID"
        items: "Array[OrderItem]"
        shipping_address: "Address"
      preconditions:
        - "Customer must exist and be active"
        - "All items must be in stock"
        - "Shipping address must be valid"
      events:
        - "OrderPlaced"
    
    - name: "CancelOrder"
      description: "Cancel an existing order"
      input:
        reason: "string"
        reason_code: "CancellationReason"
      preconditions:
        - "Order must be in cancellable state"
        - "User must have permission to cancel"
      events:
        - "OrderCancelled"
  
  events:
    - name: "OrderPlaced"
      description: "Order has been successfully placed"
      data:
        order_id: "UUID"
        customer_id: "UUID"
        items: "Array[OrderItem]"
        total_amount: "Decimal"
        placed_at: "Timestamp"
    
    - name: "OrderCancelled"
      description: "Order has been cancelled"
      data:
        order_id: "UUID"
        reason: "string"
        reason_code: "CancellationReason"
        cancelled_at: "Timestamp"
  
  child_entities:
    - name: "OrderItem"
      type: "Entity"
      description: "Individual items within an order"
  
  value_objects:
    - name: "Address"
      type: "Value Object"
      description: "Shipping or billing address"
  
  consistency_rules:
    - type: "transactional"
      description: "All order operations are atomic"
      scope: "aggregate"
    
    - type: "eventual"
      description: "Inventory updates are eventually consistent"
      scope: "cross_context"
```

### Entity Template
```yaml
entity:
  name: "OrderItem"
  bounded_context: "Order Management"
  type: "Entity"
  
  description: "Represents an individual item within an order"
  
  identity:
    type: "Composite"
    fields: ["order_id", "product_id"]
  
  attributes:
    - name: "product_id"
      type: "UUID"
      required: true
      description: "Identifier of the product"
    
    - name: "quantity"
      type: "Integer"
      required: true
      min: 1
      description: "Quantity of the product"
    
    - name: "unit_price"
      type: "Decimal"
      required: true
      description: "Price per unit at time of order"
    
    - name: "total_price"
      type: "Decimal"
      required: true
      description: "Total price for this item (quantity * unit_price)"
  
  invariants:
    - rule: "Quantity must be positive"
      validation: "quantity > 0"
    
    - rule: "Total price must match calculation"
      validation: "total_price == quantity * unit_price"
  
  methods:
    - name: "updateQuantity"
      description: "Update the quantity of this item"
      input:
        new_quantity: "Integer"
      preconditions:
        - "new_quantity must be positive"
        - "Order must be in modifiable state"
      side_effects:
        - "Recalculate total_price"
        - "Update order total amount"
```

### Value Object Template
```yaml
value_object:
  name: "Address"
  bounded_context: "Shared"
  type: "Value Object"
  
  description: "Represents a physical address"
  
  attributes:
    - name: "street"
      type: "string"
      required: true
      description: "Street address"
    
    - name: "city"
      type: "string"
      required: true
      description: "City name"
    
    - name: "state"
      type: "string"
      required: true
      description: "State or province"
    
    - name: "postal_code"
      type: "string"
      required: true
      description: "Postal or ZIP code"
    
    - name: "country"
      type: "string"
      required: true
      default: "US"
      description: "Country code"
  
  invariants:
    - rule: "Postal code must be valid for country"
      validation: "validate_postal_code(postal_code, country)"
    
    - rule: "State must be valid for country"
      validation: "validate_state(state, country)"
  
  methods:
    - name: "is_valid"
      description: "Check if address is valid"
      return: "boolean"
    
    - name: "format_for_display"
      description: "Format address for display"
      return: "string"
```

### Domain Event Template
```yaml
domain_event:
  name: "OrderPlaced"
  bounded_context: "Order Management"
  type: "Domain Event"
  
  description: "Event fired when a customer successfully places an order"
  
  identity:
    type: "UUID"
    field: "event_id"
  
  metadata:
    - name: "occurred_at"
      type: "Timestamp"
      required: true
      description: "When the event occurred"
    
    - name: "aggregate_id"
      type: "UUID"
      required: true
      description: "ID of the aggregate that generated the event"
    
    - name: "aggregate_type"
      type: "string"
      required: true
      default: "Order"
      description: "Type of the aggregate"
    
    - name: "version"
      type: "Integer"
      required: true
      description: "Event version for schema evolution"
  
  data:
    - name: "order_id"
      type: "UUID"
      required: true
      description: "ID of the placed order"
    
    - name: "customer_id"
      type: "UUID"
      required: true
      description: "ID of the customer who placed the order"
    
    - name: "items"
      type: "Array[OrderItemData]"
      required: true
      description: "Items in the order"
    
    - name: "total_amount"
      type: "Decimal"
      required: true
      description: "Total order amount"
    
    - name: "shipping_address"
      type: "Address"
      required: true
      description: "Shipping address for the order"
  
  consumers:
    - name: "Inventory Service"
      purpose: "Reserve inventory for ordered items"
      type: "internal"
    
    - name: "Payment Service"
      purpose: "Initiate payment processing"
      type: "internal"
    
    - name: "Notification Service"
      purpose: "Send order confirmation to customer"
      type: "internal"
    
    - name: "Analytics Service"
      purpose: "Track order metrics"
      type: "internal"
  
  versioning:
    current_version: 1
    compatibility: "backward"
    migration_strategy: "additive_only"
```

## Analysis Rules

### Basic DDD Compliance
- Aggregates have clear identity and boundaries
- Entities have unique identity
- Value objects are immutable
- Events are in past tense
- Commands are imperative

### Standard DDD Principles
- Aggregates enforce invariants
- Bounded contexts have clear responsibilities
- Ubiquitous language is used consistently
- Domain logic is encapsulated in domain objects
- Infrastructure concerns are separated

### Comprehensive Analysis
- Event sourcing patterns applied correctly
- CQRS separation implemented
- Saga patterns for long transactions
- Anti-corruption layers for integration
- Context mapping relationships defined

## Refactoring Patterns

### Split Aggregate
Identifies aggregates that are too large and suggests splitting strategies.

**Indicators:**
- Aggregate has too many responsibilities
- Performance issues due to large aggregate size
- Different parts have different consistency requirements
- Multiple user roles modify different parts

**Strategy:**
- Identify natural boundaries
- Define new aggregates
- Establish relationships between aggregates
- Update commands and events

### Extract Value Object
Finds repeated attribute groups that should be value objects.

**Indicators:**
- Same group of attributes appears in multiple entities
- Attributes have no independent identity
- Group of attributes has business meaning
- Immutability is desired

**Strategy:**
- Define value object with invariants
- Replace attributes in entities
- Update validation logic
- Ensure immutability

### Define Bounded Context
Identifies areas where bounded contexts should be created.

**Indicators:**
- Different subdomains with different models
- Different teams working on different areas
- Different deployment or scaling requirements
- Different integration needs

**Strategy:**
- Map context boundaries
- Define context relationships
- Plan integration mechanisms
- Assign team responsibilities

## Code Generation

### Target Languages

#### TypeScript/Node.js
- Class-based domain models
- Type safety for events and commands
- Decorator-based validation
- Event sourcing infrastructure

#### Java/Spring
- JPA entities for aggregates
- Spring Data repositories
- Event-driven architecture with Spring Events
- Validation with Bean Validation

#### C#/.NET
- Entity Framework Core entities
- MediatR for command handling
- Domain events with MediatR notifications
- Fluent validation

#### Python/FastAPI
- Pydantic models for validation
- SQLAlchemy for persistence
- Pydantic events for domain events
- Type hints throughout

### Generated Artifacts

#### Domain Models
- Aggregate classes with invariants
- Entity classes with identity
- Value object classes (immutable)
- Domain event classes

#### Application Layer
- Command handlers
- Event handlers
- Application services
- DTOs for external communication

#### Infrastructure Layer
- Repository implementations
- Event store implementations
- Database mappings
- External service integrations

#### Tests
- Unit tests for domain logic
- Integration tests for repositories
- Event handling tests
- Command validation tests

## Best Practices

### Modeling Guidelines
1. Focus on business behavior, not data structure
2. Use ubiquitous language consistently
3. Keep aggregates small and focused
4. Enforce invariants within aggregates
5. Use events for state changes

### Validation Rules
1. Validate at domain boundaries
2. Use specification pattern for complex rules
3. Separate validation from business logic
4. Provide clear error messages
5. Consider performance implications

### Event Design
1. Use past tense for events
2. Include all necessary data
3. Design for schema evolution
4. Consider event ordering
5. Plan for event replay

### Integration Patterns
1. Use anti-corruption layers
2. Design for failure
3. Consider consistency requirements
4. Plan for versioning
5. Monitor integration health