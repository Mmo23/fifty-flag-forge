import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User, LogOut, Trophy, BookOpen, Zap, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  user?: any;
  onAuthStateChange?: () => void;
}

const Header = ({ user, onAuthStateChange }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onAuthStateChange?.();
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Shield className="h-8 w-8 text-primary group-hover:text-secondary transition-colors" />
            <span className="text-2xl font-bold text-gradient">CTFifty</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/learn" 
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </Link>
            <Link 
              to="/challenges" 
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Zap className="h-4 w-4" />
              <span>Practice</span>
            </Link>
            <Link 
              to="/compete" 
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
            >
              <Trophy className="h-4 w-4" />
              <span>Compete</span>
            </Link>
            <Link 
              to="/jobs" 
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs</span>
            </Link>
            <Link 
              to="/leaderboard" 
              className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
            >
              <Trophy className="h-4 w-4" />
              <span>Rank</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.user_metadata?.username || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/leaderboard" className="cursor-pointer">
                      <Trophy className="h-4 w-4 mr-2" />
                      Leaderboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;