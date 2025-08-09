
/**
 * Code Style Guide and Naming Convention Enforcer
 * Ensures consistent code style across the entire project
 */

export interface StyleGuideConfig {
  naming: {
    components: 'PascalCase';
    functions: 'camelCase';
    variables: 'camelCase';
    constants: 'UPPER_SNAKE_CASE';
    files: 'PascalCase' | 'camelCase' | 'kebab-case';
  };
  imports: {
    grouping: boolean;
    sorting: boolean;
  };
  typescript: {
    strictMode: boolean;
    explicitReturnTypes: boolean;
  };
}

export const defaultStyleConfig: StyleGuideConfig = {
  naming: {
    components: 'PascalCase',
    functions: 'camelCase',
    variables: 'camelCase',
    constants: 'UPPER_SNAKE_CASE',
    files: 'PascalCase'
  },
  imports: {
    grouping: true,
    sorting: true
  },
  typescript: {
    strictMode: true,
    explicitReturnTypes: true
  }
};

export class CodeStyleEnforcer {
  private config: StyleGuideConfig;

  constructor(config: StyleGuideConfig = defaultStyleConfig) {
    this.config = config;
  }

  /**
   * Validates component naming convention
   */
  validateComponentName(name: string): boolean {
    if (this.config.naming.components === 'PascalCase') {
      return /^[A-Z][a-zA-Z0-9]*$/.test(name);
    }
    return true;
  }

  /**
   * Validates function naming convention
   */
  validateFunctionName(name: string): boolean {
    if (this.config.naming.functions === 'camelCase') {
      return /^[a-z][a-zA-Z0-9]*$/.test(name);
    }
    return true;
  }

  /**
   * Validates variable naming convention
   */
  validateVariableName(name: string): boolean {
    if (this.config.naming.variables === 'camelCase') {
      return /^[a-z][a-zA-Z0-9]*$/.test(name);
    }
    return true;
  }

  /**
   * Validates constant naming convention
   */
  validateConstantName(name: string): boolean {
    if (this.config.naming.constants === 'UPPER_SNAKE_CASE') {
      return /^[A-Z][A-Z0-9_]*$/.test(name);
    }
    return true;
  }

  /**
   * Converts string to PascalCase
   */
  toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  }

  /**
   * Converts string to camelCase
   */
  toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[-_]/g, '');
  }

  /**
   * Converts string to UPPER_SNAKE_CASE
   */
  toUpperSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '')
      .replace(/\s+/g, '_')
      .replace(/-/g, '_')
      .toUpperCase();
  }

  /**
   * Converts string to kebab-case
   */
  toKebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .replace(/^-/, '')
      .replace(/\s+/g, '-')
      .replace(/_/g, '-')
      .toLowerCase();
  }

  /**
   * Standardizes import statements
   */
  standardizeImports(imports: string[]): string[] {
    if (!this.config.imports.sorting) return imports;

    return imports.sort((a, b) => {
      // React imports first
      if (a.includes('react') && !b.includes('react')) return -1;
      if (!a.includes('react') && b.includes('react')) return 1;
      
      // Third-party libraries
      if (a.includes('@/') && !b.includes('@/')) return 1;
      if (!a.includes('@/') && b.includes('@/')) return -1;
      
      // Alphabetical within groups
      return a.localeCompare(b);
    });
  }

  /**
   * Validates TypeScript code quality
   */
  validateTypeScript(code: string): string[] {
    const issues: string[] = [];
    
    // Check for explicit return types
    if (this.config.typescript.explicitReturnTypes) {
      const functionRegex = /function\s+\w+\s*\([^)]*\)\s*\{/g;
      const arrowFunctionRegex = /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/g;
      
      if (functionRegex.test(code) || arrowFunctionRegex.test(code)) {
        issues.push('Functions should have explicit return types');
      }
    }

    // Check for any types
    if (code.includes(': any')) {
      issues.push('Avoid using "any" type, use specific types instead');
    }

    return issues;
  }

  /**
   * Generates style report for a file
   */
  generateStyleReport(filePath: string, content: string): {
    fileName: string;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check file naming
    const fileName = filePath.split('/').pop() || '';
    if (!this.validateComponentName(fileName.replace('.tsx', '').replace('.ts', ''))) {
      issues.push(`File name "${fileName}" should follow PascalCase convention`);
      suggestions.push(`Rename to "${this.toPascalCase(fileName)}"`);
    }

    // Check TypeScript issues
    const tsIssues = this.validateTypeScript(content);
    issues.push(...tsIssues);

    return {
      fileName,
      issues,
      suggestions
    };
  }
}

export const codeStyleEnforcer = new CodeStyleEnforcer();
