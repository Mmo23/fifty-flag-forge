import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Plus, Settings, Upload, Trash2, Edit, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  category: string;
  level: string;
  points: number;
  description: string;
  tries: number;
  solved_count: number;
  created_at: string;
}

const categories = ["Reverse Engineering", "Cryptography", "Digital Forensics", "OSINT", "Network Security", "Mobile Security"];
const levels = ["Easy", "Medium", "Hard"];

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    category: "",
    level: "",
    points: 100,
    description: "",
    flag: "",
    file: null as File | null
  });

  useEffect(() => {
    // Get initial session and check admin status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      
      // In a real app, you'd check if the user is an admin
      // For demo purposes, we'll allow access
      setUser(session.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchChallenges();
      setLoading(false);
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      // Mock data - in real app this would fetch from Supabase
      const mockChallenges = [
        {
          id: "1",
          title: "Basic Buffer Overflow",
          category: "Reverse Engineering",
          level: "Easy",
          points: 100,
          description: "Learn the fundamentals of buffer overflow vulnerabilities",
          tries: 245,
          solved_count: 89,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "2",
          title: "Caesar Cipher Challenge",
          category: "Cryptography",
          level: "Easy",
          points: 50,
          description: "Decode this classic substitution cipher",
          tries: 456,
          solved_count: 234,
          created_at: "2024-01-14T15:30:00Z"
        },
        // ... other mock challenges
      ];
      
      setChallenges(mockChallenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      });
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChallenge.title || !newChallenge.category || !newChallenge.level || !newChallenge.description || !newChallenge.flag) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      // In a real app, this would:
      // 1. Upload file to Supabase Storage
      // 2. Hash the flag
      // 3. Create challenge record in database
      
      const challengeId = Date.now().toString(); // Mock ID
      const newChallengeData: Challenge = {
        id: challengeId,
        title: newChallenge.title,
        category: newChallenge.category,
        level: newChallenge.level,
        points: newChallenge.points,
        description: newChallenge.description,
        tries: 0,
        solved_count: 0,
        created_at: new Date().toISOString()
      };

      setChallenges([newChallengeData, ...challenges]);
      
      // Reset form
      setNewChallenge({
        title: "",
        category: "",
        level: "",
        points: 100,
        description: "",
        flag: "",
        file: null
      });
      
      setCreating(false);
      
      toast({
        title: "Challenge created!",
        description: "The challenge has been successfully created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create challenge",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChallenge = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id));
    toast({
      title: "Challenge deleted",
      description: "The challenge has been removed",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center space-x-2">
              <Settings className="h-10 w-10 text-primary" />
              <span>Admin Panel</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage challenges and platform settings
            </p>
          </div>
          
          <Button onClick={() => setCreating(true)} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary mb-2">{challenges.length}</div>
              <div className="text-muted-foreground">Total Challenges</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary mb-2">
                {challenges.reduce((sum, c) => sum + c.tries, 0)}
              </div>
              <div className="text-muted-foreground">Total Attempts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary mb-2">
                {challenges.reduce((sum, c) => sum + c.solved_count, 0)}
              </div>
              <div className="text-muted-foreground">Total Solves</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary mb-2">
                {challenges.length > 0 ? 
                  Math.round((challenges.reduce((sum, c) => sum + c.solved_count, 0) / 
                             challenges.reduce((sum, c) => sum + c.tries, 0)) * 100) || 0 : 0}%
              </div>
              <div className="text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Challenge Form */}
        {creating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateChallenge} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Challenge Title *</Label>
                      <Input
                        id="title"
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                        placeholder="Enter challenge title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newChallenge.category} onValueChange={(value) => setNewChallenge({...newChallenge, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="level">Difficulty Level *</Label>
                      <Select value={newChallenge.level} onValueChange={(value) => setNewChallenge({...newChallenge, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="points">Points *</Label>
                      <Input
                        id="points"
                        type="number"
                        min="10"
                        max="1000"
                        step="10"
                        value={newChallenge.points}
                        onChange={(e) => setNewChallenge({...newChallenge, points: parseInt(e.target.value)})}
                        placeholder="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                        placeholder="Describe the challenge, objectives, and any hints..."
                        rows={6}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="flag">Flag *</Label>
                      <Input
                        id="flag"
                        type="password"
                        value={newChallenge.flag}
                        onChange={(e) => setNewChallenge({...newChallenge, flag: e.target.value})}
                        placeholder="CTF{example_flag}"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        This will be hashed and stored securely
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="file">Challenge File (Optional)</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setNewChallenge({...newChallenge, file: e.target.files?.[0] || null})}
                        accept=".zip,.tar,.gz,.exe,.apk,.bin"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload binary files, archives, or other challenge resources
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Creating..." : "Create Challenge"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Challenges List */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <Badge className={getLevelColor(challenge.level)}>
                        {challenge.level}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{challenge.points} points</span>
                      <span>{challenge.solved_count} solved</span>
                      <span>{challenge.tries} attempts</span>
                      <span>Created {new Date(challenge.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/challenges/${challenge.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {challenges.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No challenges created yet. Create your first challenge to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
