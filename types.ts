// Add import React for consistent type resolution
import React from 'react';

export enum ActionType {
  START_APP = 'Start Application',
  WAIT = 'Wait',
  LAUNCH_STEAM_GAME = 'Launch Steam Game',
  KILL_PROCESS = 'Kill Process',
  UNKNOWN = 'Unknown Action', // Added
}

export interface BaseAction {
  id: string;
  type: ActionType;
}

export interface StartAppAction extends BaseAction {
  type: ActionType.START_APP;
  path: string;
  displayName?: string;
}

export interface WaitAction extends BaseAction {
  type: ActionType.WAIT;
  duration: number; // in seconds
  displayName?: string; 
}

export interface LaunchSteamGameAction extends BaseAction {
  type: ActionType.LAUNCH_STEAM_GAME;
  appId: string;
  gameTitle?: string;
}

export interface KillProcessAction extends BaseAction {
  type: ActionType.KILL_PROCESS;
  processName: string;
  displayName?: string; 
}

export interface UnknownAction extends BaseAction { // Added
  type: ActionType.UNKNOWN;
  command: string;
  displayName?: string;
}

export type Action = StartAppAction | WaitAction | LaunchSteamGameAction | KillProcessAction | UnknownAction; // Updated

export type NewActionData = 
  | (Omit<StartAppAction, 'id'> & { displayName?: string }) 
  | (Omit<WaitAction, 'id'> & { displayName?: string })
  | Omit<LaunchSteamGameAction, 'id'> 
  | (Omit<KillProcessAction, 'id'> & { displayName?: string })
  | Omit<UnknownAction, 'id'>; // Added

export interface SteamGame {
  id: string; 
  title: string;
  bannerUrl?: string; 
}

export interface AddActionPanelProps {
  onAddAction: (action: NewActionData) => void;
  predefinedGames: SteamGame[]; 
}

export enum ActionDisplayMode {
  FULL_DETAIL = 'FULL_DETAIL',
  MINIMAL_TEXT_LIST = 'MINIMAL_TEXT_LIST',
  ICON_LIST_VIEW = 'ICON_LIST_VIEW',
  COMMAND_LIKE_LIST = 'COMMAND_LIKE_LIST',
  GRID_CARDS = 'GRID_CARDS',
  NUMBERED_SUMMARY_LIST = 'NUMBERED_SUMMARY_LIST',
  DESCRIPTIVE_SENTENCES = 'DESCRIPTIVE_SENTENCES',
  DEVELOPER_DEBUG_VIEW = 'DEVELOPER_DEBUG_VIEW',
  TITLES_ONLY_VIEW = 'TITLES_ONLY_VIEW',
  HORIZONTAL_SCROLL_CARDS = 'HORIZONTAL_SCROLL_CARDS',
  CONDENSED_HORIZONTAL_CARDS = 'CONDENSED_HORIZONTAL_CARDS', // New
  ICON_FOCUSED_GRID = 'ICON_FOCUSED_GRID', // New
}

export interface DisplayModeOption {
  id: ActionDisplayMode;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface DisplayModeCategory {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  modes: DisplayModeOption[];
}

export interface ActionItemProps {
  action: Action;
  index: number;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void; // Represents move to earlier index (left/up)
  onMoveDown: (id: string) => void; // Represents move to later index (right/down)
  onEdit: (actionId: string) => void;
  isFirst: boolean;
  isLast: boolean;
  onDragStart: (event: React.DragEvent<HTMLLIElement>, actionId: string) => void;
  onDragEnter: (event: React.DragEvent<HTMLLIElement>, actionId: string) => void;
  onDragOver: (event: React.DragEvent<HTMLLIElement>, actionId: string) => void;
  onDragLeave: (event: React.DragEvent<HTMLLIElement>, actionId: string) => void;
  onDrop: (event: React.DragEvent<HTMLLIElement>, actionId: string) => void;
  onDragEnd: (event: React.DragEvent<HTMLLIElement>) => void;
  isDragging: boolean;
  isDragOver: boolean;
  displayMode: ActionDisplayMode; 
}

export interface EditActionModalProps {
  isOpen: boolean;
  action: Action | null;
  onSave: (updatedAction: Action) => void;
  onCancel: () => void;
  predefinedGames: SteamGame[];
}

export interface ActionDisplayModeBarProps {
  currentMode: ActionDisplayMode;
  onSetMode: (mode: ActionDisplayMode) => void;
  categories: DisplayModeCategory[];
}