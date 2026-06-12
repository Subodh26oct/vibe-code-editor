import { isLastDayOfMonth } from "date-fns";
import { useState, useCallback } from "react";


interface AISuggestionsState {
    suggestion: string | null;
    isLoading: boolean;
    position: { line: number; column: number } | null;
    decoration: string[];
    isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
    toggleEnabled: () => void;
    fetchSuggestion: (type: string, editor: any) => Promise<void>;
    acceptSuggestion: (editor: any, monaco: any) => void;
    rejectSuggestion: (editor: any) => void;
    clearSuggestion: (editor: any) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {
    const [state, setState] = useState<AISuggestionsState>({
        suggestion: null,
        isLoading: false,
        position: null,
        decoration: [],
        isEnabled: true,
    });

    const toggleEnabled = useCallback(() => {
        setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
    }, [])

    const fetchSuggestion = useCallback(async (type: string, editor: any) => {
        if (!state.isEnabled || !editor || state.isLoading) {
            return;
        }

        const model = editor.getModel();
        const cursorPosition = editor.getPosition();

        if (!model || !cursorPosition) {
            return;
        }

        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            const payload = {
                fileContent: model.getValue(),
                cursorLine: cursorPosition.lineNumber - 1,
                cursorColumn: cursorPosition.column - 1,
                suggestionType: type
            };

            const response = await fetch("/api/code-completion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();

            if (data.suggestion) {
                const suggestionText = data.suggestion.trim();
                setState((prev) => ({
                    ...prev,
                    suggestion: suggestionText,
                    position: {
                        line: cursorPosition.lineNumber,
                        column: cursorPosition.column
                    },
                    isLoading: false
                }));
            } else {
                console.warn("No suggestion received from API.");
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error("Error fetching code suggestion:", error);
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [state.isEnabled, state.isLoading]);


    const acceptSuggestion = useCallback((editor: any, monaco: any) => {
        if (!state.suggestion || !state.position || !editor || !monaco) {
            return;
        }

        const { line, column } = state.position;
        const sanitizedSuggestion = state.suggestion.replace(/^\d+:\s*/gm, "");

        editor.executeEdits("", [
            {
                range: new monaco.Range(line, column, line, column),
                text: sanitizedSuggestion,
                forceMoveMarkers: true,
            }
        ]);

        if (editor && state.decoration.length > 0) {
            editor.deltaDecorations(state.decoration, []);
        }

        setState((prev) => ({
            ...prev,
            suggestion: null,
            position: null,
            decoration: []
        }));
    }, [state.suggestion, state.position, state.decoration]);

    const rejectSuggestion = useCallback((editor: any) => {
        if (editor && state.decoration.length > 0) {
            editor.deltaDecorations(state.decoration, []);
        }

        setState((prev) => ({
            ...prev,
            suggestion: null,
            position: null,
            decoration: []
        }));
    }, [state.decoration]);
 
    const clearSuggestion = useCallback((editor: any) => {
        if (editor && state.decoration.length > 0) {
            editor.deltaDecorations(state.decoration, []);
        }

        setState((prev) => ({
            ...prev,
            suggestion: null,
            position: null,
            decoration: [],
        }));
    }, [state.decoration]);


    return {
        ...state,
        toggleEnabled,
        fetchSuggestion,
        acceptSuggestion,
        rejectSuggestion,
        clearSuggestion
    }
}