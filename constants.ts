import React from 'react'; 
import { SteamGame, ActionType, NewActionData, DisplayModeOption, ActionDisplayMode, DisplayModeCategory } from './types'; 
import { 
    PlayIcon, ClockIcon, SteamIcon, SkullIcon, QuestionMarkCircleIcon, 
    ListBulletIcon, Bars3BottomLeftIcon, ViewColumnsIcon, CommandLineIcon, 
    Squares2X2Icon, ListOrderedIcon, ChatBubbleBottomCenterTextIcon, 
    CodeBracketSquareIcon, TagIcon, LightbulbIcon, Bars4Icon,
    RectangleGroupIcon, SquaresPlusIcon
} from './icons'; 


export const PREDEFINED_GAMES: SteamGame[] = [
  { id: "252950", title: "Rocket League", bannerUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg?t=1690922713" },
  { id: "730", title: "Counter-Strike 2", bannerUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg?t=1698860631" },
  { id: "570", title: "Dota 2", bannerUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg?t=1701909384" },
  { id: "1091500", title: "Cyberpunk 2077", bannerUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg?t=1701194582" },
  { id: "553850", title: "HELLDIVERS™ 2", bannerUrl: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg?t=1709060831" },
];

export const ACTION_TYPE_VISUALS: Record<ActionType, { icon: React.FC<React.SVGProps<SVGSVGElement>>, colorClass: string, defaultLabel: string }> = {
    [ActionType.START_APP]: { icon: PlayIcon, colorClass: 'text-green-400', defaultLabel: ActionType.START_APP },
    [ActionType.WAIT]: { icon: ClockIcon, colorClass: 'text-yellow-400', defaultLabel: ActionType.WAIT },
    [ActionType.LAUNCH_STEAM_GAME]: { icon: SteamIcon, colorClass: 'text-sky-400', defaultLabel: ActionType.LAUNCH_STEAM_GAME },
    [ActionType.KILL_PROCESS]: { icon: SkullIcon, colorClass: 'text-red-400', defaultLabel: ActionType.KILL_PROCESS },
    [ActionType.UNKNOWN]: { icon: QuestionMarkCircleIcon, colorClass: 'text-slate-500', defaultLabel: ActionType.UNKNOWN },
};

export const ACTION_TYPE_OPTIONS = Object.values(ActionType).map(value => ({
  value: value,
  label: ACTION_TYPE_VISUALS[value].defaultLabel
}));


export const ROCKET_LEAGUE_EXAMPLE_SEQUENCE: NewActionData[] = [
  { type: ActionType.START_APP, path: "%USERPROFILE%\\BakkesMod\\BakkesMod.exe", displayName: "BakkesMod" },
  { type: ActionType.WAIT, duration: 2, displayName: "Wait for BakkesMod to Load" },
  { type: ActionType.LAUNCH_STEAM_GAME, appId: "252950", gameTitle: "Rocket League" },
  { type: ActionType.WAIT, duration: 20, displayName: "Wait for Game Injection" },
  { type: ActionType.KILL_PROCESS, processName: "BakkesMod.exe", displayName: "Close BakkesMod" },
];


// --- Display Modes Configuration ---
const COMMAND_LIKE_LIST_MODE: DisplayModeOption = { id: ActionDisplayMode.COMMAND_LIKE_LIST, label: "Command-Like", icon: CommandLineIcon };
const DEVELOPER_DEBUG_MODE: DisplayModeOption = { id: ActionDisplayMode.DEVELOPER_DEBUG_VIEW, label: "Developer Debug", icon: CodeBracketSquareIcon };
const HORIZONTAL_SCROLL_CARDS_MODE: DisplayModeOption = { id: ActionDisplayMode.HORIZONTAL_SCROLL_CARDS, label: "Scroll Cards", icon: ViewColumnsIcon };
const CONDENSED_HORIZONTAL_CARDS_MODE: DisplayModeOption = { id: ActionDisplayMode.CONDENSED_HORIZONTAL_CARDS, label: "Condensed Cards", icon: RectangleGroupIcon };
const ICON_FOCUSED_GRID_MODE: DisplayModeOption = { id: ActionDisplayMode.ICON_FOCUSED_GRID, label: "Icon Grid", icon: SquaresPlusIcon };


export const DISPLAY_MODE_CATEGORIES: DisplayModeCategory[] = [
  {
    id: 'vertical-layouts', 
    label: 'Vertical Layouts', 
    icon: ListBulletIcon, 
    modes: [
      { id: ActionDisplayMode.FULL_DETAIL, label: "Full Detail", icon: ListBulletIcon },
      { id: ActionDisplayMode.MINIMAL_TEXT_LIST, label: "Minimal Text", icon: Bars3BottomLeftIcon },
      { id: ActionDisplayMode.ICON_LIST_VIEW, label: "Icon List", icon: ViewColumnsIcon }, 
      { id: ActionDisplayMode.NUMBERED_SUMMARY_LIST, label: "Numbered Summary", icon: ListOrderedIcon }, 
      { id: ActionDisplayMode.TITLES_ONLY_VIEW, label: "Titles Only", icon: TagIcon },
      { id: ActionDisplayMode.DESCRIPTIVE_SENTENCES, label: "Descriptive Sentences", icon: ChatBubbleBottomCenterTextIcon },
    ],
  },
  {
    id: 'horizontal-layouts',
    label: 'Horizontal Layouts',
    icon: Bars4Icon, 
    modes: [
      HORIZONTAL_SCROLL_CARDS_MODE, 
      CONDENSED_HORIZONTAL_CARDS_MODE,
    ],
  },
  {
    id: 'grid-layouts',
    label: 'Grid Layouts',
    icon: Squares2X2Icon,
    modes: [
      { id: ActionDisplayMode.GRID_CARDS, label: "Grid Cards", icon: Squares2X2Icon },
      ICON_FOCUSED_GRID_MODE,
    ],
  },
  {
    id: 'experimental-dev',
    label: 'Experimental & Dev',
    icon: LightbulbIcon, 
    modes: [
      DEVELOPER_DEBUG_MODE,
      COMMAND_LIKE_LIST_MODE, 
    ],
  },
];

// Re-export icons for use in other files if they are now in icons.ts
export * from './icons';
