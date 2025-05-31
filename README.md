# Dynamate Design-to-Code

A tool for converting Figma designs to production-ready code with Cursor integration.

## Features

- Figma design import and component recognition
- Code generation with semantic HTML and modern best practices
- Cursor integration for AI-powered code generation
- Project-specific rulesets for consistent code style
- Support for React, Vue, and Angular
- Integration with popular styling solutions (Tailwind, CSS Modules, Styled Components)

## Installation

```bash
npm install -g dynamate-design-to-code
```

## Usage

### Basic Usage

```bash
# Initialize a new project
dynamate-design-to-code init

# Generate code from a Figma file
dynamate-design-to-code generate --figma-file <file-id>
```

### Working with Rulesets

Rulesets help maintain consistency in your codebase by defining project-specific rules and conventions.

#### Creating a Ruleset

```bash
dynamate-design-to-code ruleset create
```

This will prompt you for:
- Project name
- Framework choice (React, Vue, Angular)
- Styling solution (Tailwind, CSS Modules, Styled Components)
- Component structure (Atomic, Feature-based, Flat)
- Conventions to enforce:
  - Naming conventions (components, props, styles)
  - Structure conventions (imports, exports, types)
  - Documentation requirements (JSDoc, README, examples)

#### Example Ruleset Configuration

```json
{
  "projectName": "my-app",
  "framework": "react",
  "styling": "tailwind",
  "componentStructure": "atomic",
  "conventions": {
    "naming": {
      "components": true,
      "props": true,
      "styles": true
    },
    "structure": {
      "imports": true,
      "exports": true,
      "types": true
    },
    "documentation": {
      "jsdoc": true,
      "readme": true,
      "examples": true
    }
  }
}
```

#### Applying a Ruleset

```bash
# Apply a ruleset to your project
dynamate-design-to-code ruleset apply <ruleset-name>

# Remove a ruleset
dynamate-design-to-code ruleset remove <ruleset-name>
```

#### Generated Files

The ruleset generator creates:
- `.cursor/rules/<ruleset-name>/config.json`: Ruleset configuration
- `.cursor/rules/<ruleset-name>/examples/`: Example components following the ruleset
- `.cursor/config.json`: Updated Cursor configuration with ruleset reference

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/dynamate-design-to-code.git
cd dynamate-design-to-code

# Install dependencies
npm install

# Build the project
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- ruleset.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Cursor IDE team
- Figma MCP plugin developers
- OpenAI team
- Dynamate development team 