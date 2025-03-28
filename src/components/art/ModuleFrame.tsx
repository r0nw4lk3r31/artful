
import React from 'react';
import { X } from 'lucide-react';

interface ModuleFrameProps {
  id: string;
  moduleType: string;
  onChangeModule: (moduleType: string) => void;
}

const ModuleFrame = ({ id, moduleType, onChangeModule }: ModuleFrameProps) => {
  return (
    <div className="module-frame animate-fade-in">
      <div className="module-header">
        <span className="text-sm font-medium capitalize">{moduleType}</span>
        <button className="p-1 hover:bg-muted rounded-md">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 p-4">
        {/* Module content will be implemented in separate component files */}
        <div className="text-muted-foreground text-sm">
          {moduleType} module content will be displayed here
        </div>
      </div>
    </div>
  );
};

export default ModuleFrame;
