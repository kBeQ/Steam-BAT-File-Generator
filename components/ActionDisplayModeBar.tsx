
import React, { useState, useEffect } from 'react';
import { ActionDisplayMode, ActionDisplayModeBarProps, DisplayModeCategory } from '../types';

const ActionDisplayModeBar: React.FC<ActionDisplayModeBarProps> = ({ currentMode, onSetMode, categories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
    const initialCategory = categories.find(cat => cat.modes.some(mode => mode.id === currentMode));
    return initialCategory ? initialCategory.id : (categories.length > 0 ? categories[0].id : null);
  });

  const [lastSelectedModeInCategory, setLastSelectedModeInCategory] = useState<Record<string, ActionDisplayMode>>(() => {
    const initialMap: Record<string, ActionDisplayMode> = {};
    if (currentMode) {
        const initialCategoryOfMode = categories.find(cat => cat.modes.some(m => m.id === currentMode));
        if (initialCategoryOfMode) {
            initialMap[initialCategoryOfMode.id] = currentMode;
        }
    }
    return initialMap;
  });

  useEffect(() => {
    if (currentMode) { 
      const categoryOfCurrentMode = categories.find(cat => 
        cat.modes.some(mode => mode.id === currentMode)
      );
      if (categoryOfCurrentMode) {
        setLastSelectedModeInCategory(prevMap => {
          if (prevMap[categoryOfCurrentMode.id] !== currentMode) {
            return {
              ...prevMap,
              [categoryOfCurrentMode.id]: currentMode,
            };
          }
          return prevMap; 
        });
      }
    }
  }, [currentMode, categories]);


  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    setSelectedCategoryId(categoryId); 

    let modeToActivate = lastSelectedModeInCategory[categoryId];
    if (!modeToActivate && category.modes.length > 0) {
      modeToActivate = category.modes[0].id; 
    }

    if (modeToActivate && modeToActivate !== currentMode) {
      onSetMode(modeToActivate);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  const categoryButtonBase = "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const activeModeHolderCategoryStyle = "bg-sky-600 text-white shadow-md"; 
  const selectedOpenCategoryStyle = "bg-slate-500 text-slate-200 border-2 border-sky-500 shadow-sm"; 
  const inactiveCategoryStyle = "bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white";

  const modeButtonBase = "p-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:ring-offset-1 focus:ring-offset-slate-700/80";
  const modeButtonActive = "bg-sky-500 text-white shadow-md"; 
  const modeButtonInactive = "bg-slate-500 hover:bg-slate-400 text-slate-300 hover:text-slate-100";

  const subModeContainerStyle = "bg-slate-700 p-2.5 rounded-lg mt-2 shadow-inner";

  return (
    <div className="bg-slate-800/60 p-3 rounded-xl shadow-lg w-full">
      <div className="flex flex-wrap justify-center items-center gap-2 mb-3" role="tablist" aria-label="Display Mode Categories">
        {categories.map((category) => {
          const containsActiveMode = category.modes.some(mode => mode.id === currentMode);
          const isSelectedToView = selectedCategoryId === category.id;

          let buttonClasses = categoryButtonBase;
          if (containsActiveMode) {
            buttonClasses += ` ${activeModeHolderCategoryStyle}`;
          } else if (isSelectedToView) {
            buttonClasses += ` ${selectedOpenCategoryStyle}`;
          } else {
            buttonClasses += ` ${inactiveCategoryStyle}`;
          }

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isSelectedToView}
              aria-controls={`category-panel-${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className={buttonClasses}
              title={category.label}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {selectedCategory && (
        <div 
          id={`category-panel-${selectedCategory.id}`} 
          role="tabpanel" 
          aria-labelledby={selectedCategory.id} 
          className={subModeContainerStyle}
        >
          <div className="flex flex-wrap justify-center items-center gap-1.5">
            {selectedCategory.modes.map((modeOption) => (
              <button
                key={modeOption.id}
                type="button"
                onClick={() => onSetMode(modeOption.id)} // Direct click on a mode button
                className={`
                  ${modeButtonBase} 
                  ${currentMode === modeOption.id ? modeButtonActive : modeButtonInactive}
                `}
                title={modeOption.label}
                aria-pressed={currentMode === modeOption.id}
                aria-label={`Set display mode to ${modeOption.label}`}
              >
                <modeOption.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDisplayModeBar;
