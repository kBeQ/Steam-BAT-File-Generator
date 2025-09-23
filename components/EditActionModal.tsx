
import React, { useState, useEffect, useCallback } from 'react';
import { Action, ActionType, EditActionModalProps, StartAppAction, WaitAction, LaunchSteamGameAction, KillProcessAction, UnknownAction } from '../types';

const EditActionModal: React.FC<EditActionModalProps> = ({ isOpen, action, onSave, onCancel, predefinedGames }) => {
  const [formData, setFormData] = useState<Partial<Action>>({});

  useEffect(() => {
    if (action) {
      setFormData({ ...action });
    } else {
      setFormData({});
    }
  }, [action]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number' && name === 'duration') {
        setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'appId' && action?.type === ActionType.LAUNCH_STEAM_GAME) {
      const foundGame = predefinedGames.find(g => g.id === value);
      setFormData(prev => ({ ...prev, gameTitle: foundGame ? foundGame.title : '' }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!action) return;

    let updatedActionData: Action | null = null;

    switch (action.type) {
      case ActionType.START_APP:
        const path = (formData as Partial<StartAppAction>).path?.trim();
        const startAppDisplayName = (formData as Partial<StartAppAction>).displayName?.trim();
        if (!path) { alert("Application path/name cannot be empty."); return; }
        updatedActionData = { ...action, path, displayName: startAppDisplayName || undefined };
        break;
      case ActionType.WAIT:
        const duration = (formData as Partial<WaitAction>).duration;
        const waitDisplayName = (formData as Partial<WaitAction>).displayName?.trim();
        if (duration === undefined || duration <= 0) { alert("Wait duration must be a positive number."); return; }
        updatedActionData = { ...action, duration, displayName: waitDisplayName || undefined };
        break;
      case ActionType.LAUNCH_STEAM_GAME:
        const appId = (formData as Partial<LaunchSteamGameAction>).appId?.trim();
        if (!appId) { alert("Steam AppID cannot be empty."); return; }
        const gameTitle = (formData as Partial<LaunchSteamGameAction>).gameTitle?.trim() || `Game (AppID: ${appId})`;
        updatedActionData = { ...action, appId, gameTitle };
        break;
      case ActionType.KILL_PROCESS:
        const processName = (formData as Partial<KillProcessAction>).processName?.trim();
        const killProcessDisplayName = (formData as Partial<KillProcessAction>).displayName?.trim();
        if (!processName) { alert("Process name cannot be empty."); return; }
        updatedActionData = { ...action, processName, displayName: killProcessDisplayName || undefined };
        break;
      case ActionType.UNKNOWN: // Added case for UnknownAction
        const command = (formData as Partial<UnknownAction>).command?.trim();
        const unknownDisplayName = (formData as Partial<UnknownAction>).displayName?.trim();
        if (!command) { alert("Command cannot be empty for an Unknown Action."); return; }
        updatedActionData = { ...action, command, displayName: unknownDisplayName || undefined };
        break;
      default:
        return; 
    }
    
    if (updatedActionData) {
      onSave(updatedActionData);
    }
  };

  const handleAppIdChangeInEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAppId = e.target.value;
    setFormData(prev => ({ ...prev, appId: newAppId }));
    const foundGame = predefinedGames.find(g => g.id === newAppId);
    setFormData(prev => ({ ...prev, gameTitle: foundGame ? foundGame.title : '' }));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !action) return null;

  const inputBaseClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400";
  const textAreaBaseClasses = `${inputBaseClasses} min-h-[80px] font-mono text-sm`;

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-action-title"
    >
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h3 id="edit-action-title" className="text-2xl font-semibold text-sky-400 border-b border-slate-700 pb-4 mb-6">
          Edit: {action.type}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {action.type === ActionType.START_APP && (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-path" className="block text-sm font-medium text-slate-300 mb-1.5">Application Path/Name</label>
                <input
                  type="text"
                  id="edit-path"
                  name="path"
                  value={(formData as Partial<StartAppAction>).path || ''}
                  onChange={handleChange}
                  placeholder="e.g., BakkesMod.exe or C:\\Path\\To\\App.exe"
                  className={inputBaseClasses}
                />
                <p className="mt-1.5 text-xs text-slate-500">Full path required if not in system PATH. Executable name works if in PATH.</p>
              </div>
              <div>
                <label htmlFor="edit-displayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
                <input
                  type="text"
                  id="edit-displayName"
                  name="displayName"
                  value={(formData as Partial<StartAppAction>).displayName || ''}
                  onChange={handleChange}
                  placeholder="e.g., My Helper App (for UI clarity)"
                  className={inputBaseClasses}
                />
                 <p className="mt-1.5 text-xs text-slate-500">A custom name for this action in the sequence list. Does not affect the script.</p>
              </div>
            </div>
          )}

          {action.type === ActionType.WAIT && (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-duration" className="block text-sm font-medium text-slate-300 mb-1.5">Duration (seconds)</label>
                <input
                  type="number"
                  id="edit-duration"
                  name="duration"
                  value={(formData as Partial<WaitAction>).duration || 0}
                  onChange={handleChange}
                  min="1"
                  className={inputBaseClasses}
                />
              </div>
              <div>
                <label htmlFor="edit-waitDisplayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
                <input
                  type="text"
                  id="edit-waitDisplayName"
                  name="displayName"
                  value={(formData as Partial<WaitAction>).displayName || ''}
                  onChange={handleChange}
                  placeholder="e.g., Short Delay"
                  className={inputBaseClasses}
                />
                <p className="mt-1.5 text-xs text-slate-500">A custom name for this action in the sequence list.</p>
              </div>
            </div>
          )}
          
          {action.type === ActionType.LAUNCH_STEAM_GAME && (
             <div className="space-y-4">
                <div>
                    <label htmlFor="edit-appId" className="block text-sm font-medium text-slate-300 mb-1.5">Steam AppID</label>
                    <input
                        type="text"
                        id="edit-appId"
                        name="appId"
                        value={(formData as Partial<LaunchSteamGameAction>).appId || ''}
                        onChange={handleAppIdChangeInEdit}
                        placeholder="e.g., 252950"
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
                </div>
                <div>
                    <label htmlFor="edit-gameTitle" className="block text-sm font-medium text-slate-300 mb-1.5">Game Title (Optional)</label>
                    <input
                        type="text"
                        id="edit-gameTitle"
                        name="gameTitle"
                        value={(formData as Partial<LaunchSteamGameAction>).gameTitle || ''}
                        onChange={handleChange}
                        placeholder="e.g., Rocket League"
                        className={inputBaseClasses}
                    />
                </div>
            </div>
          )}

          {action.type === ActionType.KILL_PROCESS && (
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-processName" className="block text-sm font-medium text-slate-300 mb-1.5">Process Name</label>
                <input
                  type="text"
                  id="edit-processName"
                  name="processName"
                  value={(formData as Partial<KillProcessAction>).processName || ''}
                  onChange={handleChange}
                  placeholder="e.g., BakkesMod.exe"
                  className={inputBaseClasses}
                />
                <p className="mt-1.5 text-xs text-slate-500">The name of the process executable, including its extension (e.g., .exe).</p>
              </div>
              <div>
                <label htmlFor="edit-killProcessDisplayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
                <input
                  type="text"
                  id="edit-killProcessDisplayName"
                  name="displayName"
                  value={(formData as Partial<KillProcessAction>).displayName || ''}
                  onChange={handleChange}
                  placeholder="e.g., Close Helper App"
                  className={inputBaseClasses}
                />
                <p className="mt-1.5 text-xs text-slate-500">A custom name for this action in the sequence list.</p>
              </div>
            </div>
          )}

          {action.type === ActionType.UNKNOWN && ( // Added form for UnknownAction
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-unknownCommand" className="block text-sm font-medium text-slate-300 mb-1.5">Raw Command</label>
                <textarea
                  id="edit-unknownCommand"
                  name="command"
                  value={(formData as Partial<UnknownAction>).command || ''}
                  onChange={handleChange}
                  placeholder="Enter raw BAT command line"
                  className={textAreaBaseClasses}
                  rows={3}
                />
                <p className="mt-1.5 text-xs text-slate-500">The exact command line as it will appear in the BAT file.</p>
              </div>
              <div>
                <label htmlFor="edit-unknownDisplayName" className="block text-sm font-medium text-slate-300 mb-1.5">Display Name (Optional)</label>
                <input
                  type="text"
                  id="edit-unknownDisplayName"
                  name="displayName"
                  value={(formData as Partial<UnknownAction>).displayName || ''}
                  onChange={handleChange}
                  placeholder="e.g., Custom Script Step"
                  className={inputBaseClasses}
                />
                <p className="mt-1.5 text-xs text-slate-500">A descriptive name for this command in the sequence list.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActionModal;
