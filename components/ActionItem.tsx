
import React from 'react';
import { Action, ActionItemProps, ActionType, StartAppAction, WaitAction, KillProcessAction, UnknownAction, ActionDisplayMode } from '../types';
import { PlayIcon, ClockIcon, SteamIcon, SkullIcon, QuestionMarkCircleIcon, ArrowUpIcon, ArrowDownIcon, XCircleIcon, PencilSquareIcon, ArrowLeftIcon, ArrowRightIcon } from '../icons'; // Updated XCircleIcon

const getActionTypeColor = (type: ActionType): string => {
  switch (type) {
    case ActionType.START_APP: return 'text-green-400';
    case ActionType.WAIT: return 'text-yellow-400';
    case ActionType.LAUNCH_STEAM_GAME: return 'text-sky-400';
    case ActionType.KILL_PROCESS: return 'text-red-400';
    case ActionType.UNKNOWN: return 'text-slate-500';
    default: return 'text-slate-300';
  }
};

const getActionIcon = (type: ActionType, className: string = "w-6 h-6"): React.ReactNode => {
  const colorClass = getActionTypeColor(type);
  switch (type) {
    case ActionType.START_APP:
      return <PlayIcon className={`${colorClass} ${className}`} />;
    case ActionType.WAIT:
      return <ClockIcon className={`${colorClass} ${className}`} />;
    case ActionType.LAUNCH_STEAM_GAME:
      return <SteamIcon className={`${colorClass} ${className}`} />; 
    case ActionType.KILL_PROCESS:
      return <SkullIcon className={`${colorClass} ${className}`} />;
    case ActionType.UNKNOWN:
      return <QuestionMarkCircleIcon className={`${colorClass} ${className}`} />;
    default:
      return <div className={`${className} opacity-0`}></div>; 
  }
};

const extractPrimaryDetail = (action: Action): string => {
    switch (action.type) {
        case ActionType.START_APP: return action.displayName || action.path;
        case ActionType.WAIT:
            const waitAction = action as WaitAction;
            return waitAction.displayName 
                ? `${waitAction.displayName} (${waitAction.duration}s)` 
                : `${waitAction.duration}s`;
        case ActionType.LAUNCH_STEAM_GAME: return action.gameTitle || `AppID: ${action.appId}`;
        case ActionType.KILL_PROCESS: return action.displayName || action.processName;
        case ActionType.UNKNOWN: return action.displayName || action.command;
        default: return 'Unknown Action Details';
    }
};

const controlButtonClasses = (size: 'small' | 'medium' | 'large' = 'medium', variant: 'default' | 'edit' | 'remove' = 'default', additionalClasses: string = '') => {
  let padding = 'p-2';      // Default: Medium
  let iconSize = 'w-5 h-5'; // Default: Medium
  
  if (size === 'small') { 
    padding = 'p-1.5'; 
    iconSize = 'w-4 h-4'; 
  } else if (size === 'large') { 
    padding = 'p-2.5'; 
    iconSize = 'w-6 h-6'; 
  }

  let colors = 'text-slate-400 hover:text-sky-400 focus:ring-sky-500';
  if (variant === 'edit') colors = 'text-slate-400 hover:text-yellow-400 focus:ring-yellow-500';
  if (variant === 'remove') colors = 'text-slate-400 hover:text-red-500 focus:ring-red-500';
  
  return `${padding} ${colors} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400 transition-colors ${additionalClasses} [&>svg]:${iconSize}`;
};


