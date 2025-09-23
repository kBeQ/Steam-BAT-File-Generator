import React from 'react';
import { SteamGame } from '../types'; // Removed ActionType as it's not used here
import { SteamIcon, PlusCircleIcon } from '../constants';

interface SteamGameCardProps {
  game: SteamGame;
  onAddGameAction: (game: SteamGame) => void;
}

const SteamGameCard: React.FC<SteamGameCardProps> = ({ game, onAddGameAction }) => {
  return (
    <div className="bg-slate-700/60 rounded-md shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:scale-[1.01] duration-300 ease-in-out group">
      <div className="relative w-full h-24">
        {game.bannerUrl ? (
          <img 
            src={game.bannerUrl} 
            alt={`${game.title} banner`} 
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden') }}
          />
        ) : null}
        <div className={`absolute inset-0 w-full h-full bg-slate-600/70 flex items-center justify-center ${game.bannerUrl ? 'hidden' : ''}`}>
          <SteamIcon className="w-12 h-12 text-sky-400 opacity-60" />
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-slate-100 truncate transition-colors group-hover:text-sky-300" title={game.title}>
          {game.title}
        </h4>
        <p className="text-[0.7rem] leading-tight text-slate-400 mb-2.5">AppID: {game.id}</p>
        <button
          onClick={() => onAddGameAction(game)}
          className="w-full flex items-center justify-center px-3 py-1.5 border border-transparent rounded text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-sky-500 transition duration-150 ease-in-out"
          aria-label={`Add ${game.title} launch action`}
        >
          <PlusCircleIcon className="w-4 h-4 mr-1.5 text-white" />
          Add
        </button>
      </div>
    </div>
  );
};

export default SteamGameCard;