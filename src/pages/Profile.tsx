import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import { User, Trophy, Target, Calendar, Edit3, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SolvedChallenge {
  id: string;
  title: string;
  category: string;
  points: number;
  solved_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [solvedChallenges, setSolvedChallenges] = useState<SolvedChallenge[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      setUsername(session.user.user_metadata?.username || session.user.email || "");
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      setUsername(session.user.user_metadata?.username || session.user.email || "");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchSolvedChallenges();
      setLoading(false);
    }
  }, [user]);

  const fetchSolvedChallenges = async () => {
    try {
      // Mock solved challenges data
      const mockSolvedChallenges = [
        {
          id: "1",
          title: "Basic Buffer Overflow",
          category: "Reverse Engineering",
          points: 100,
          solved_at: "2024-01-15T14:30:00Z"
        },
        {
          id: "2",
          title: "Caesar Cipher Challenge",
          category: "Cryptography",
          points: 50,
          solved_at: "2024-01-14T11:20:00Z"
        },
        {
          id: "5",
          title: "Social Media OSINT",
          category: "OSINT",
          points: 150,
          solved_at: "2024-01-13T16:45:00Z"
        }
      ];
      
      setSolvedChallenges(mockSolvedChallenges);
    } catch (error) {
      console.error("Error fetching solved challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load solved challenges",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // In a real app, you would update the user profile in Supabase
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setUsername(user?.user_metadata?.username || user?.email || "");
    setEditing(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Reverse Engineering": "bg-blue-100 text-blue-800",
      "Cryptography": "bg-purple-100 text-purple-800",
      "Digital Forensics": "bg-green-100 text-green-800",
      "OSINT": "bg-orange-100 text-orange-800",
      "Network Security": "bg-red-100 text-red-800",
      "Mobile Security": "bg-cyan-100 text-cyan-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const totalPoints = solvedChallenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const totalSolved = solvedChallenges.length;

  // Calculate user's estimated rank (mock calculation)
  const estimatedRank = Math.max(1, Math.ceil((2000 - totalPoints) / 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    {editing ? (
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="text-xl font-bold"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl font-bold">{username}</h1>
                    )}
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user?.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editing ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
                    <div className="text-muted-foreground">Total Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Target className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalSolved}</div>
                    <div className="text-muted-foreground">Challenges Solved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">#{estimatedRank}</div>
                    <div className="text-muted-foreground">Global Rank</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solved Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Solved Challenges</span>
                <Badge variant="secondary">{totalSolved}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {solvedChallenges.length > 0 ? (
                <div className="space-y-3">
                  {solvedChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{challenge.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                              {challenge.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Solved {new Date(challenge.solved_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">+{challenge.points}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No challenges solved yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your cybersecurity journey by solving your first challenge!
                  </p>
                  <Button onClick={() => navigate("/challenges")}>
                    Browse Challenges
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Categories Progress */}
                <div>
                  <h4 className="font-semibold mb-3">Categories Mastered</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      "Reverse Engineering",
                      "Cryptography", 
                      "Digital Forensics",
                      "OSINT",
                      "Network Security",
                      "Mobile Security"
                    ].map(category => {
                      const solvedInCategory = solvedChallenges.filter(c => c.category === category).length;
                      const totalInCategory = category === "Cryptography" || category === "OSINT" ? 1 : 0; // Mock data
                      
                      return (
                        <div key={category} className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-sm font-medium mb-1">{category}</div>
                          <div className="text-xs text-muted-foreground">
                            {solvedInCategory} solved
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="text-sm text-muted-foreground">
                    {solvedChallenges.length > 0 ? (
                      <div>
                        Last solved: <span className="font-medium">{solvedChallenges[0].title}</span>
                        {" "}on {new Date(solvedChallenges[0].solved_at).toLocaleDateString()}
                      </div>
                    ) : (
                      "No recent activity"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;