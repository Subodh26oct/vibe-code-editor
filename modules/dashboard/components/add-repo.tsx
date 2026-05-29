"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, GitBranch, Loader2, Lock, Search, Star, GitFork } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createPlaygroundFromRepo } from "../actions";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  private: boolean;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};

const AddRepo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isCloningRepo, setIsCloningRepo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRepos = useCallback(async () => {
    setIsLoadingRepos(true);
    setError(null);

    try {
      const response = await fetch("/api/github/repos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch repositories");
      }

      setRepos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch repositories";
      setError(message);
    } finally {
      setIsLoadingRepos(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && repos.length === 0 && !error) {
      fetchRepos();
    }
  }, [isModalOpen, repos.length, error, fetchRepos]);

  const handleCloneRepo = async (repo: GitHubRepo) => {
    setIsCloningRepo(repo.full_name);

    try {
      toast.info(`Fetching ${repo.name}...`, { duration: 3000 });

      // Fetch repo tree
      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repo.html_url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch repository files");
      }

      toast.info("Creating playground...", { duration: 2000 });

      // Create playground
      const playground = await createPlaygroundFromRepo({
        title: repo.name,
        repoUrl: repo.html_url,
        templateData: data,
      });

      if (!playground?.id) {
        throw new Error("Failed to create playground");
      }

      toast.success(`${repo.name} imported successfully!`);
      setIsModalOpen(false);
      router.push(`/playground/${playground.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsCloningRepo(null);
    }
  };

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (repo.language?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const handleClose = () => {
    if (!isCloningRepo) {
      setIsModalOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F] transition-colors duration-300"
            size={"icon"}
          >
            <ArrowDown
              size={30}
              className="transition-transform duration-300 group-hover:translate-y-1"
            />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">
              Open Github Repository
            </h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">
              Work with your repositories in our editor
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#e93f3f] flex items-center gap-2">
              <GitBranch size={24} className="text-[#e93f3f]" />
              Your GitHub Repositories
            </DialogTitle>
            <DialogDescription>
              Select a repository to import into your editor
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoadingRepos}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0">
            {isLoadingRepos ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={32} className="animate-spin text-[#E93F3F]" />
                <p className="text-sm text-muted-foreground">Loading your repositories...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md px-4 py-3 text-center max-w-md">
                  {error}
                </div>
                <Button
                  variant="outline"
                  onClick={fetchRepos}
                  className="text-[#E93F3F] border-[#E93F3F] hover:bg-[#E93F3F]/10"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Search size={32} className="text-gray-300" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No repositories match your search" : "No repositories found"}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="flex flex-col gap-2">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className={`group/repo flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200
                        hover:border-[#E93F3F] hover:shadow-[0_4px_12px_rgba(233,63,63,0.1)]
                        ${isCloningRepo === repo.full_name ? "border-[#E93F3F] bg-[#E93F3F]/5" : "hover:bg-muted/50"}
                        ${isCloningRepo && isCloningRepo !== repo.full_name ? "opacity-50 pointer-events-none" : ""}
                      `}
                      onClick={() => !isCloningRepo && handleCloneRepo(repo)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">
                            {repo.name}
                          </span>
                          {repo.private && (
                            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border bg-muted text-muted-foreground">
                              <Lock size={10} />
                              Private
                            </span>
                          )}
                        </div>

                        {repo.description && (
                          <p className="text-xs text-muted-foreground truncate mb-2 max-w-[400px]">
                            {repo.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{
                                  backgroundColor:
                                    LANGUAGE_COLORS[repo.language] || "#858585",
                                }}
                              />
                              {repo.language}
                            </span>
                          )}
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Star size={12} />
                              {repo.stargazers_count}
                            </span>
                          )}
                          {repo.forks_count > 0 && (
                            <span className="flex items-center gap-1">
                              <GitFork size={12} />
                              {repo.forks_count}
                            </span>
                          )}
                          <span>Updated {formatDate(repo.pushed_at)}</span>
                        </div>
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        {isCloningRepo === repo.full_name ? (
                          <div className="flex items-center gap-2 text-[#E93F3F]">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs font-medium">Importing...</span>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover/repo:opacity-100 transition-opacity text-[#E93F3F] hover:text-[#E93F3F] hover:bg-[#E93F3F]/10"
                          >
                            Import
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              {repos.length > 0 && `${filteredRepos.length} of ${repos.length} repositories`}
            </p>
            <Button variant="outline" onClick={handleClose} disabled={!!isCloningRepo}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRepo;
