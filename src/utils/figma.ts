interface FigmaUrlParts {
  fileId: string;
  nodeId: string;
}

/**
 * Parse a Figma URL or section link to extract fileId and nodeId
 * Supports both full URLs and section links
 */
export function parseFigmaUrl(url: string): FigmaUrlParts {
  try {
    // Handle full Figma URLs
    if (url.includes('figma.com')) {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const fileId = pathParts[pathParts.indexOf('file') + 1];
      const nodeId = urlObj.searchParams.get('node-id') || '';
      
      return { fileId, nodeId };
    }
    
    // Handle section links (format: fileId?node-id=nodeId)
    const [fileId, params] = url.split('?');
    const nodeId = new URLSearchParams(params).get('node-id') || '';
    
    if (!fileId || !nodeId) {
      throw new Error('Invalid Figma link format');
    }
    
    return { fileId, nodeId };
  } catch (error) {
    throw new Error('Failed to parse Figma URL. Please ensure you\'re using a valid Figma link.');
  }
} 