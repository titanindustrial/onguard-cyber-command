
import React, { useState } from 'react';
import { UserSettings, AlertSeverity } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPanelProps {
  className?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ className }) => {
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    alertThreshold: 'low',
    theme: 'dark',
    autoScan: true,
  });
  const [open, setOpen] = useState(false);
  
  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
  ];
  
  const handleSaveSettings = () => {
    // In a real app, save to backend/localStorage
    toast.success('Settings saved successfully');
    setOpen(false);
  };
  
  const handleReset = () => {
    setSettings({
      language: 'en',
      alertThreshold: 'low',
      theme: 'dark',
      autoScan: true,
    });
    toast.info('Settings reset to default values');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-cyber-foreground hover:bg-cyber-muted/50 hover:text-cyber-primary"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="cyber-panel max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyber-foreground flex items-center">
            <Settings className="h-5 w-5 mr-2 text-cyber-primary" />
            Dashboard Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-cyber-foreground">Language</Label>
            <Select 
              value={settings.language} 
              onValueChange={(value) => setSettings({...settings, language: value})}
            >
              <SelectTrigger className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="cyber-panel border-cyber-border">
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-cyber-muted-foreground">
              Select your preferred language for the dashboard
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-cyber-foreground">Alert Threshold</Label>
            <Select 
              value={settings.alertThreshold} 
              onValueChange={(value) => setSettings({...settings, alertThreshold: value as AlertSeverity})}
            >
              <SelectTrigger className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground">
                <SelectValue placeholder="Select alert threshold" />
              </SelectTrigger>
              <SelectContent className="cyber-panel border-cyber-border">
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="high">High & Above</SelectItem>
                <SelectItem value="medium">Medium & Above</SelectItem>
                <SelectItem value="low">Low & Above</SelectItem>
                <SelectItem value="info">All Alerts</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-cyber-muted-foreground">
              Choose which alert severity levels to display
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-cyber-foreground">Theme</Label>
            <Select 
              value={settings.theme} 
              onValueChange={(value) => setSettings({...settings, theme: value as 'dark' | 'light'})}
            >
              <SelectTrigger className="bg-cyber-muted/50 border-cyber-border text-cyber-foreground">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="cyber-panel border-cyber-border">
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light" disabled>Light (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-cyber-muted-foreground">
              Choose your preferred theme color mode
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-scan" className="text-cyber-foreground">Auto-Scan Contracts</Label>
              <p className="text-xs text-cyber-muted-foreground">
                Automatically scan contracts when interacting
              </p>
            </div>
            <Switch 
              id="auto-scan"
              checked={settings.autoScan}
              onCheckedChange={(checked) => setSettings({...settings, autoScan: checked})}
              className="data-[state=checked]:bg-cyber-primary"
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset} className="border-cyber-border text-cyber-foreground hover:bg-cyber-muted">
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} className="cyber-button">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
