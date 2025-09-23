
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Action, ActionType, SteamGame, NewActionData, StartAppAction, LaunchSteamGameAction, WaitAction, KillProcessAction, UnknownAction, ActionDisplayMode } from './types';
import AddActionPanel from './components/AddActionPanel';
import ActionItem from './components/ActionItem';
import EditActionModal from './components/EditActionModal'; 
import SteamGameCard from './components/SteamGameCard';
import ActionDisplayModeBar from './components/ActionDisplayModeBar';
import { PREDEFINED_GAMES, ROCKET_LEAGUE_EXAMPLE_SEQUENCE, DownloadIcon, LightbulbIcon, DISPLAY_MODE_CATEGORIES } from './constants';

const extractAppName = (filePath: string): string => {
  if (!filePath) return '';
  let name = filePath.substring(filePath.lastIndexOf('/') + 1);
  name = name.substring(name.lastIndexOf('\\') + 1);
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex > 0) { 
      name = name.substring(0, dotIndex);
  }
  name = name.replace(/\s*-\s*Shortcut$/i, '').trim();
  return name;
};

const sanitizeForFilename = (text: string, isPath: boolean = false): string => {
  if (!text) return '';
  let name = text;
  if (isPath) {
    name = extractAppName(text);
  }
  name = name
    .split(/[\s-]+/) 
    .map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
  name = name.replace(/[^\w.-]/g, ''); 
  if (name.startsWith('.')) name = name.substring(1);
  if (name.endsWith('.')) name = name.slice(0, -1);
  return name || "Unnamed";
};

