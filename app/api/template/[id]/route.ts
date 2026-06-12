import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

// Default templates for when file-based templates are not available
const DEFAULT_TEMPLATES = {
  REACT: {
    folderName: "React App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "react-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "start": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "@types/react": "^18.2.0",\n    "@types/react-dom": "^18.2.0",\n    "@vitejs/plugin-react": "^4.0.0",\n    "vite": "^4.3.0"\n  }\n}`,
      },
      {
        filename: "index",
        fileExtension: "html",
        content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>React App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/main.tsx"></script>\n  </body>\n</html>`,
      },
      {
        filename: "App",
        fileExtension: "tsx",
        content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Welcome to React</h1>\n    </div>\n  );\n}\n\nexport default App;`,
      },
      {
        filename: "main",
        fileExtension: "tsx",
        content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`,
      },
    ],
  },
  NEXTJS: {
    folderName: "Next.js App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "nextjs-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "next dev",\n    "start": "next start",\n    "build": "next build"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "next": "^14.0.0"\n  }\n}`,
      },
      {
        filename: "page",
        fileExtension: "tsx",
        content: `export default function Home() {\n  return (\n    <main>\n      <h1>Welcome to Next.js</h1>\n    </main>\n  );\n}`,
      },
      {
        filename: "layout",
        fileExtension: "tsx",
        content: `export const metadata = {\n  title: 'Next.js App',\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}`,
      },
    ],
  },
  EXPRESS: {
    folderName: "Express App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "express-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "node --watch server.js"\n  },\n  "dependencies": {\n    "express": "^4.18.0"\n  }\n}`,
      },
      {
        filename: "server",
        fileExtension: "ts",
        content: `import express from 'express';\n\nconst app = express();\nconst PORT = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello from Express!');\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});`,
      },
    ],
  },
  VUE: {
    folderName: "Vue App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "vue-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "start": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "vue": "^3.3.0"\n  },\n  "devDependencies": {\n    "@vitejs/plugin-vue": "^4.2.0",\n    "vite": "^4.3.0"\n  }\n}`,
      },
      {
        filename: "index",
        fileExtension: "html",
        content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Vue App</title>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/main.js"></script>\n  </body>\n</html>`,
      },
      {
        filename: "main",
        fileExtension: "js",
        content: `import { createApp } from 'vue';\nimport App from './App.vue';\n\ncreateApp(App).mount('#app');`,
      },
      {
        filename: "App",
        fileExtension: "vue",
        content: `<template>\n  <div id="app">\n    <h1>Welcome to Vue</h1>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'App',\n};\n</script>\n\n<style scoped>\n</style>`,
      },
    ],
  },
  HONO: {
    folderName: "Hono App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "hono-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "tsx watch index.ts",\n    "start": "tsx watch index.ts"\n  },\n  "dependencies": {\n    "@hono/node-server": "^1.13.8",\n    "hono": "^4.7.4"\n  },\n  "devDependencies": {\n    "@types/node": "^22.13.9",\n    "tsx": "^4.19.3"\n  }\n}`,
      },
      {
        filename: "index",
        fileExtension: "ts",
        content: `import { Hono } from 'hono';\nimport { serve } from '@hono/node-server';\n\nconst app = new Hono();\n\napp.get('/', (c) => {\n  return c.text('Hello from Hono!');\n});\n\nserve({\n  fetch: app.fetch,\n  port: 3000\n});\n\nexport default app;`,
      },
    ],
  },
  ANGULAR: {
    folderName: "Angular App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "angular-app",\n  "version": "1.0.0",\n  "scripts": {\n    "ng": "ng",\n    "start": "ng serve",\n    "dev": "ng serve",\n    "build": "ng build"\n  },\n  "private": true,\n  "dependencies": {\n    "@angular/common": "^17.0.0",\n    "@angular/core": "^17.0.0",\n    "@angular/platform-browser": "^17.0.0"\n  },\n  "devDependencies": {\n    "@angular-devkit/build-angular": "^17.0.0",\n    "@angular/cli": "^17.0.0",\n    "@angular/compiler-cli": "^17.0.0",\n    "typescript": "~5.2.0"\n  }\n}`,
      },
      {
        filename: "app.component",
        fileExtension: "ts",
        content: `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-root',\n  templateUrl: './app.component.html',\n  styleUrls: ['./app.component.css']\n})\nexport class AppComponent {\n  title = 'Angular App';\n}`,
      },
      {
        filename: "app.component",
        fileExtension: "html",
        content: `<h1>Welcome to {{title}}</h1>`,
      },
    ],
  },
  SVELTEKIT: {
    folderName: "SvelteKit App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "sveltekit-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite dev",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "devDependencies": {\n    "@sveltejs/adapter-auto": "^3.0.0",\n    "@sveltejs/kit": "^2.0.0",\n    "@sveltejs/vite-plugin-svelte": "^3.0.0",\n    "svelte": "^4.0.0",\n    "vite": "^5.0.0"\n  }\n}`,
      },
      {
        filename: "svelte.config",
        fileExtension: "js",
        content: `import adapter from '@sveltejs/adapter-auto';\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n\tkit: {\n\t\tadapter: adapter()\n\t}\n};\n\nexport default config;`,
      },
    ],
  },
  ASTRO: {
    folderName: "Astro App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "astro-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "astro dev",\n    "start": "astro dev",\n    "build": "astro build",\n    "preview": "astro preview"\n  },\n  "dependencies": {\n    "astro": "^4.0.0"\n  }\n}`,
      },
    ],
  },
  VITE_SHADCN: {
    folderName: "Vite + Shadcn App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "vite-shadcn-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "vite": "^5.0.0"\n  }\n}`,
      },
    ],
  },
  STATIC: {
    folderName: "Static Web App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "static-app",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "serve .",\n    "dev": "serve ."\n  },\n  "devDependencies": {\n    "serve": "^14.0.0"\n  }\n}`,
      },
      {
        filename: "index",
        fileExtension: "html",
        content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Static Page</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello from Static HTML!</h1>\n  <script src="script.js"></script>\n</body>\n</html>`,
      },
      {
        filename: "styles",
        fileExtension: "css",
        content: `body {\n  font-family: sans-serif;\n  background: #f0f0f0;\n  padding: 20px;\n}`,
      },
      {
        filename: "script",
        fileExtension: "js",
        content: `console.log("Static script loaded!");`,
      },
    ],
  },
  TYPESCRIPT: {
    folderName: "TypeScript App",
    items: [
      {
        filename: "package",
        fileExtension: "json",
        content: `{\n  "name": "typescript-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build"\n  },\n  "devDependencies": {\n    "typescript": "^5.0.0",\n    "vite": "^5.0.0"\n  }\n}`,
      },
      {
        filename: "index",
        fileExtension: "html",
        content: `<!DOCTYPE html>\n<html>\n<head>\n  <title>TypeScript Playground</title>\n</head>\n<body>\n  <div id="app"></div>\n  <script type="module" src="/index.ts"></script>\n</body>\n</html>`,
      },
      {
        filename: "index",
        fileExtension: "ts",
        content: `const app = document.getElementById("app");\nif (app) {\n  app.innerHTML = "<h1>Hello from TypeScript!</h1>";\n}`,
      },
    ],
  },
};

function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
  });

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  try {
    const inputPath = path.join(process.cwd(), templatePath);
    const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);

    let result;

    // Try to load from file system first
    try {
      await fs.stat(inputPath);
      await saveTemplateStructureToJson(inputPath, outputFile);
      result = await readTemplateStructureFromJson(outputFile);
      await fs.unlink(outputFile);
    } catch (fileError) {
      // Fall back to default templates if file system fails
      console.warn(
        `Template directory not found at ${inputPath}, using default template`,
      );
      const defaultTemplate = DEFAULT_TEMPLATES[templateKey];
      if (!defaultTemplate) {
        return Response.json(
          {
            error: "Template not found",
            details: `No template available for ${templateKey}`,
          },
          { status: 404 },
        );
      }
      result = defaultTemplate;
    }

    // Validate the JSON structure before saving
    if (!validateJsonStructure(result.items)) {
      return Response.json(
        { error: "Invalid JSON structure" },
        { status: 500 },
      );
    }

    return Response.json(
      { success: true, templateJson: result },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error generating template JSON:", errorMessage);
    return Response.json(
      {
        error: "Failed to generate template",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
