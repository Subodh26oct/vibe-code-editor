interface TemplateItem {
  filename: string;
  fileExtension: string;
  content: string;
  folderName?: string;
  items?: TemplateItem[];
}

interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;

function getItemKey(item: TemplateItem): string {
  // It's a folder
  if (item.folderName && item.items) {
    return item.folderName;
  }
  // It's a file with an extension
  if (item.fileExtension) {
    return `${item.filename}.${item.fileExtension}`;
  }
  // It's a file without an extension (Dockerfile, Makefile, .gitignore, etc.)
  return item.filename;
}

export function transformToWebContainerFormat(template: { folderName: string; items: TemplateItem[] }): WebContainerFileSystem {
  function processItem(item: TemplateItem): WebContainerFile | WebContainerDirectory {
    if (item.folderName && item.items) {
      // This is a directory
      const directoryContents: WebContainerFileSystem = {};
      
      item.items.forEach(subItem => {
        const key = getItemKey(subItem);
        if (key) {
          directoryContents[key] = processItem(subItem);
        }
      });

      return {
        directory: directoryContents
      };
    } else {
      // This is a file
      return {
        file: {
          contents: item.content || ""
        }
      };
    }
  }

  const result: WebContainerFileSystem = {};
  
  template.items.forEach(item => {
    const key = getItemKey(item);
    if (key) {
      result[key] = processItem(item);
    }
  });

  return result;
}