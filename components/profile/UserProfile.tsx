
import React, { useState } from 'react';
import { User, Edit, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { useUser } from '../context/UserContext';

interface UserProfileProps {
  className?: string;
  compact?: boolean;
}

export function UserProfile({ className = '', compact = false }: UserProfileProps) {
  const { username, setUsername, isDefaultUsername } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleOpenDialog = () => {
    setNewUsername(username);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
  };
  
  const handleSaveUsername = () => {
    if (newUsername.trim() !== '') {
      setUsername(newUsername);
      setIsDialogOpen(false);
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    }
    if (e.key === 'Escape') {
      handleCloseDialog();
    }
  };
  
  return (
    <>
      <div 
        className={`flex items-center gap-1 cursor-pointer group ${className}`}
        onClick={handleOpenDialog}
        title="Change username"
      >
        <User className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} ${isDefaultUsername ? 'text-muted-foreground' : 'text-primary'}`} />
        {!compact && (
          <span className={`text-sm whitespace-nowrap truncate max-w-[100px] ${isDefaultUsername ? 'text-muted-foreground' : ''}`}>
            {username}
          </span>
        )}
        <Edit className={`h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity ${compact ? 'ml-0' : 'ml-1'}`} />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Set Username</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <div className="flex gap-2">
                <Input
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  className="flex-1"
                  autoFocus
                  onKeyDown={handleKeyDown}
                  maxLength={24}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your username will be used for local communication and identification.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveUsername} disabled={!newUsername.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
