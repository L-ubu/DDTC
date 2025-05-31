import { FigmaService, FigmaConfig, ComponentNode } from '../core/figma';

describe('FigmaService', () => {
  let figmaService: FigmaService;
  const mockConfig: FigmaConfig = {
    accessToken: 'mock-token',
    fileId: 'mock-file-id'
  };

  beforeEach(() => {
    figmaService = new FigmaService(mockConfig);
  });

  describe('getFileComponents', () => {
    it('should fetch and parse components from a Figma file', async () => {
      // Mock the Figma API response
      const mockResponse = {
        document: {
          id: 'root',
          name: 'Document',
          type: 'DOCUMENT',
          children: [
            {
              id: 'component-1',
              name: 'Button',
              type: 'COMPONENT',
              children: []
            },
            {
              id: 'component-2',
              name: 'Card',
              type: 'COMPONENT_SET',
              children: []
            }
          ]
        }
      };

      // Mock the client.file method
      jest.spyOn(figmaService['client'], 'file').mockResolvedValue(mockResponse as any);

      const components = await figmaService.getFileComponents('test-file-id');

      expect(components).toHaveLength(2);
      expect(components[0]).toEqual({
        id: 'component-1',
        name: 'Button',
        type: 'COMPONENT'
      });
      expect(components[1]).toEqual({
        id: 'component-2',
        name: 'Card',
        type: 'COMPONENT_SET'
      });
    });

    it('should handle errors when fetching components', async () => {
      // Mock an error response
      jest.spyOn(figmaService['client'], 'file').mockRejectedValue(new Error('API Error'));

      await expect(figmaService.getFileComponents('test-file-id')).rejects.toThrow('Failed to fetch Figma components');
    });
  });

  describe('getComponentStyles', () => {
    it('should fetch styles for a component', async () => {
      const mockStyles = {
        nodes: {
          'component-1': {
            styles: {
              fill: '#000000',
              stroke: '#ffffff'
            }
          }
        }
      };

      // Mock the client.fileNodes method
      jest.spyOn(figmaService['client'], 'fileNodes').mockResolvedValue(mockStyles as any);

      const styles = await figmaService.getComponentStyles('component-1');

      expect(styles).toEqual(mockStyles);
    });

    it('should handle errors when fetching styles', async () => {
      // Mock an error response
      jest.spyOn(figmaService['client'], 'fileNodes').mockRejectedValue(new Error('API Error'));

      await expect(figmaService.getComponentStyles('component-1')).rejects.toThrow('Failed to fetch component styles');
    });
  });
}); 