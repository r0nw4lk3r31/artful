
import React, { useState, useEffect } from 'react';
import ArtConsole from './ArtConsole';
import ModuleFrame from './ModuleFrame';
import { LayoutMode } from '@/types/artTypes';

const ArtDashboard = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [modules, setModules] = useState<Record<string, string>>({
    frame1: 'chat',
    frame2: 'agenda',
    frame3: 'email',
    frame4: 'routeplanner',
  });

  const getLayoutClass = () => {
    switch (layoutMode) {
      case 'fullscreen':
        return 'grid-cols-1 grid-rows-1';
      case 'split':
        return 'grid-cols-2 grid-rows-1';
      case 'quad':
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-2 grid-rows-1';
    }
  };

  const handleChangeModule = (frameId: string, moduleType: string) => {
    setModules(prev => ({
      ...prev,
      [frameId]: moduleType
    }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      <div 
        className={`grid flex-1 gap-4 p-4 ${getLayoutClass()} transition-all duration-300 ease-in-out`}
      >
        {layoutMode === 'fullscreen' && (
          <ModuleFrame 
            id="frame1" 
            moduleType={modules.frame1}
            onChangeModule={(moduleType) => handleChangeModule('frame1', moduleType)}
          />
        )}
        
        {layoutMode === 'split' && (
          <>
            <ModuleFrame 
              id="frame1" 
              moduleType={modules.frame1}
              onChangeModule={(moduleType) => handleChangeModule('frame1', moduleType)}
            />
            <ModuleFrame 
              id="frame2" 
              moduleType={modules.frame2}
              onChangeModule={(moduleType) => handleChangeModule('frame2', moduleType)}
            />
          </>
        )}
        
        {layoutMode === 'quad' && (
          <>
            <ModuleFrame 
              id="frame1" 
              moduleType={modules.frame1}
              onChangeModule={(moduleType) => handleChangeModule('frame1', moduleType)}
            />
            <ModuleFrame 
              id="frame2" 
              moduleType={modules.frame2}
              onChangeModule={(moduleType) => handleChangeModule('frame2', moduleType)}
            />
            <ModuleFrame 
              id="frame3" 
              moduleType={modules.frame3}
              onChangeModule={(moduleType) => handleChangeModule('frame3', moduleType)}
            />
            <ModuleFrame 
              id="frame4" 
              moduleType={modules.frame4}
              onChangeModule={(moduleType) => handleChangeModule('frame4', moduleType)}
            />
          </>
        )}
      </div>
      
      <ArtConsole 
        layoutMode={layoutMode} 
        setLayoutMode={setLayoutMode}
      />
    </div>
  );
};

export default ArtDashboard;