const App: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [batFileName, setBatFileName] = useState<string>('launch_script'); 
  const [showExampleGames, setShowExampleGames] = useState<boolean>(false);
  const [minimizeConsoleOutput, setMinimizeConsoleOutput] = useState<boolean>(true);
  const [includeCommentsInBat, setIncludeCommentsInBat] = useState<boolean>(true); 
  const [editingAction, setEditingAction] = useState<Action | null>(null); 
  const [draggingActionId, setDraggingActionId] = useState<string | null>(null);
  const [dragOverActionId, setDragOverActionId] = useState<string | null>(null);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [actionDisplayMode, setActionDisplayMode] = useState<ActionDisplayMode>(ActionDisplayMode.FULL_DETAIL);
  const [batFileToParse, setBatFileToParse] = useState<File | null>(null);
  const batFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOverBatImportZone, setIsDraggingOverBatImportZone] = useState<boolean>(false);
  const batImportDragCounter = useRef(0);


  const addAction = useCallback((newActionData: NewActionData) => {
    const newActionWithId: Action = { ...newActionData, id: crypto.randomUUID() } as Action;
    setActions(prevActions => [...prevActions, newActionWithId]);
  }, []);

  const addLaunchActionForGame = useCallback((game: SteamGame) => {
    addAction({
      type: ActionType.LAUNCH_STEAM_GAME,
      appId: game.id,
      gameTitle: game.title,
    });
  }, [addAction]);

  const removeAction = useCallback((id: string) => {
    setActions(prevActions => prevActions.filter(action => action.id !== id));
  }, []);

  const moveAction = useCallback((id: string, direction: 'up' | 'down') => {
    setActions(prevActions => {
      const index = prevActions.findIndex(action => action.id === id);
      if (index === -1) return prevActions;
      const newActions = [...prevActions];
      const item = newActions.splice(index, 1)[0];
      if (direction === 'up' && index > 0) {
        newActions.splice(index - 1, 0, item);
      } else if (direction === 'down' && index < newActions.length) { 
        newActions.splice(index + 1, 0, item);
      } else {
        newActions.splice(index, 0, item);
      }
      return newActions;
    });
  }, []);

  const handleStartEdit = (actionId: string) => {
    const actionToEdit = actions.find(a => a.id === actionId);
    setEditingAction(actionToEdit || null);
  };

  const handleSaveEdit = (updatedAction: Action) => {
    setActions(prevActions => prevActions.map(act => act.id === updatedAction.id ? updatedAction : act));
    setEditingAction(null);
  };

  const handleCancelEdit = () => {
    setEditingAction(null);
  };

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, actionId: string) => {
    setDraggingActionId(actionId);
    event.dataTransfer.setData('actionId', actionId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLIElement>, targetActionId: string) => {
    event.preventDefault(); 
    if (draggingActionId && draggingActionId !== targetActionId) {
      setDragOverActionId(targetActionId);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLLIElement>, targetActionId: string) => {
    event.preventDefault(); 
    if (draggingActionId && draggingActionId !== targetActionId && dragOverActionId !== targetActionId) {
      setDragOverActionId(targetActionId);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLIElement>, targetActionId: string) => {
    if (dragOverActionId === targetActionId) {
        const relatedTarget = event.relatedTarget as Node | null;
        if (relatedTarget && (event.currentTarget as Node).contains(relatedTarget)) {
          return;
        }
      setDragOverActionId(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLIElement>, targetActionId: string) => {
    event.preventDefault();
    const sourceActionId = event.dataTransfer.getData('actionId');
    if (sourceActionId && sourceActionId !== targetActionId) {
      setActions(prevActions => {
        const sourceIndex = prevActions.findIndex(a => a.id === sourceActionId);
        const targetIndex = prevActions.findIndex(a => a.id === targetActionId);
        if (sourceIndex === -1 || targetIndex === -1) return prevActions;
        const newActions = [...prevActions];
        const [draggedItem] = newActions.splice(sourceIndex, 1);
        newActions.splice(targetIndex, 0, draggedItem);
        return newActions;
      });
    }
    setDraggingActionId(null);
    setDragOverActionId(null);
  };

  const handleDragEnd = (_event: React.DragEvent<HTMLLIElement>) => {
    setDraggingActionId(null);
    setDragOverActionId(null);
  };

  const generateSuggestedBatName = (currentActions: Action[]): string => {
    if (currentActions.length === 0) return '';
    let gameName = '';
    let helperAppName = '';
    const gameAction = currentActions.find(a => a.type === ActionType.LAUNCH_STEAM_GAME) as LaunchSteamGameAction | undefined;
    if (gameAction && gameAction.gameTitle) {
      gameName = sanitizeForFilename(gameAction.gameTitle, false);
    }
    const gameActionIndex = gameAction ? currentActions.indexOf(gameAction) : -1;
    
    const startAppActions = currentActions.filter(a => a.type === ActionType.START_APP) as StartAppAction[];
    const firstHelperAppAction = startAppActions.find(a => gameActionIndex === -1 || currentActions.indexOf(a) < gameActionIndex);

    if (firstHelperAppAction) {
      const nameSource = firstHelperAppAction.displayName?.trim() ? firstHelperAppAction.displayName : firstHelperAppAction.path;
      helperAppName = sanitizeForFilename(nameSource, !firstHelperAppAction.displayName?.trim()); 
    }

    if (helperAppName && gameName) {
      return `${helperAppName}-${gameName}`;
    } else if (gameName) {
      return gameName;
    } else if (helperAppName) {
      return helperAppName;
    }
    // Fallback for other primary actions if no game/helper
    if (currentActions.length > 0) {
      const firstAction = currentActions[0];
      if (firstAction.type === ActionType.START_APP) {
        return sanitizeForFilename((firstAction as StartAppAction).displayName || (firstAction as StartAppAction).path, !(firstAction as StartAppAction).displayName);
      } else if (firstAction.type === ActionType.KILL_PROCESS) {
         return sanitizeForFilename(`Kill-${(firstAction as KillProcessAction).displayName || (firstAction as KillProcessAction).processName}`);
      }
    }
    return '';
  };

  const generateBatScript = (): string => {
    let scriptContent = "";
    if (includeCommentsInBat) {
      scriptContent += "REM --- Generated by Steam BAT File Generator ---\n";
      scriptContent += "REM Made by kBeQ\n";
      scriptContent += `REM Year: ${new Date().getFullYear()}\n\n`;
    }
    if (minimizeConsoleOutput) {
      scriptContent += "@echo off\n\n";
    } else {
      if (!includeCommentsInBat && actions.length > 0) { 
           scriptContent += "\n"; 
      }
    }
    if (actions.length === 0) {
      if (includeCommentsInBat) {
        scriptContent += "REM No actions defined in the sequence.\n";
      }
      scriptContent += "@echo No actions defined.\n";
      if (!minimizeConsoleOutput) {
        if (includeCommentsInBat) scriptContent += "REM Pausing to display message.\n";
        scriptContent += "pause\n";
      }
      return scriptContent;
    }
    const actionCommands = actions.map(action => {
      let commandBlock = "";
      switch (action.type) {
        case ActionType.START_APP:
          const startAppAction = action as StartAppAction;
          if (includeCommentsInBat) {
            const commentName = startAppAction.displayName?.trim() ? `${startAppAction.displayName} (${startAppAction.path})` : startAppAction.path;
            commandBlock += `REM Starting application: ${commentName}\n`;
          }
          commandBlock += `start "" "${startAppAction.path}"`;
          break;
        case ActionType.WAIT:
          const waitAction = action as WaitAction;
          if (includeCommentsInBat) {
            const commentDetail = waitAction.displayName?.trim() ? `(${waitAction.displayName}) ` : '';
            commandBlock += `REM Waiting ${commentDetail}for ${waitAction.duration} seconds.\n`;
          }
          commandBlock += `timeout /t ${waitAction.duration} /nobreak >nul`;
          break;
        case ActionType.LAUNCH_STEAM_GAME:
          if (includeCommentsInBat) {
            commandBlock += `REM Launching Steam game: ${action.gameTitle || `AppID ${action.appId}`}\n`;
          }
          commandBlock += `start "" "steam://rungameid/${action.appId}"`;
          break;
        case ActionType.KILL_PROCESS:
          const killProcessAction = action as KillProcessAction;
          if (includeCommentsInBat) {
            const commentDetail = killProcessAction.displayName?.trim() ? `(${killProcessAction.displayName})` : '';
            commandBlock += `REM Terminating process ${commentDetail}: ${killProcessAction.processName}\n`;
          }
          commandBlock += `taskkill /IM ${killProcessAction.processName} /F`;
          break;
        case ActionType.UNKNOWN:
          const unknownAction = action as UnknownAction;
          if (includeCommentsInBat && unknownAction.displayName?.trim()) {
            commandBlock += `REM ${unknownAction.displayName}\n`;
          }
          commandBlock += unknownAction.command;
          break;
        default:
          return null;
      }
      return commandBlock;
    }).filter(Boolean);
    scriptContent += actionCommands.join('\n\n');
    scriptContent += '\n';
    if (!minimizeConsoleOutput && actions.length > 0) {
      if (includeCommentsInBat) scriptContent += "\nREM Pausing to display any output before closing.\n";
      scriptContent += "\npause\n";
    }
    return scriptContent.trimEnd() + '\n';
  };

  const downloadBatFile = () => {
    const scriptContent = generateBatScript();
    const blob = new Blob([scriptContent.replace(/(?<!\r)\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' }); 
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    let finalBaseName = batFileName.trim();
    if (finalBaseName === 'launch_script' || !finalBaseName) { 
        const suggestedName = generateSuggestedBatName(actions);
        if (suggestedName) {
            finalBaseName = suggestedName;
        } else {
            finalBaseName = batFileName.trim() || 'launch_script'; 
        }
    }
    a.download = `${finalBaseName || 'launch_script'}.bat`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const loadExampleSequence = () => {
    const exampleActionsWithIds: Action[] = ROCKET_LEAGUE_EXAMPLE_SEQUENCE.map(actionBase => {
      const newActionObject = {
        ...actionBase,
        id: crypto.randomUUID()
      };
      return newActionObject as Action; 
    });
    setActions(exampleActionsWithIds);
    setBatFileName('BakkesMod-RocketLeague');
  };

  const getActionListUlClasses = () => {
    switch(actionDisplayMode) {
      case ActionDisplayMode.GRID_CARDS:
      case ActionDisplayMode.ICON_FOCUSED_GRID:
        return "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3";
      case ActionDisplayMode.HORIZONTAL_SCROLL_CARDS:
      case ActionDisplayMode.CONDENSED_HORIZONTAL_CARDS:
        return "flex flex-row overflow-x-auto py-2 space-x-3 custom-scrollbar";
      default:
        return "space-y-3";
    }
  };

  const handleBatFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBatFileToParse(event.target.files[0]);
    } else {
      setBatFileToParse(null);
    }
  };

  const parseBatContentToActions = useCallback((content: string): Action[] => {
    const lines = content.split(/\r?\n/);
    const parsedActions: Action[] = [];
    let lastRemComment: string | null = null;

    const steamGameRegex = /^start\s+\"\"\s+\"steam:\/\/rungameid\/(\d+)\"/i;
    const startAppRegex = /^start\s+\"\"\s+\"(.*?)\"/i;
    const timeoutRegex = /^timeout\s+\/t\s+(\d+)(?:\s+\/nobreak(?:\s+>nul)?)?/i;
    const taskkillRegex = /^taskkill\s+\/IM\s+(.*?)\s+\/F/i;
    const remCommentRegex = /^REM\s+(.*)/i;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.toLowerCase() === '@echo off' || trimmedLine.toLowerCase() === 'pause') {
            if(trimmedLine.toLowerCase() !== '@echo off' && trimmedLine.toLowerCase() !== 'pause') lastRemComment = null; 
            continue;
        }

        let match;
        let actionData: NewActionData | null = null;
        let parsedDisplayName: string | undefined = undefined;

        if (lastRemComment && !remCommentRegex.test(trimmedLine) && 
            !lastRemComment.startsWith("--- Generated by") && 
            !lastRemComment.startsWith("Made by") && 
            !lastRemComment.startsWith("Year:") &&
            !lastRemComment.startsWith("Pausing to display") &&
            !lastRemComment.startsWith("No actions defined")
        ) {
            let potentialDisplayName = lastRemComment;
            const knownPrefixes = [
              "Starting application:", 
              "Waiting for", 
              "Waiting", 
              "Launching Steam game:", 
              "Terminating process"
            ];
            for (const prefix of knownPrefixes) {
                if (potentialDisplayName.toLowerCase().startsWith(prefix.toLowerCase())) {
                    potentialDisplayName = potentialDisplayName.substring(prefix.length).trim();
                    break;
                }
            }
            if (potentialDisplayName.includes('(') && potentialDisplayName.lastIndexOf(')') === potentialDisplayName.length -1 ) { 
                const openParenIndex = potentialDisplayName.indexOf('(');
                if (openParenIndex > 0) {
                     potentialDisplayName = potentialDisplayName.substring(0, openParenIndex).trim();
                }
            }
            const gameAppIdPattern = /^(.*?)\s*\(AppID:\s*\d+\)$/i;
            const gameAppIdMatch = gameAppIdPattern.exec(potentialDisplayName);
            if (gameAppIdMatch) {
                potentialDisplayName = gameAppIdMatch[1].trim();
            }

            if (potentialDisplayName && potentialDisplayName !== lastRemComment) {
                 parsedDisplayName = potentialDisplayName;
            } else if (potentialDisplayName && lastRemComment && !knownPrefixes.some(p => lastRemComment!.toLowerCase().startsWith(p.toLowerCase()))) {
                parsedDisplayName = potentialDisplayName;
            }
        }

        if ((match = steamGameRegex.exec(trimmedLine))) {
            actionData = { type: ActionType.LAUNCH_STEAM_GAME, appId: match[1], gameTitle: parsedDisplayName || `Game (AppID: ${match[1]})` };
        } else if ((match = startAppRegex.exec(trimmedLine))) {
            actionData = { type: ActionType.START_APP, path: match[1], displayName: parsedDisplayName };
        } else if ((match = timeoutRegex.exec(trimmedLine))) {
            actionData = { type: ActionType.WAIT, duration: parseInt(match[1], 10), displayName: parsedDisplayName };
        } else if ((match = taskkillRegex.exec(trimmedLine))) {
            actionData = { type: ActionType.KILL_PROCESS, processName: match[1], displayName: parsedDisplayName };
        } else if ((match = remCommentRegex.exec(trimmedLine))) {
            lastRemComment = match[1].trim();
            continue; 
        } else {
            actionData = { type: ActionType.UNKNOWN, command: trimmedLine, displayName: parsedDisplayName };
        }
        
        if (actionData) {
            parsedActions.push({ ...actionData, id: crypto.randomUUID() } as Action);
        }
        lastRemComment = null; 
    }
    return parsedActions;
  }, []);


  useEffect(() => {
    if (batFileToParse) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          const parsed = parseBatContentToActions(content);
          let proceedWithParsing = true;
          if (actions.length > 0) {
            if (!confirm("Parsing this BAT file will replace your current action sequence. Continue?")) {
              proceedWithParsing = false;
            }
          }

          if (proceedWithParsing) {
            setActions(parsed);
            setBatFileName(batFileToParse.name.replace(/\.bat$/i, ''));
          }
        }
        if (batFileInputRef.current) {
          batFileInputRef.current.value = ""; 
        }
        setBatFileToParse(null); 
      };
      reader.onerror = () => {
        alert("Error reading file.");
        if (batFileInputRef.current) {
          batFileInputRef.current.value = "";
        }
        setBatFileToParse(null);
      };
      reader.readAsText(batFileToParse);
    }
  }, [batFileToParse, actions, parseBatContentToActions, setActions, setBatFileName]);


  // --- Drag and Drop for BAT file import section ---
  const handleBatFileDragEnter = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    batImportDragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile(); // May be null
        // Check if it's a .bat file by specific MIME type OR by name
        if (item.type.toLowerCase() === 'application/x-bat' || (file && file.name.toLowerCase().endsWith('.bat'))) {
           setIsDraggingOverBatImportZone(true);
        }
      }
    }
  };

  const handleBatFileDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    batImportDragCounter.current--;
    if (batImportDragCounter.current === 0) {
      setIsDraggingOverBatImportZone(false);
    }
  };

  const handleBatFileDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault(); // MUST be called to allow drop
    e.stopPropagation();
    
    let allowDrop = false;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0]; // Check the first item
      if (item.kind === 'file') {
        const file = item.getAsFile(); // Attempt to get the file object, may be null during dragover
        
        // Primary check: specific MIME type for .bat
        if (item.type.toLowerCase() === 'application/x-bat') {
          allowDrop = true;
        } 
        // Secondary check: file name ends with .bat (if file object is available)
        else if (file && file.name.toLowerCase().endsWith('.bat')) {
          allowDrop = true;
        }
        // Add a check for text/plain as .bat files can sometimes be reported as such
        else if (item.type.toLowerCase() === 'text/plain' && file && file.name.toLowerCase().endsWith('.bat')) {
          allowDrop = true;
        }
        // Add a check for application/octet-stream or empty type if filename matches
        else if ((item.type.toLowerCase() === 'application/octet-stream' || item.type === '') && file && file.name.toLowerCase().endsWith('.bat')) {
          allowDrop = true;
        }
      }
    }

    if (allowDrop) {
      e.dataTransfer.dropEffect = 'copy';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };
  
  const handleBatFileDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverBatImportZone(false);
    batImportDragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = Array.from(e.dataTransfer.files).find((file: File) => file.name.toLowerCase().endsWith('.bat'));
      if (droppedFile) {
        setBatFileToParse(droppedFile);
      } else {
        alert("Please drop a valid .bat file.");
      }
      e.dataTransfer.clearData();
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 md:p-8 antialiased flex flex-col">
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-sky-400 mb-3">Steam BAT File Generator</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Craft custom launch sequences for your Steam games and helper applications with ease.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={loadExampleSequence}
            className="px-6 py-2.5 bg-slate-700 text-sky-400 rounded-lg hover:bg-slate-600 hover:text-sky-300 transition duration-150 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Load Rocket League Example
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-screen-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        <div className="lg:col-span-4 xl:col-span-3 space-y-8">
          <AddActionPanel 
            onAddAction={addAction} 
            predefinedGames={PREDEFINED_GAMES} 
          />
           <section 
              className={`bg-slate-800 p-6 rounded-xl shadow-2xl transition-all duration-200 ${isDraggingOverBatImportZone ? 'ring-4 ring-sky-500 ring-inset bg-slate-700/80' : 'hover:bg-slate-700/50'}`}
              aria-labelledby="bat-upload-heading"
              onDragEnter={handleBatFileDragEnter}
              onDragLeave={handleBatFileDragLeave}
              onDragOver={handleBatFileDragOver}
              onDrop={handleBatFileDrop}
            >
              <h3 id="bat-upload-heading" className="text-xl font-semibold text-sky-400 border-b border-slate-700 pb-3 mb-4">Import .bat File</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="bat-file-upload" className="sr-only">Choose .bat file</label>
                  <input 
                    type="file" 
                    id="bat-file-upload"
                    accept=".bat" 
                    onChange={handleBatFileUpload}
                    ref={batFileInputRef}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 transition-colors cursor-pointer"
                  />
                </div>
                <p className="text-xs text-slate-500">Select a .bat file or drag &amp; drop it here to automatically parse it. This will replace your current sequence if one exists (you'll be asked to confirm).</p>
                 {isDraggingOverBatImportZone && (
                  <div className="mt-3 p-3 border-2 border-dashed border-sky-400 rounded-md text-center text-sky-300">
                    Drop .bat file here
                  </div>
                )}
              </div>
            </section>
        </div>
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <section className="bg-slate-800 p-6 rounded-xl shadow-2xl" aria-labelledby="action-sequence-heading">
            <div className="flex flex-col items-center border-b border-slate-700 pb-4 mb-6">
              <h3 id="action-sequence-heading" className="text-2xl font-semibold text-sky-400 mb-4 text-center sm:text-left w-full">Action Sequence ({actions.length})</h3>
              <ActionDisplayModeBar 
                currentMode={actionDisplayMode}
                onSetMode={setActionDisplayMode}
                categories={DISPLAY_MODE_CATEGORIES}
              />
            </div>
            {actions.length === 0 ? (
              <p className="text-slate-500 italic text-center py-8">No actions added yet. Use the panel on the left to build your script or import an existing .bat file.</p>
            ) : (
              <ul className={`${getActionListUlClasses()} max-h-[30rem] lg:max-h-[calc(100vh-36rem)] overflow-y-auto pr-2 custom-scrollbar`}>
                {actions.map((action, index) => (
                  <ActionItem
                    key={action.id} 
                    action={action}
                    index={index}
                    onRemove={removeAction}
                    onMoveUp={() => moveAction(action.id, 'up')}
                    onMoveDown={() => moveAction(action.id, 'down')}
                    onEdit={handleStartEdit}
                    isFirst={index === 0}
                    isLast={index === actions.length - 1}
                    onDragStart={(e) => handleDragStart(e, action.id)}
                    onDragEnter={(e) => handleDragEnter(e, action.id)}
                    onDragOver={(e) => handleDragOver(e, action.id)}
                    onDragLeave={(e) => handleDragLeave(e, action.id)}
                    onDrop={(e) => handleDrop(e, action.id)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggingActionId === action.id}
                    isDragOver={dragOverActionId === action.id}
                    displayMode={actionDisplayMode}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="bg-slate-800 p-6 rounded-xl shadow-2xl" aria-labelledby="bat-preview-heading">
            <h3 id="bat-preview-heading" className="text-2xl font-semibold text-sky-400 border-b border-slate-700 pb-4 mb-6">BAT File Preview & Download</h3>
            <div className="mb-4">
              <label htmlFor="batBaseFileName" className="block text-sm font-medium text-slate-300 mb-1.5">BAT File Name:</label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="batBaseFileName"
                  value={batFileName}
                  onChange={(e) => setBatFileName(e.target.value.replace(/\.bat$/i, ''))}
                  className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-l-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
                  placeholder="e.g., my_awesome_script"
                  aria-describedby="bat-file-extension"
                />
                <span id="bat-file-extension" className="px-3 py-3 bg-slate-600 text-slate-400 border border-l-0 border-slate-600 rounded-r-lg">.bat</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 mt-4"> 
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="minimizeConsoleOutput"
                  checked={minimizeConsoleOutput}
                  onChange={(e) => setMinimizeConsoleOutput(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 text-sky-500 focus:ring-sky-500 bg-slate-700 shadow-sm"
                  aria-labelledby="minimizeConsoleOutputLabel"
                />
                <label htmlFor="minimizeConsoleOutput" id="minimizeConsoleOutputLabel" className="text-sm text-slate-300 cursor-pointer">
                  Minimize Console Output & Auto-Close Window
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeCommentsInBat"
                  checked={includeCommentsInBat}
                  onChange={(e) => setIncludeCommentsInBat(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 text-sky-500 focus:ring-sky-500 bg-slate-700 shadow-sm"
                  aria-labelledby="includeCommentsInBatLabel"
                />
                <label htmlFor="includeCommentsInBat" id="includeCommentsInBatLabel" className="text-sm text-slate-300 cursor-pointer">
                  Include comments in BAT file
                </label>
              </div>
            </div>
            
            <pre className="bg-slate-900 text-sm text-emerald-400 p-4 rounded-lg overflow-x-auto max-h-96 whitespace-pre-wrap break-all custom-scrollbar mt-6" aria-live="polite">
              {generateBatScript()}
            </pre>
            <button
              onClick={downloadBatFile}
              disabled={actions.length === 0 && generateBatScript().includes("No actions defined.")} 
              className="mt-8 w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <DownloadIcon className="w-5 h-5 mr-2.5 text-white" />
              Download .bat File
            </button>
          </section>

          <section className="bg-slate-800 p-6 rounded-xl shadow-2xl" aria-labelledby="tips-tricks-heading">
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full flex justify-between items-center text-sky-400 hover:text-sky-300 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-sky-500 rounded-md p-2 -m-2 mb-2"
              aria-expanded={showTips}
              aria-controls="tips-content"
            >
              <h3 id="tips-tricks-heading" className="text-xl font-semibold flex items-center">
                <LightbulbIcon className="w-5 h-5 mr-2.5" />
                Tips & Tricks for Your BAT Script
              </h3>
              <span className={`transform transition-transform duration-200 ${showTips ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
            </button>
            {showTips && (
              <div id="tips-content" className="mt-4 space-y-4 text-sm text-slate-300">
                <p><strong>Important Note:</strong> <code>.bat</code> files themselves cannot contain an icon. The icon you see in your Start Menu or Desktop is for a <strong>shortcut</strong> (<code>.lnk</code> file) that points to your <code>.bat</code> script.</p>
                <p><strong>Running Your Script:</strong> Simply double-click the downloaded <code>.bat</code> file to run your action sequence.</p>
                <div>
                  <strong>Creating a Shortcut:</strong>
                  <ol className="list-decimal list-inside ml-4 space-y-1 mt-1">
                    <li>Right-click on your downloaded <code>.bat</code> file.</li>
                    <li>Select "Send to" &gt; "Desktop (create shortcut)". Or, select "Create shortcut" directly.</li>
                    <li>You can rename this shortcut to something more descriptive (e.g., "Launch Rocket League & BakkesMod").</li>
                  </ol>
                </div>
                <div>
                  <strong>Adding Shortcut to Start Menu:</strong>
                  <ol className="list-decimal list-inside ml-4 space-y-1 mt-1">
                    <li>Create a shortcut as described above.</li>
                    <li>Open File Explorer and type or paste <code>%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs</code> into the address bar and press Enter.</li>
                    <li>Drag and drop your newly created shortcut into this folder. It will now appear in your Start Menu!</li>
                  </ol>
                </div>
                <div>
                  <strong>Customizing the Shortcut Icon:</strong>
                  <ol className="list-decimal list-inside ml-4 space-y-1 mt-1">
                    <li>Right-click on the shortcut file (not the <code>.bat</code> file itself).</li>
                    <li>Select "Properties".</li>
                    <li>In the "Shortcut" tab, click the "Change Icon..." button.</li>
                    <li>
                      Click "Browse..." and navigate to your desired <code>.ico</code> file.
                      <ul className="list-disc list-inside ml-6 mt-1 text-xs text-slate-400">
                        <li>You will need to source your <code>.ico</code> file externally.</li>
                        <li>If you have a <code>.png</code> or <code>.jpg</code> image, you must first convert it to an <code>.ico</code> file using an online converter (e.g., search for "PNG to ICO converter" or "JPG to ICO converter") or image editing software.</li>
                      </ul>
                    </li>
                    <li>Select your icon, click "OK", then "Apply", and "OK" again. Your shortcut should now have the new icon!</li>
                  </ol>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      
      {editingAction && (
        <EditActionModal
          isOpen={!!editingAction}
          action={editingAction}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          predefinedGames={PREDEFINED_GAMES}
        />
      )}

      <footer className="w-full container mx-auto max-w-screen-2xl mt-12 pt-8 pb-4 border-t border-slate-700/50">
        <div className="mb-8">
            <button 
              onClick={() => setShowExampleGames(!showExampleGames)}
              className="w-full mb-3 text-left text-slate-400 hover:text-sky-400 transition duration-150 flex justify-between items-center p-2 rounded-md hover:bg-slate-800/50 focus:outline-none focus:ring-1 focus:ring-sky-500"
              aria-expanded={showExampleGames}
              aria-controls="featured-games-list"
            >
              <span className="text-lg font-medium">Featured Games ({PREDEFINED_GAMES.length})</span>
              <span className={`transform transition-transform duration-200 ${showExampleGames ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
            </button>
            {showExampleGames && (
              <div id="featured-games-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {PREDEFINED_GAMES.map(game => ( 
                  <SteamGameCard key={game.id} game={game} onAddGameAction={addLaunchActionForGame} />
                ))}
              </div>
            )}
          </div>
        <p className="text-center text-sm text-slate-500">
          Created by{' '}
          <a
            href="https://ko-fi.com/kbeq_"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-200"
            aria-label="Support kBeQ on Ko-fi"
          >
            kBeQ
          </a>.
        </p>
      </footer>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569; 
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }
      `}</style>
    </div>
  );
};

export default App;
