# DDD Workshop Tools

This directory contains utility tools and integrations for the DDD workshop project.

## Available Tools

### EventStorming Tools
- **Session Manager**: Manages EventStorming session lifecycle
- **Visualizer**: Creates visual representations of domain models
- **Exporter**: Exports session data to various formats

### Domain Modeling Tools
- **Model Validator**: Validates domain models against DDD principles
- **Code Generator**: Generates code from domain models
- **Refactoring Assistant**: Suggests improvements to domain models

### Integration Tools
- **Context Mapper**: Maps bounded context relationships
- **Integration Tester**: Tests integration between contexts
- **Contract Generator**: Generates integration contracts

### Documentation Tools
- **Doc Generator**: Generates documentation from models
- **Diagram Creator**: Creates UML and architecture diagrams
- **Report Builder**: Creates analysis reports

## Tool Structure

```
tool/
├── eventstorming/          # EventStorming specific tools
│   ├── session-manager/
│   ├── visualizer/
│   └── exporter/
├── domain-modeling/        # Domain modeling tools
│   ├── validator/
│   ├── generator/
│   └── refactoring/
├── integration/           # Integration tools
│   ├── context-mapper/
│   ├── tester/
│   └── contracts/
├── documentation/        # Documentation tools
│   ├── generator/
│   ├── diagrams/
│   └── reports/
└── shared/               # Shared utilities
    ├── utils/
    ├── templates/
    └── validators/
```

## Usage

Tools are designed to be used independently or as part of larger workflows. Each tool includes:

- Configuration files
- Usage documentation
- Example inputs/outputs
- Test cases

## Development

When adding new tools:

1. Follow the established directory structure
2. Include comprehensive documentation
3. Add configuration examples
4. Provide test cases
5. Update this README

## Dependencies

Tools may depend on:
- Node.js runtime
- Python for data processing
- Docker for containerized tools
- External APIs for integrations

Check individual tool documentation for specific requirements.