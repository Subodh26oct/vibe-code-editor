import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// ─── Folder Icons ────────────────────────────────────────────────────────────

export const FolderIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
  >
    <path
      d="M2 6C2 4.89543 2.89543 4 4 4H9.17157C9.70201 4 10.2107 4.21071 10.5858 4.58579L11.4142 5.41421C11.7893 5.78929 12.298 6 12.8284 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
      fill="#dcb67a"
      stroke="#c9a84c"
      strokeWidth="0.5"
    />
    <path
      d="M2 8H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V8Z"
      fill="#e8c97a"
    />
  </svg>
);

export const FolderOpenIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
  >
    <path
      d="M2 6C2 4.89543 2.89543 4 4 4H9.17157C9.70201 4 10.2107 4.21071 10.5858 4.58579L11.4142 5.41421C11.7893 5.78929 12.298 6 12.8284 6H20C21.1046 6 22 6.89543 22 8V9H2V6Z"
      fill="#dcb67a"
      stroke="#c9a84c"
      strokeWidth="0.5"
    />
    <path
      d="M1 10C1 9.44772 1.44772 9 2 9H22C22.5523 9 23 9.44772 23 10V18C23 19.1046 22.1046 20 21 20H3C1.89543 20 1 19.1046 1 18V10Z"
      fill="#f0d590"
      stroke="#dcb67a"
      strokeWidth="0.5"
    />
  </svg>
);

export const FolderSrcIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17L11.41 5.41C11.79 5.79 12.3 6 12.83 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#42a5f5" />
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="#64b5f6" />
  </svg>
);

export const FolderNodeIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17L11.41 5.41C11.79 5.79 12.3 6 12.83 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#66bb6a" />
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="#81c784" />
  </svg>
);

export const FolderPublicIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17L11.41 5.41C11.79 5.79 12.3 6 12.83 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#ab47bc" />
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="#ba68c8" />
  </svg>
);

export const FolderComponentsIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17L11.41 5.41C11.79 5.79 12.3 6 12.83 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#ef5350" />
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="#e57373" />
  </svg>
);

export const FolderApiIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17L11.41 5.41C11.79 5.79 12.3 6 12.83 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#ff7043" />
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="#ff8a65" />
  </svg>
);

export const FolderHooksIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none">
    <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17L11.41 5.41C11.79 5.79 12.3 6 12.83 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill="#26c6da" />
    <path d="M2 8H22V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill="#4dd0e1" />
  </svg>
);

// ─── File Icons ──────────────────────────────────────────────────────────────

export const TypeScriptIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178c6" />
    <path d="M14.5 17.5V15.5H11.5V10H14V8H6.5V10H9V15.5H6.5V17.5H14.5Z" fill="white" opacity="0" />
    <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="monospace">TS</text>
  </svg>
);

export const JavaScriptIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#f0db4f" />
    <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#323330" fontFamily="monospace">JS</text>
  </svg>
);

export const ReactIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <circle cx="12" cy="12" r="2.2" fill="#61dafb" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61dafb" strokeWidth="1" fill="none" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61dafb" strokeWidth="1" fill="none" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61dafb" strokeWidth="1" fill="none" transform="rotate(120 12 12)" />
  </svg>
);

export const JsonIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#292929" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#f5de19" fontFamily="monospace">{"{}"}</text>
  </svg>
);

export const CssIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#663399" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="monospace">#</text>
  </svg>
);

export const HtmlIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#e44d26" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="monospace">{"<>"}</text>
  </svg>
);

export const MarkdownIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#083fa1" stroke="#4083f7" strokeWidth="0.5" />
    <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="sans-serif">M↓</text>
  </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#26a69a" />
    <circle cx="9" cy="9" r="2" fill="white" opacity="0.7" />
    <path d="M3 17L8 12L11 15L15 10L21 17H3Z" fill="white" opacity="0.8" />
  </svg>
);

export const SvgIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#ffb300" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="monospace">SVG</text>
  </svg>
);

export const GitIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="10" fill="#f05032" />
    <path d="M12 7V12M12 12L15 15M12 12L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EnvIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#ecd53f" />
    <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#333" fontFamily="monospace">env</text>
  </svg>
);

