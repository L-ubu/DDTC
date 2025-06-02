import path from 'path';
import fs from 'fs/promises';

/**
 * Converts a string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Ensures a directory exists, creating it if necessary
 */
export async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Validates a component name
 */
export function isValidComponentName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

/**
 * Extracts dependencies from code
 */
export function extractDependencies(code: string): string[] {
  const importRegex = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;
  const matches = code.match(importRegex) || [];
  
  return matches
    .map(match => {
      const packageMatch = match.match(/from\s+['"]([^'"]+)['"]/);
      return packageMatch ? packageMatch[1] : '';
    })
    .filter(Boolean);
}

/**
 * Formats a file path according to the operating system
 */
export function formatPath(...parts: string[]): string {
  return path.join(...parts).replace(/\\/g, '/');
}

/**
 * Validates a Figma file ID
 */
export function isValidFigmaFileId(fileId: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(fileId);
}

/**
 * Creates a backup of an existing file
 */
export async function createBackup(filePath: string): Promise<void> {
  try {
    const exists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      const backupPath = `${filePath}.backup`;
      await fs.copyFile(filePath, backupPath);
    }
  } catch (error) {
    console.error('Error creating backup:', error);
  }
}

/**
 * Sanitizes a filename
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export * from './figma';
export * from './files';
export * from './ruleset-generator'; 