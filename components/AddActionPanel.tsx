
import React, { useState, useEffect, useRef } from 'react';
import { ActionType, AddActionPanelProps } from '../types';
import { ACTION_TYPE_OPTIONS, ACTION_TYPE_VISUALS, PlusCircleIcon } from '../constants';

const AddActionPanel: React.FC<AddActionPanelProps> = ({ onAddAction, predefinedGames }) => {
  const [currentActionType, setCurrentActionType] = useState<ActionType>(ActionType.START_APP);
  // Common fields
  const [path, setPath] = useState<string>('');
  const [appDisplayName, setAppDisplayName] = useState<string>(''); 
  const [duration, setDuration] = useState<number>(5);
  const [appId, setAppId] = useState<string>('');
  const [gameTitle, setGameTitle] = useState<string>('');
  const [processName, setProcessName] = useState<string>('');
  const [actionDisplayName, setActionDisplayName] = useState<string>(''); // For Wait/KillProcess

  // For file drop
  const [isDraggingOverPath, setIsDraggingOverPath] = useState<boolean>(false);
  const [dropMessage, setDropMessage] = useState<string>('');
  const dragCounter = useRef(0); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (currentActionType) {
      case ActionType.START_APP:
        if (!path.trim()) { alert("Application path/name cannot be empty."); return; }
        onAddAction({ type: ActionType.START_APP, path, displayName: appDisplayName.trim() || undefined });
        break;
      case ActionType.WAIT:
        if (duration <= 0) { alert("Wait duration must be a positive number."); return; }
        onAddAction({ type: ActionType.WAIT, duration, displayName: actionDisplayName.trim() || undefined });
        break;
      case ActionType.LAUNCH_STEAM_GAME:
        if (!appId.trim()) { 
            alert("Steam AppID cannot be empty. Please use the SteamDB link to find an AppID if needed."); return; 
        }
        onAddAction({ type: ActionType.LAUNCH_STEAM_GAME, appId, gameTitle: gameTitle.trim() || `Game (AppID: ${appId})` });
        break;
      case ActionType.KILL_PROCESS:
        if (!processName.trim()) { alert("Process name cannot be empty."); return; }
        onAddAction({ type: ActionType.KILL_PROCESS, processName, displayName: actionDisplayName.trim() || undefined });
        break;
      default:
        return;
    }
    
    setPath('');
    setAppDisplayName('');
    setDuration(5);
    setAppId('');
    setGameTitle('');
    setProcessName('');
    setActionDisplayName('');
    setDropMessage(''); 
  };

  const handleAppIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAppId = e.target.value;
    setAppId(newAppId);
    const foundGame = predefinedGames.find(g => g.id === newAppId);
    setGameTitle(foundGame ? foundGame.title : '');
  };

  const handlePathDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOverPath(true);
    }
  };

  const handlePathDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOverPath(false);
    }
  };

  const handlePathDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
  };
  
  const handlePathDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverPath(false);
    dragCounter.current = 0; 

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileName = e.dataTransfer.files[0].name;
      setPath(fileName);
      setDropMessage(`Filename "${fileName}" captured. Note: Browsers provide filename only for security. Please verify or enter the full path if this app is not in your system's PATH.`);
      
      setTimeout(() => setDropMessage(''), 7000);
      e.dataTransfer.clearData(); 
    }
  };

  useEffect(() => {
    setActionDisplayName('');
  }, [currentActionType]);


  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400";
  const actionTypeButtonBase = "px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center gap-2 w-full";
  
  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-xl shadow-2xl space-y-6">
      <h3 className="text-2xl font-semibold text-sky-400 border-b border-slate-700 pb-4">Add New Action</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Action Type</label>
        <div className="grid grid-cols-2 gap-2">
          {ACTION_TYPE_OPTIONS.map(option => {
            const visuals = ACTION_TYPE_VISUALS[option.value];
            const isActive = currentActionType === option.value;
            const IconComponent = visuals.icon;

            let buttonClasses = actionTypeButtonBase;
            let iconClasses = `w-5 h-5 ${visuals.colorClass}`;

            if (isActive) {
              buttonClasses += " bg-sky-600 text-white";
              iconClasses = "w-5 h-5 text-white"; // Active icon is white
            } else {
              buttonClasses += " bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white";
              // Inactive icon uses its specific color (already set in iconClasses)
            }

            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setCurrentActionType(option.value as ActionType)}
                // disabled={isActive} // Keep enabled to allow re-clicking if needed, or style differently
                className={buttonClasses}
              >
                <IconComponent className={iconClasses} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {currentActionType === ActionType.START_APP && (
        <div className="space-y-4">
          <div 
            className={`relative p-1 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDraggingOverPath ? 'border-sky-500 bg-slate-700/30' : 'border-slate-700/50 hover:border-slate-600'}`}
            onDragEnter={handlePathDragEnter}
            onDragLeave={handlePathDragLeave}
            onDragOver={handlePathDragOver}
            onDrop={handlePathDrop}
            role="group"
            aria-label="Application path input and drop zone"
          >
            <label htmlFor="path" className="block text-sm font-medium text-slate-300 mb-1.5">Application Path/Name</label>
            <input
              type="text"
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="C:\Path\To\Your\App.exe (Required)"
              className={inputBaseClasses} 
              aria-describedby="path-description path-drop-message"
            />
             {isDraggingOverPath && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 rounded-md pointer-events-none">
                <p className="text-sky-300 font-semibold text-center p-2">Drop Executable File</p>
              </div>
            )}
            <p id="path-description" className="mt-1.5 text-xs text-slate-500">Full path required if not in system PATH (e.g., C:\\Games\\App.exe). Browsers provide filename only on drop. Executable name (e.g., App.exe) works if in PATH.</p>
            {dropMessage && <p id="path-drop-message" className="mt-1.5 text-xs text-sky-300" role="status">{dropMessage}</p>}
          </div>
          <div>
            <label htmlFor="appDisplayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
            <input
              type="text"
              id="appDisplayName"
              value={appDisplayName}
              onChange={(e) => setAppDisplayName(e.target.value)}
              placeholder="e.g., My Helper App (for UI clarity)"
              className={inputBaseClasses}
            />
            <p className="mt-1.5 text-xs text-slate-500">A custom name for this action in the sequence list. Does not affect the script.</p>
          </div>
        </div>
      )}

      {currentActionType === ActionType.WAIT && (
        <div className="space-y-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-1.5">Duration (seconds)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="1"
              className={inputBaseClasses}
            />
          </div>
          <div>
            <label htmlFor="waitDisplayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
            <input
              type="text"
              id="waitDisplayName"
              value={actionDisplayName}
              onChange={(e) => setActionDisplayName(e.target.value)}
              placeholder="e.g., Initial Delay (for UI clarity)"
              className={inputBaseClasses}
            />
            <p className="mt-1.5 text-xs text-slate-500">A custom name for this action in the sequence list.</p>
          </div>
        </div>
      )}

      {currentActionType === ActionType.LAUNCH_STEAM_GAME && (
        <div className="space-y-4">
          <div>
            <label htmlFor="appId" className="block text-sm font-medium text-slate-300 mb-1.5">Steam AppID</label>
            <input
              type="text"
              id="appId"
              value={appId}
              onChange={handleAppIdChange}
              placeholder="e.g., 252950 (Required)"
              className={inputBaseClasses}
            />
            <a 
                href="https://steamdb.info/search/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-sky-400 hover:text-sky-300 underline transition-colors duration-150"
              >
                Find AppID on SteamDB ↗
            </a>
            <p className="mt-1 text-xs text-slate-500">Use the link above to find the AppID for your game. Copy it here.</p>
          </div>
          <div>
            <label htmlFor="gameTitleDisplay" className="block text-sm font-medium text-slate-300 mb-1.5">Game Title (Optional, for display)</label>
            <input
              type="text"
              id="gameTitleDisplay"
              value={gameTitle} 
              onChange={(e) => setGameTitle(e.target.value)} 
              placeholder="e.g., Rocket League"
              className={inputBaseClasses}
            />
             <p id="game-title-description" className="mt-1.5 text-xs text-slate-500">Auto-filled if AppID matches a predefined game, or enter manually for clarity in the sequence.</p>
          </div>
        </div>
      )}

      {currentActionType === ActionType.KILL_PROCESS && (
        <div className="space-y-4">
          <div>
            <label htmlFor="processName" className="block text-sm font-medium text-slate-300 mb-1.5">Process Name</label>
            <input
              type="text"
              id="processName"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g., BakkesMod.exe (include .exe)"
              className={inputBaseClasses}
              aria-describedby="process-name-description"
            />
            <p id="process-name-description" className="mt-1.5 text-xs text-slate-500">The name of the process executable, including its extension (e.g., .exe).</p>
          </div>
          <div>
            <label htmlFor="killProcessDisplayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
            <input
              type="text"
              id="killProcessDisplayName"
              value={actionDisplayName}
              onChange={(e) => setActionDisplayName(e.target.value)}
              placeholder="e.g., Close Helper App (for UI clarity)"
              className={inputBaseClasses}
            />
            <p className="mt-1.5 text-xs text-slate-500">A custom name for this action in the sequence list.</p>
          </div>
        </div>
      )}

      <button 
        type="submit"
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150 ease-in-out"
      >
        <PlusCircleIcon className="w-5 h-5 mr-2.5 text-white" />
        Add Action to Sequence
      </button>
    </form>
  );
};

export default AddActionPanel;
