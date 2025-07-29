# @tubenote/config-typescript

This package provides centralized and reusable TypeScript configurations for all applications and packages within the TubeNote monorepo.

## 1. Purpose

The goal of this package is to ensure consistency and maintainability across the entire codebase. By using a shared configuration, we can enforce the same compiler options and best practices everywhere, making it easier to manage and update our TypeScript setup.

## 2. Available Configurations

This package offers the following TypeScript configurations:

### `base.json`

This is the foundational configuration that all other configs extend. It includes strict, modern settings suitable for most Node.js applications and libraries.

**Key Features:**

- **Strict Mode**: Enforces strong type-checking rules (`"strict": true`).
- **Modern JavaScript**: Targets `ESNext` for modern syntax and features.
- **Module System**: Uses `Bundler` module resolution, which is the recommended setting for modern Node.js projects.
- **Interoperability**: Ensures compatibility between CommonJS and ES modules (`"esModuleInterop": true`).

### `nextjs.json`

This configuration is specifically tailored for our **Next.js** frontend application. It extends `base.json` and adds settings required by the Next.js framework.

**Key Features:**

- **JSX Support**: Configured for React's JSX syntax (`"jsx": "preserve"`).
- **DOM Typings**: Includes DOM library typings for browser environments (`"lib": ["dom", "dom.iterable", "esnext"]`).
- **Next.js Plugin**: Integrates with the Next.js TypeScript plugin for enhanced type-checking and IDE support.

## 3. Usage

To use one of these configurations in another project within the monorepo, extend it in the project's `tsconfig.json` file.

### For a Node.js Backend or Library:

```json
// tsconfig.json
{
  "extends": "@tubenote/config-typescript/base.json",
  "compilerOptions": {
    // Add project-specific overrides here
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### For the Next.js Frontend:

```json
// tsconfig.json
{
  "extends": "@tubenote/config-typescript/nextjs.json",
  "compilerOptions": {
    // Add project-specific overrides here
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 4. Contributing

When making changes to these shared configurations, be mindful of their impact on all projects that consume them. Always test your changes across the entire monorepo to ensure they don't introduce any breaking changes.