const ActionItem: React.FC<ActionItemProps> = ({ 
  action, 
  index, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onEdit, 
  isFirst, 
  isLast,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
  displayMode 
}) => {

  const actionColorClass = getActionTypeColor(action.type);

  const renderFullDetail = () => {
    let details: React.ReactNode;
    switch (action.type) {
      case ActionType.START_APP:
        const startApp = action as StartAppAction;
        details = startApp.displayName ? (
            <span className="truncate block">Display: <strong className="font-semibold text-slate-100">{startApp.displayName}</strong> <span className="text-xs text-slate-400 ml-2">(Path: {startApp.path})</span></span>
        ) : <span className="truncate block">Path: <strong className="font-mono text-slate-100">{startApp.path}</strong></span>;
        break;
      case ActionType.WAIT:
        const waitAction = action as WaitAction;
        details = waitAction.displayName ? (
            <span className="truncate block">Display: <strong className="font-semibold text-slate-100">{waitAction.displayName}</strong> <span className="text-xs text-slate-400 ml-2">(Duration: {waitAction.duration}s)</span></span>
        ) : <span className="block">Duration: <strong className="font-mono text-slate-100">{waitAction.duration} seconds</strong></span>;
        break;
      case ActionType.LAUNCH_STEAM_GAME:
        details = <span className="truncate block">AppID: <strong className="font-mono text-slate-100">{action.appId}</strong> ({action.gameTitle || 'Steam Game'})</span>;
        break;
      case ActionType.KILL_PROCESS:
        const killAction = action as KillProcessAction;
        details = killAction.displayName ? (
            <span className="truncate block">Display: <strong className="font-semibold text-slate-100">{killAction.displayName}</strong> <span className="text-xs text-slate-400 ml-2">(Process: {killAction.processName})</span></span>
        ) : <span className="block">Process: <strong className="font-mono text-slate-100">{killAction.processName}</strong></span>;
        break;
      case ActionType.UNKNOWN:
        const unknownAction = action as UnknownAction;
         details = unknownAction.displayName ? (
            <span className="truncate block">Display: <strong className="font-semibold text-slate-100">{unknownAction.displayName}</strong> <span className="text-xs text-slate-400 ml-2">(Command: {unknownAction.command})</span></span>
        ) : <span className="truncate block">Command: <strong className="font-mono text-slate-100">{unknownAction.command}</strong></span>;
        break;
      default: details = null;
    }

    return (
        <>
            <div className="flex items-center space-x-4 min-w-0 flex-grow">
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-600 rounded-full group-hover:bg-slate-500 transition-colors ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                    {getActionIcon(action.type, "w-6 h-6")}
                </div>
                <div className="min-w-0 flex-grow">
                    <p className={`text-md font-semibold truncate group-hover:opacity-80 ${actionColorClass}`}>{action.type}</p>
                    <div className="text-sm text-slate-300 truncate group-hover:text-slate-200">{details}</div>
                </div>
            </div>
            <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                <button onClick={() => onEdit(action.id)} className={controlButtonClasses('large', 'edit')} aria-label="Edit action"><PencilSquareIcon /></button>
                <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('large')} aria-label="Move action up"><ArrowUpIcon /></button>
                <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('large')} aria-label="Move action down"><ArrowDownIcon /></button>
                <button onClick={() => onRemove(action.id)} className={controlButtonClasses('large', 'remove')} aria-label="Remove action"><XCircleIcon /></button>
            </div>
        </>
    );
  };
  
  const renderMinimalTextList = () => {
    let textDetail: string = action.type;
    switch (action.type) {
        case ActionType.START_APP: textDetail += `: ${action.displayName || action.path.split(/[\\/]/).pop() || action.path}`; break;
        case ActionType.WAIT: 
            const waitAct = action as WaitAction;
            textDetail += `: ${waitAct.displayName ? `${waitAct.displayName} (${waitAct.duration}s)` : `${waitAct.duration}s`}`; 
            break;
        case ActionType.LAUNCH_STEAM_GAME: textDetail += `: ${action.gameTitle || action.appId}`; break;
        case ActionType.KILL_PROCESS: textDetail += `: ${action.displayName || action.processName}`; break;
        case ActionType.UNKNOWN: textDetail += `: ${action.displayName || action.command.substring(0, 30) + (action.command.length > 30 ? '...' : '')}`; break;
    }
    return (
        <>
            <span className={`text-xs truncate flex-grow ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} group-hover:text-slate-200 ${actionColorClass}`}>{index + 1}. {textDetail}</span>
            <div className="flex items-center space-x-px ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                 <button onClick={() => onEdit(action.id)} className={controlButtonClasses('small', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
                 <button onClick={() => onRemove(action.id)} className={controlButtonClasses('small', 'remove')} aria-label="Remove"><XCircleIcon /></button>
            </div>
        </>
    );
  };

  const renderGridCards = () => {
    const primaryDetail = extractPrimaryDetail(action);
    return (
        <div className={`flex flex-col items-center justify-between h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} p-3`}>
            <div className="flex flex-col items-center text-center mb-2.5 flex-grow justify-center w-full">
                {getActionIcon(action.type, "w-10 h-10 mb-2.5")}
                <p className={`text-sm font-semibold mb-1.5 leading-tight break-words ${actionColorClass}`}>{action.type}</p>
                <p className="text-xs text-slate-300 leading-snug break-words line-clamp-2">{primaryDetail}</p>
            </div>
            <div className="flex justify-around w-full pt-2.5 border-t border-slate-600">
                 <button onClick={() => onEdit(action.id)} className={controlButtonClasses('medium', 'edit')} aria-label="Edit action"><PencilSquareIcon /></button>
                 <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('medium')} aria-label="Move action left"><ArrowLeftIcon /></button>
                 <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('medium')} aria-label="Move action right"><ArrowRightIcon /></button>
                 <button onClick={() => onRemove(action.id)} className={controlButtonClasses('medium', 'remove')} aria-label="Remove action"><XCircleIcon /></button>
            </div>
        </div>
    );
  };

  const renderHorizontalScrollCard = () => {
    const primaryDetail = extractPrimaryDetail(action);
    return (
        <div className={`flex flex-col items-center justify-between h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} p-3 w-48 md:w-52 flex-shrink-0`}> {/* Fixed width is important here */}
            <div className="flex flex-col items-center text-center mb-2.5 flex-grow justify-center w-full">
                {getActionIcon(action.type, "w-10 h-10 mb-2.5")}
                <p className={`text-sm font-semibold mb-1.5 leading-tight break-words ${actionColorClass}`}>{action.type}</p>
                <p className="text-xs text-slate-300 leading-snug break-words line-clamp-2">{primaryDetail}</p>
            </div>
            <div className="flex justify-around w-full pt-2.5 border-t border-slate-600">
                 <button onClick={() => onEdit(action.id)} className={controlButtonClasses('medium', 'edit')} aria-label="Edit action"><PencilSquareIcon /></button>
                 <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('medium')} aria-label="Move action left"><ArrowLeftIcon /></button>
                 <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('medium')} aria-label="Move action right"><ArrowRightIcon /></button>
                 <button onClick={() => onRemove(action.id)} className={controlButtonClasses('medium', 'remove')} aria-label="Remove action"><XCircleIcon /></button>
            </div>
        </div>
    );
  };

  const renderCondensedHorizontalCards = () => {
    const primaryDetail = extractPrimaryDetail(action);
    return (
      <div className={`flex items-center justify-between h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} p-2.5 w-64 md:w-72 flex-shrink-0`}>
        <div className="flex items-center space-x-2.5 min-w-0 flex-grow">
          <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-600/70 rounded-md group-hover:bg-slate-500/90 transition-colors`}>
            {getActionIcon(action.type, "w-5 h-5")}
          </div>
          <div className="min-w-0 flex-grow">
            <p className={`text-xs font-semibold truncate group-hover:opacity-80 ${actionColorClass}`}>{action.type}</p>
            <p className="text-[0.65rem] text-slate-300 truncate group-hover:text-slate-200 line-clamp-2">{primaryDetail}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <button onClick={() => onEdit(action.id)} className={controlButtonClasses('small', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
          <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('small')} aria-label="Left"><ArrowLeftIcon /></button>
          <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('small')} aria-label="Right"><ArrowRightIcon /></button>
          <button onClick={() => onRemove(action.id)} className={controlButtonClasses('small', 'remove')} aria-label="Remove"><XCircleIcon /></button>
        </div>
      </div>
    );
  };

  const renderIconFocusedGrid = () => {
    const primaryDetail = extractPrimaryDetail(action);
    return (
      <div className={`flex flex-col items-center justify-between h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} p-3`}>
        <div className="flex flex-col items-center text-center mb-2 flex-grow justify-center w-full">
          {getActionIcon(action.type, "w-16 h-16 mb-2 opacity-80 group-hover:opacity-100")}
          <p className={`text-xs font-medium mb-0.5 leading-tight break-words ${actionColorClass}`}>{action.type}</p>
          <p className="text-[0.65rem] text-slate-400 leading-snug break-words line-clamp-1">{primaryDetail}</p>
        </div>
        <div className="flex justify-around w-full pt-2 border-t border-slate-600/70">
          <button onClick={() => onEdit(action.id)} className={controlButtonClasses('small', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
          <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('small')} aria-label="Left"><ArrowLeftIcon /></button>
          <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('small')} aria-label="Right"><ArrowRightIcon /></button>
          <button onClick={() => onRemove(action.id)} className={controlButtonClasses('small', 'remove')} aria-label="Remove"><XCircleIcon /></button>
        </div>
      </div>
    );
  };


  const renderIconListView = () => {
    const primaryDetail = extractPrimaryDetail(action);
    return (
      <>
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-600 rounded-xl group-hover:bg-slate-500/80 shadow-md ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-all`}>
          {getActionIcon(action.type, "w-8 h-8")}
        </div>
        <div className="min-w-0 flex-grow ml-4 flex items-baseline space-x-2">
          <p className={`text-sm font-bold truncate group-hover:opacity-80 ${actionColorClass}`}>{action.type}</p>
          <p className="text-xs text-slate-400 truncate group-hover:text-slate-300">{primaryDetail}</p>
        </div>
        <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
            <button onClick={() => onEdit(action.id)} className={controlButtonClasses('large', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
            <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('large')} aria-label="Up"><ArrowUpIcon /></button>
            <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('large')} aria-label="Down"><ArrowDownIcon /></button>
            <button onClick={() => onRemove(action.id)} className={controlButtonClasses('large', 'remove')} aria-label="Remove"><XCircleIcon /></button>
        </div>
      </>
    );
  };

  const renderCommandLikeList = () => {
    let commandText = "";
    let commentText = ""; 

    if (action.type === ActionType.START_APP || 
        action.type === ActionType.WAIT || 
        action.type === ActionType.KILL_PROCESS ||
        action.type === ActionType.UNKNOWN) {
      commentText = (action as StartAppAction | WaitAction | KillProcessAction | UnknownAction).displayName || '';
    }
    
    switch (action.type) {
        case ActionType.START_APP:
            commandText = `START "" "${action.path}"`;
            if(!commentText) commentText = action.path.split(/[\\/]/).pop() || action.path;
            break;
        case ActionType.WAIT:
            const waitCmdAction = action as WaitAction;
            commandText = `TIMEOUT /T ${waitCmdAction.duration} /NOBREAK >NUL`;
            if(!commentText) commentText = `Wait ${waitCmdAction.duration}s`;
            else commentText += ` (Wait ${waitCmdAction.duration}s)`; // Append duration if displayName exists
            break;
        case ActionType.LAUNCH_STEAM_GAME:
            commandText = `START "" "steam://rungameid/${action.appId}"`;
            commentText = action.gameTitle || `Launch AppID ${action.appId}`; 
            break;
        case ActionType.KILL_PROCESS:
            commandText = `TASKKILL /IM ${action.processName} /F`;
            if(!commentText) commentText = `Kill ${action.processName}`;
            break;
        case ActionType.UNKNOWN:
            commandText = action.command;
            if(!commentText) commentText = `Custom: ${action.command.substring(0,20)}...`;
            break;
    }
    return (
        <div className={`w-full group p-2.5 rounded-md transition-colors relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} bg-slate-900/30 hover:bg-slate-900/60`}>
            <p className={`text-xs font-mono ${actionColorClass}`}>REM {commentText} ({action.type})</p>
            <p className="text-sm text-slate-200 font-mono truncate">{commandText}</p>
            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button onClick={() => onEdit(action.id)} className={controlButtonClasses('small', 'edit', 'bg-slate-700/50 hover:bg-slate-600/80')} aria-label="Edit"><PencilSquareIcon/></button>
                <button onClick={() => onRemove(action.id)} className={controlButtonClasses('small', 'remove', 'bg-slate-700/50 hover:bg-slate-600/80')} aria-label="Remove"><XCircleIcon /></button>
            </div>
        </div>
    );
  };
  
  const renderNumberedSummaryList = () => {
    const primaryDetail = extractPrimaryDetail(action);
    return (
      <>
        <div className={`flex items-baseline space-x-3 min-w-0 flex-grow ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
          <span className={`text-sm font-semibold w-6 text-right flex-shrink-0 ${actionColorClass} opacity-70 group-hover:opacity-100`}>{index + 1}.</span>
          <div className="flex-grow min-w-0">
            <p className="text-sm text-slate-200 truncate group-hover:text-slate-100">
              <span className={`font-bold group-hover:opacity-80 ${actionColorClass}`}>{action.type.split(' ')[0]}</span>: {primaryDetail}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button onClick={() => onEdit(action.id)} className={controlButtonClasses('medium', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
            <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('medium')} aria-label="Up"><ArrowUpIcon /></button>
            <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('medium')} aria-label="Down"><ArrowDownIcon /></button>
            <button onClick={() => onRemove(action.id)} className={controlButtonClasses('medium', 'remove')} aria-label="Remove"><XCircleIcon /></button>
        </div>
      </>
    );
  };

  const renderDescriptiveSentences = () => {
    let sentence = "";
    switch (action.type) {
        case ActionType.START_APP:
            sentence = `This action will <span class="${actionColorClass} font-semibold">start</span> the application ${action.displayName ? `'${action.displayName}' (using path: '${action.path}')` : `'${action.path}'`}.`;
            break;
        case ActionType.WAIT:
            const descWaitAction = action as WaitAction;
            sentence = `The script will then <span class="${actionColorClass} font-semibold">pause</span> for ${descWaitAction.duration} seconds${descWaitAction.displayName ? ` (Purpose: '${descWaitAction.displayName}')` : ''}.`;
            break;
        case ActionType.LAUNCH_STEAM_GAME:
            sentence = `Next, it <span class="${actionColorClass} font-semibold">launches</span> the Steam game '${action.gameTitle || `with AppID ${action.appId}`}' using AppID: ${action.appId}.`;
            break;
        case ActionType.KILL_PROCESS:
            sentence = `This step <span class="${actionColorClass} font-semibold">terminates</span> the process named '${action.processName}'${action.displayName ? ` (Target: '${action.displayName}')` : ''}.`;
            break;
        case ActionType.UNKNOWN:
             sentence = `This is an <span class="${actionColorClass} font-semibold">unknown command</span>: '${action.command}'${action.displayName ? ` (Description: '${action.displayName}')` : ''}.`;
            break;
    }
    return (
        <>
            <div className={`flex items-start space-x-3.5 min-w-0 flex-grow ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                {getActionIcon(action.type, "w-5 h-5 mt-1 flex-shrink-0")}
                <p className="text-sm text-slate-200 group-hover:text-slate-100 leading-normal" dangerouslySetInnerHTML={{ __html: sentence }}></p>
            </div>
            <div className="flex flex-col items-center space-y-1.5 ml-3 flex-shrink-0">
                <button onClick={() => onEdit(action.id)} className={controlButtonClasses('large', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
                <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('large')} aria-label="Up"><ArrowUpIcon /></button>
                <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('large')} aria-label="Down"><ArrowDownIcon /></button>
                <button onClick={() => onRemove(action.id)} className={controlButtonClasses('large', 'remove')} aria-label="Remove"><XCircleIcon /></button>
            </div>
        </>
    );
  };
  
  const renderDeveloperDebugView = () => {
    const entries = Object.entries(action).map(([key, value]) => (
      <div key={key} className="text-xs leading-snug grid grid-cols-3 gap-1">
        <span className="text-sky-400 font-medium col-span-1 truncate">{key}:</span> 
        <span className="text-slate-300 break-all col-span-2">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
      </div>
    ));
    return (
        <div className={`w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} flex flex-col`}>
            <p className={`mb-1.5 text-xs font-bold ${actionColorClass}`}>{action.type} (Debug)</p>
            <div className="font-mono space-y-1 p-1.5 flex-grow bg-slate-900/50 rounded-sm mb-2.5">{entries}</div>
            <div className="flex justify-end space-x-1.5 pt-1.5 border-t border-slate-600/30">
                <button onClick={() => onEdit(action.id)} className={controlButtonClasses('medium', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
                <button onClick={() => onMoveUp(action.id)} disabled={isFirst} className={controlButtonClasses('medium')} aria-label="Up"><ArrowUpIcon /></button>
                <button onClick={() => onMoveDown(action.id)} disabled={isLast} className={controlButtonClasses('medium')} aria-label="Down"><ArrowDownIcon /></button>
                <button onClick={() => onRemove(action.id)} className={controlButtonClasses('medium', 'remove')} aria-label="Remove"><XCircleIcon /></button>
            </div>
        </div>
    );
  };

  const renderTitlesOnlyView = () => {
    let title = '';
    const currentAction = action as Action; // Generic action for initial check
    
    if ('displayName' in currentAction && currentAction.displayName) {
        title = currentAction.displayName;
        if (currentAction.type === ActionType.WAIT) {
            title = `${currentAction.displayName} (${(currentAction as WaitAction).duration}s)`;
        }
    }

    if (!title) {
        switch (action.type) {
            case ActionType.START_APP: title = action.path.split(/[\\/]/).pop() || action.path; break;
            case ActionType.WAIT: 
                const waitA = action as WaitAction;
                // This case should ideally be covered if displayName is empty,
                // but to be safe, if title is still empty here, construct it.
                title = `Wait ${waitA.duration}s`; 
                break;
            case ActionType.LAUNCH_STEAM_GAME: title = action.gameTitle || `Launch AppID ${action.appId}`; break;
            case ActionType.KILL_PROCESS: title = `Kill ${action.processName}`; break;
            case ActionType.UNKNOWN: title = action.command.substring(0,30) + (action.command.length > 30 ? "..." : ""); break;
        }
    }
    return (
        <>
            <div className={`flex items-center space-x-3 min-w-0 flex-grow ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                {getActionIcon(action.type, "w-5 h-5 flex-shrink-0")}
                <p className={`text-sm font-semibold truncate group-hover:opacity-80 ${actionColorClass}`}>{title}</p>
            </div>
            <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button onClick={() => onEdit(action.id)} className={controlButtonClasses('medium', 'edit')} aria-label="Edit"><PencilSquareIcon /></button>
                <button onClick={() => onRemove(action.id)} className={controlButtonClasses('medium', 'remove')} aria-label="Remove"><XCircleIcon /></button>
            </div>
        </>
    );
  };

  let content: React.ReactNode;
  let baseLiClasses = "group transition-all duration-200 ease-in-out"; 

  switch (displayMode) {
    case ActionDisplayMode.FULL_DETAIL:
      content = renderFullDetail();
      baseLiClasses += " flex items-center justify-between p-4 bg-slate-700 rounded-lg shadow-lg hover:bg-slate-600/80 hover:shadow-xl";
      break;
    case ActionDisplayMode.MINIMAL_TEXT_LIST:
      content = renderMinimalTextList();
      baseLiClasses += " flex items-center justify-between pl-2 pr-1 py-1 bg-transparent hover:bg-slate-700/40 rounded-sm"; 
      break;
    case ActionDisplayMode.ICON_LIST_VIEW:
      content = renderIconListView();
      baseLiClasses += " flex items-center justify-between p-3 bg-slate-700/70 rounded-xl shadow-md hover:bg-slate-600/80";
      break;
    case ActionDisplayMode.COMMAND_LIKE_LIST:
      content = renderCommandLikeList();
      baseLiClasses += " py-2.5 px-3 bg-slate-800/60 rounded-md hover:bg-slate-700/70 shadow-inner"; 
      break;
    case ActionDisplayMode.GRID_CARDS:
      content = renderGridCards();
      baseLiClasses += " bg-slate-700/70 rounded-lg shadow-lg hover:bg-slate-600/90 hover:shadow-xl overflow-hidden h-52 flex flex-col transform hover:scale-[1.02]";
      break;
    case ActionDisplayMode.HORIZONTAL_SCROLL_CARDS:
      content = renderHorizontalScrollCard();
      baseLiClasses += " flex-none bg-slate-700/70 rounded-lg shadow-lg hover:bg-slate-600/90 hover:shadow-xl overflow-hidden h-52 transform hover:scale-[1.02]";
      break;
    case ActionDisplayMode.CONDENSED_HORIZONTAL_CARDS:
      content = renderCondensedHorizontalCards();
      baseLiClasses += " flex-none bg-slate-700/60 rounded-lg shadow-md hover:bg-slate-600/80 hover:shadow-lg overflow-hidden h-28 transform hover:scale-[1.015]";
      break;
    case ActionDisplayMode.ICON_FOCUSED_GRID:
      content = renderIconFocusedGrid();
      baseLiClasses += " bg-slate-700/60 rounded-lg shadow-md hover:bg-slate-600/80 hover:shadow-lg overflow-hidden h-44 flex flex-col transform hover:scale-[1.02]";
      break;
    case ActionDisplayMode.NUMBERED_SUMMARY_LIST:
      content = renderNumberedSummaryList();
      baseLiClasses += " flex items-center justify-between px-3 py-2.5 bg-slate-700/50 rounded-lg hover:bg-slate-600/60 shadow"; 
      break;
    case ActionDisplayMode.DESCRIPTIVE_SENTENCES:
      content = renderDescriptiveSentences();
      baseLiClasses += " flex items-start justify-between p-3.5 bg-slate-700/80 rounded-lg shadow-md hover:bg-slate-700";
      break;
    case ActionDisplayMode.DEVELOPER_DEBUG_VIEW:
      content = renderDeveloperDebugView();
      baseLiClasses += " p-3 bg-slate-800/80 rounded-lg shadow font-mono text-xs hover:bg-slate-700/90"; 
      break;
    case ActionDisplayMode.TITLES_ONLY_VIEW:
      content = renderTitlesOnlyView();
      baseLiClasses += " flex items-center justify-between px-4 py-3 bg-slate-700/60 rounded-lg shadow-sm hover:bg-slate-600/70"; 
      break;
    default:
      content = renderFullDetail(); 
      baseLiClasses += " flex items-center justify-between p-4 bg-slate-700 rounded-lg shadow-lg hover:bg-slate-600/80";
  }
  
  if (isDragging) {
    baseLiClasses += " opacity-60 cursor-grabbing scale-105 shadow-2xl z-10 border-2 border-sky-400"; 
  }
  if (isDragOver) {
    baseLiClasses += (displayMode === ActionDisplayMode.GRID_CARDS || 
                      displayMode === ActionDisplayMode.HORIZONTAL_SCROLL_CARDS || 
                      displayMode === ActionDisplayMode.CONDENSED_HORIZONTAL_CARDS ||
                      displayMode === ActionDisplayMode.ICON_FOCUSED_GRID 
                     )
      ? " ring-4 ring-sky-500 ring-inset" 
      : " outline-dashed outline-2 outline-offset-2 outline-sky-500"; 
  }

  return (
    <li 
      className={baseLiClasses}
      draggable={true}
      onDragStart={(e) => onDragStart(e, action.id)}
      onDragEnter={(e) => onDragEnter(e, action.id)}
      onDragOver={(e) => onDragOver(e, action.id)}
      onDragLeave={(e) => onDragLeave(e, action.id)}
      onDrop={(e) => onDrop(e, action.id)}
      onDragEnd={onDragEnd}
      aria-grabbed={isDragging}
      role="listitem"
      tabIndex={0} 
    >
      {content}
    </li>
  );
};

export default ActionItem;