export const ConfigIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#546e7a" />
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" fill="none" />
    <path d="M12 6V8M12 16V18M6 12H8M16 12H18M7.76 7.76L9.17 9.17M14.83 14.83L16.24 16.24M7.76 16.24L9.17 14.83M14.83 9.17L16.24 7.76" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#78909c" />
    <rect x="7" y="11" width="10" height="8" rx="1" fill="white" opacity="0.8" />
    <path d="M9 11V8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8V11" stroke="white" strokeWidth="1.5" fill="none" opacity="0.8" />
  </svg>
);

export const PythonIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#3572A5" />
    <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="monospace">Py</text>
  </svg>
);

export const ShellIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#4eaa25" />
    <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="monospace">$_</text>
  </svg>
);

export const YamlIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#cb171e" />
    <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="monospace">yml</text>
  </svg>
);

export const VueIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M2 3L12 21L22 3H17.5L12 13L6.5 3H2Z" fill="#41b883" />
    <path d="M6.5 3L12 13L17.5 3H14L12 7L10 3H6.5Z" fill="#35495e" />
  </svg>
);

export const DefaultFileIcon: React.FC<IconProps> = ({ className, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#78909c" />
    <path d="M14 2V8H20" fill="#a5bcc5" />
    <path d="M14 2L20 8H14V2Z" fill="#b0bec5" />
  </svg>
);

// ─── Icon Resolver ───────────────────────────────────────────────────────────

const FOLDER_ICON_MAP: Record<string, React.FC<IconProps>> = {
  src: FolderSrcIcon,
  source: FolderSrcIcon,
  lib: FolderSrcIcon,
  app: FolderSrcIcon,
  node_modules: FolderNodeIcon,
  public: FolderPublicIcon,
  static: FolderPublicIcon,
  assets: FolderPublicIcon,
  components: FolderComponentsIcon,
  ui: FolderComponentsIcon,
  api: FolderApiIcon,
  routes: FolderApiIcon,
  hooks: FolderHooksIcon,
  utils: FolderHooksIcon,
  helpers: FolderHooksIcon,
  modules: FolderComponentsIcon,
  pages: FolderSrcIcon,
  styles: FolderPublicIcon,
  config: FolderApiIcon,
  prisma: FolderNodeIcon,
  actions: FolderHooksIcon,
};

export function getFolderIcon(folderName: string, isOpen: boolean): React.ReactNode {
  const lowerName = folderName.toLowerCase();
  const SpecialIcon = FOLDER_ICON_MAP[lowerName];

  if (SpecialIcon) {
    return <SpecialIcon className="h-4 w-4 mr-2 shrink-0" />;
  }

  return isOpen ? (
    <FolderOpenIcon className="h-4 w-4 mr-2 shrink-0" />
  ) : (
    <FolderIcon className="h-4 w-4 mr-2 shrink-0" />
  );
}

export function getFileIcon(extension: string, filename: string = ""): React.ReactNode {
  const ext = extension.toLowerCase();
  const name = filename.toLowerCase();
  const cls = "h-4 w-4 mr-2 shrink-0";

  // Special filenames
  if (name === ".gitignore" || name === ".gitattributes") return <GitIcon className={cls} />;
  if (name.startsWith(".env")) return <EnvIcon className={cls} />;
  if (name.includes("config") || name.includes("rc")) return <ConfigIcon className={cls} />;

  switch (ext) {
    case "ts":
      return <TypeScriptIcon className={cls} />;
    case "tsx":
    case "jsx":
      return <ReactIcon className={cls} />;
    case "js":
    case "mjs":
    case "cjs":
      return <JavaScriptIcon className={cls} />;
    case "json":
      return <JsonIcon className={cls} />;
    case "css":
    case "scss":
    case "less":
    case "sass":
      return <CssIcon className={cls} />;
    case "html":
    case "htm":
      return <HtmlIcon className={cls} />;
    case "md":
    case "mdx":
      return <MarkdownIcon className={cls} />;
    case "svg":
      return <SvgIcon className={cls} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "ico":
    case "avif":
      return <ImageIcon className={cls} />;
    case "yml":
    case "yaml":
      return <YamlIcon className={cls} />;
    case "vue":
      return <VueIcon className={cls} />;
    case "py":
      return <PythonIcon className={cls} />;
    case "sh":
    case "bash":
    case "zsh":
      return <ShellIcon className={cls} />;
    case "lock":
      return <LockIcon className={cls} />;
    default:
      return <DefaultFileIcon className={cls} />;
  }
}
