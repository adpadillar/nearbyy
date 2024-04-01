import React from "react";

import SettingsView from "./settings-view";

interface SettingsProps {
  children?: React.ReactNode;
}

const Settings: React.FC<SettingsProps> = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-4xl font-medium">Project Settings</h1>
      <p className="pt-2 text-lg opacity-[0.67]">Configure your project</p>

      <div>
        <SettingsView />
      </div>
    </div>
  );
};

export default Settings;
