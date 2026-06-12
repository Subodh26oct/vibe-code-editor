"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { registerCompletion, type CompletionRegistration } from "monacopilot";
import { TemplateFile } from "../lib/path-to-json";
import {
  configureMonaco,
  defaultEditorOptions,
  getEditorLanguage,
} from "../lib/editor-config";

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined;
  content: string;
  onContentChange: (value: string) => void;
  isEnabled: boolean;
  theme: string;
  onLoadingChange?: (loading: boolean) => void;
}

export const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
  isEnabled,
  theme,
  onLoadingChange,
}: PlaygroundEditorProps) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const completionRef = useRef<CompletionRegistration | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleLoadingState = useCallback((loading: boolean) => {
    setLocalLoading(loading);
    onLoadingChange?.(loading);
  }, [onLoadingChange]);

  const setupMonacopilot = useCallback(() => {
    if (!editorRef.current || !monacoRef.current) return;

    if (completionRef.current) {
      completionRef.current.deregister();
      completionRef.current = null;
    }

    if (isEnabled && activeFile) {
      const language = getEditorLanguage(activeFile.fileExtension || "");
      const filename = `${activeFile.filename}.${activeFile.fileExtension}`;

      console.log(`Registering Monacopilot for file: ${filename}, language: ${language}`);

      completionRef.current = registerCompletion(monacoRef.current, editorRef.current, {
        endpoint: "/api/code-completion",
        language,
        filename,
        trigger: "onIdle",
        onCompletionRequested: () => {
          handleLoadingState(true);
        },
        onCompletionRequestFinished: () => {
          handleLoadingState(false);
        },
        onError: (err) => {
          console.warn("Monacopilot completion error:", err);
          handleLoadingState(false);
        }
      });
    }
  }, [isEnabled, activeFile, handleLoadingState]);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define all custom themes
    configureMonaco(monaco);

    // Apply the active theme
    if (theme) {
      monaco.editor.setTheme(theme);
    }

    // Set compiler and diagnostic settings
    editor.updateOptions({
      ...defaultEditorOptions,
      inlineSuggest: {
        enabled: true,
        mode: "prefix",
      },
    });

    // Initialize Monacopilot auto-completions
    setupMonacopilot();
  };

  // Setup/tear down Monacopilot on state changes
  useEffect(() => {
    setupMonacopilot();
    return () => {
      if (completionRef.current) {
        completionRef.current.deregister();
        completionRef.current = null;
      }
    };
  }, [setupMonacopilot]);

  // Sync theme changes
  useEffect(() => {
    if (monacoRef.current && theme) {
      monacoRef.current.editor.setTheme(theme);
    }
  }, [theme]);

  return (
    <div className="h-full relative">
      {/* Loading indicator */}
      {localLoading && (
        <div className="absolute top-2 right-2 z-10 bg-zinc-900/80 dark:bg-zinc-800/80 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 flex items-center gap-1 shadow-md">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          AI thinking...
        </div>
      )}

      <Editor
        height="100%"
        value={content}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={
          activeFile
            ? getEditorLanguage(activeFile.fileExtension || "")
            : "plaintext"
        }
        theme={theme}
        // @ts-ignore
        options={defaultEditorOptions}
      />
    </div>
  );
};
