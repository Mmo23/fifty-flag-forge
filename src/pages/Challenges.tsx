import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { Search, Filter, Star, Users, Clock } from "lucide-react";
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

const categories = [
  "All Categories",
  "Reverse Engineering", 
  "Cryptography", 
  "Digital Forensics", 
  "OSINT", 
  "Network Security", 
  "Mobile Security"
];

const levels = ["All Levels", "Easy", "Medium", "Hard"];
const sortOptions = ["Newest", "Most Solved", "Points (High to Low)", "Points (Low to High)"];

const Challenges = () => {
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [sortBy, setSortBy] = useState("Newest");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterAndSortChallenges();
  }, [challenges, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const fetchChallenges = async () => {
    try {
      // For now, using mock data since we need to set up Supabase first
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
        {
          id: "3",
          title: "Network Packet Analysis",
          category: "Network Security", 
          level: "Medium",
          points: 200,
          description: "Analyze network traffic to find hidden data",
          tries: 123,
          solved_count: 45,
          created_at: "2024-01-13T09:15:00Z"
        },
        {
          id: "4",
          title: "Mobile App Reverse",
          category: "Mobile Security",
          level: "Hard", 
          points: 350,
          description: "Reverse engineer an Android APK to find secrets",
          tries: 67,
          solved_count: 12,
          created_at: "2024-01-12T14:45:00Z"
        },
        {
          id: "5",
          title: "Social Media OSINT",
          category: "OSINT",
          level: "Medium",
          points: 150,
          description: "Use open source intelligence to track down information",
          tries: 198,
          solved_count: 78,
          created_at: "2024-01-11T11:20:00Z"
        },
        {
          id: "6",
          title: "Digital Image Forensics",
          category: "Digital Forensics",
          level: "Hard",
          points: 300,
          description: "Extract hidden data from a corrupted image file",
          tries: 89,
          solved_count: 23,
          created_at: "2024-01-10T16:00:00Z"
        }
      ];
      
      setChallenges(mockChallenges);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterAndSortChallenges = () => {
    let filtered = challenges.filter(challenge => {
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || challenge.category === selectedCategory;
      const matchesLevel = selectedLevel === "All Levels" || challenge.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort challenges
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Most Solved":
          return b.solved_count - a.solved_count;
        case "Points (High to Low)":
          return b.points - a.points;
        case "Points (Low to High)":
          return a.points - b.points;
        case "Newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredChallenges(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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
          <div className="text-center">Loading challenges...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Challenges</h1>
          <p className="text-xl text-muted-foreground">
            Test your cybersecurity skills with hands-on challenges across multiple categories
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-muted-foreground">
          {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} found
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <Card key={challenge.id} className="group hover:shadow-ctf transition-all duration-300 border-gradient">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getLevelColor(challenge.level)}>
                    {challenge.level}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{challenge.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {challenge.title}
                </CardTitle>
                <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                  {challenge.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {challenge.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{challenge.solved_count} solved</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{challenge.tries} tries</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/challenges/${challenge.id}`)}
                >
                  View Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No challenges found matching your criteria</div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All Categories");
              setSelectedLevel("All Levels");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;