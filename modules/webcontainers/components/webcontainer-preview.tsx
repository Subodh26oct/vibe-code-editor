"use client";
import React, { useEffect, useState, useRef } from "react";

import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";
import TerminalComponent from "./terminal";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean; // Optional prop to force re-setup
  playgroundId?: string;  // Used to fetch the template's package-lock.json for faster npm ci
}
// Module-level cache to persist across component remounts (React Fast Refresh/navigation)
let globalServerUrl: string | null = null;
let globalStartProcess: any = null;

const WebContainerPreview = ({
  templateData,
  error,
  instance,
  isLoading,
  serverUrl,
  writeFileSync,
  forceResetup = false,
  playgroundId,
}: WebContainerPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);

  const terminalRef = useRef<any>(null);

  // Reset setup state when forceResetup changes
  useEffect(() => {
    if (forceResetup) {
      if (globalStartProcess) {
        try {
          globalStartProcess.kill();
        } catch (e) {}
        globalStartProcess = null;
      }
      globalServerUrl = null;

      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setPreviewUrl("");
      setCurrentStep(0);
      setLoadingState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
      });
    }
  }, [forceResetup]);

  useEffect(() => {
    async function setupContainer() {
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true);
        setSetupError(null);

        // Check if package.json exists to determine if files are already mounted
        let packageJsonExists = false;
        try {
          const content = await instance.fs.readFile("package.json", "utf8");
          packageJsonExists = !!content;
        } catch (error) {}

        // If files are already mounted and we have a cached server URL, reconnect immediately
        if (packageJsonExists && globalServerUrl) {
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              `🔄 Reconnecting to existing WebContainer session...\r\n🌐 Reconnected to server at ${globalServerUrl}\r\n`
            );
          }
          setPreviewUrl(globalServerUrl);
          setLoadingState({
            transforming: false,
            mounting: false,
            installing: false,
            starting: false,
            ready: true,
          });
          setCurrentStep(4);
          setIsSetupComplete(true);
          setIsSetupInProgress(false);
          return;
        }

        // Determine starting step based on filesystem state
        let startStep = 1;
        if (packageJsonExists) {
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              "🔄 Reconnecting to existing WebContainer session...\r\n"
            );
          }
          
          let nodeModulesExists = false;
          try {
            await instance.fs.readdir("node_modules");
            nodeModulesExists = true;
          } catch (e) {}

          if (nodeModulesExists) {
            startStep = 4; // Skip to starting the server
          } else {
            startStep = 3; // Skip to installing dependencies
          }
        }

        // Step-1 transform data & Step-2 Mount Files
        if (startStep <= 2) {
          setLoadingState((prev) => ({ ...prev, transforming: true }));
          setCurrentStep(1);
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              "🔄 Transforming template data...\r\n"
            );
          }

          // @ts-ignore
          const files = transformToWebContainerFormat(templateData);
          setLoadingState((prev) => ({
            ...prev,
            transforming: false,
            mounting: true,
          }));
          setCurrentStep(2);

          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              "📁 Mounting files to WebContainer...\r\n"
            );
          }
          await instance.mount(files);

          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              "✅ Files mounted successfully\r\n"
            );
          }
        }

        // Step-3 Install dependencies
        if (startStep <= 3) {
          setLoadingState((prev) => ({
            ...prev,
            mounting: false,
            installing: true,
          }));
          setCurrentStep(3);

          // --- Fast install: try to fetch and mount package-lock.json from the server ---
          // The lockfile enables `npm ci` which skips full dependency resolution.
          // We try fetching from the API first (works for saved playgrounds),
          // then check if the mounted files already include it.
          let hasLockFile = false;
          try {
            await instance.fs.readFile("package-lock.json", "utf8");
            hasLockFile = true; // Already present from the template mount
          } catch (e) {
            // Not in the mounted files — try fetching from the server
            if (playgroundId) {
              try {
                const lockRes = await fetch(`/api/template/${playgroundId}/lockfile`);
                if (lockRes.ok) {
                  const lockContent = await lockRes.text();
                  await instance.fs.writeFile("package-lock.json", lockContent);
                  hasLockFile = true;
                  if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal(
                      "🔒 Lockfile fetched from server - using npm ci for fast install\r\n"
                    );
                  }
                }
              } catch (fetchErr) {
                console.warn("Failed to fetch lockfile:", fetchErr);
              }
            }
          }

          const installArgs = hasLockFile
            ? ["ci", "--prefer-offline", "--no-audit", "--no-fund", "--ignore-scripts"]
            : ["install", "--prefer-offline", "--no-audit", "--no-fund", "--ignore-scripts"];

          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              `📦 Installing dependencies (${hasLockFile ? "npm ci" : "npm install"})...\r\n`
            );
          }

          const installProcess = await instance.spawn("npm", installArgs);

          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                if (terminalRef.current?.writeToTerminal) {
                  terminalRef.current.writeToTerminal(data);
                }
              },
            })
          );

          const installExitCode = await installProcess.exit;

          if (installExitCode !== 0) {
            // npm ci can fail if lock file is out of sync — fallback to npm install
            if (hasLockFile) {
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(
                  "⚠️ npm ci failed, falling back to npm install...\r\n"
                );
              }
              const fallbackProcess = await instance.spawn("npm", [
                "install",
                "--prefer-offline",
                "--no-audit",
                "--no-fund",
                "--ignore-scripts",
              ]);
              fallbackProcess.output.pipeTo(
                new WritableStream({
                  write(data) {
                    if (terminalRef.current?.writeToTerminal) {
                      terminalRef.current.writeToTerminal(data);
                    }
                  },
                })
              );
              const fallbackExitCode = await fallbackProcess.exit;
              if (fallbackExitCode !== 0) {
                throw new Error(
                  `Failed to install dependencies. Exit code: ${fallbackExitCode}`
                );
              }
            } else {
              throw new Error(
                `Failed to install dependencies. Exit code: ${installExitCode}`
              );
            }
          }

          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              "✅ Dependencies installed successfully\r\n"
            );
          }
        }

        // STEP-4 Start The Server
        setLoadingState((prev) => ({
          ...prev,
          installing: false,
          starting: true,
        }));
        setCurrentStep(4);

        // Determine the dev/start script command and spawn the binary directly.
        // We CANNOT use `npm run dev` because WebContainer's `jsh` shell does NOT add
        // node_modules/.bin to PATH, causing `jsh: command not found: next` errors.
        // Instead, parse the script command from package.json and invoke the binary directly.
        let startBin = "node_modules/.bin/vite"; // sensible fallback
        let startArgs: string[] = ["--host", "0.0.0.0"];
        try {
          const pkgContent = await instance.fs.readFile("package.json", "utf8");
          const pkg = JSON.parse(pkgContent);

          // Pick the best script: prefer "dev", then "start"
          const scriptValue: string =
            pkg.scripts?.dev || pkg.scripts?.start || "vite";

          // Parse e.g. "next dev", "react-scripts start", "vite", "node server.js"
          const parts = scriptValue.trim().split(/\s+/);
          const rawCmd = parts[0];
          const rawArgs = parts.slice(1);

          // Commands that are node builtins vs local binaries
          if (rawCmd === "node" || rawCmd === "node --watch") {
            startBin = "node";
            startArgs = rawArgs;
          } else {
            // Resolve from node_modules/.bin first, fallback to global
            startBin = `node_modules/.bin/${rawCmd}`;
            startArgs = rawArgs;

            // next dev: force --hostname 0.0.0.0 so WebContainer can see the port
            if (rawCmd === "next" && !rawArgs.includes("--hostname")) {
              startArgs = [...rawArgs, "--hostname", "0.0.0.0"];
            }
            // vite / vite dev / vite preview: needs --host
            if ((rawCmd === "vite" || rawCmd === "astro") && !rawArgs.includes("--host")) {
              startArgs = [...rawArgs, "--host"];
            }
          }
        } catch (e) {
          console.error("Failed to parse package.json for scripts:", e);
        }

        // If there is an active process running from a previous load, kill it first
        if (globalStartProcess) {
          try {
            globalStartProcess.kill();
          } catch (e) {}
          globalStartProcess = null;
        }

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            `$ ${startBin} ${startArgs.join(" ")}\r\n`
          );
        }

        // Register the server-ready listener before spawning the process
        // to prevent any potential race condition where it boots too quickly
        instance.on("server-ready", (port: number, url: string) => {
          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              `\r\n\x1b[32m✓ Server ready at ${url}\x1b[0m\r\n`
            );
          }
          globalServerUrl = url;
          setPreviewUrl(url);
          setLoadingState((prev) => ({
            ...prev,
            starting: false,
            ready: true,
          }));
          setIsSetupComplete(true);
          setIsSetupInProgress(false);
        });

        const startProcess = await instance.spawn(startBin, startArgs);
        globalStartProcess = startProcess;

        // Handle start process output - stream to terminal
        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(data);
              }
            },
          })
        );
      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(`❌ Error: ${errorMessage}\r\n`);
        }
        setSetupError(errorMessage);
        setIsSetupInProgress(false);
        setLoadingState({
          transforming: false,
          mounting: false,
          installing: false,
          starting: false,
          ready: false,
        });
      }
    }

    setupContainer();
  }, [instance, templateData, isSetupComplete, isSetupInProgress]);

  useEffect(() => {
    return () => {};
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h3 className="text-lg font-medium">Initializing WebContainer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up the environment for your project...
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-sm">{error || setupError}</p>
        </div>
      </div>
    );
  }
  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span
        className={`text-sm font-medium ${
          isComplete
            ? "text-green-600"
            : isActive
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      {!previewUrl ? (
        <div className="h-full flex flex-col">
          <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                {getStepIcon(1)}
                {getStepText(1, "Transforming template data")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(2)}
                {getStepText(2, "Mounting files")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(3)}
                {getStepText(3, "Installing dependencies")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(4)}
                {getStepText(4, "Starting development server")}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 p-4">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
              // @ts-ignore - Enable loading iframe contents under Cross-Origin Isolation (COEP)
              credentialless=""
            />
          </div>

          <div className="h-52 border-t">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
