import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import { Trophy, Medal, Award, Search, Crown, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  solved_count: number;
  avatar_url?: string;
  rank: number;
}

const Leaderboard = () => {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [topN, setTopN] = useState("50");

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
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, topN]);

  const fetchLeaderboard = async () => {
    try {
      // Mock leaderboard data
      const mockUsers = [
        { id: "1", username: "CyberNinja", points: 2850, solved_count: 23, rank: 1 },
        { id: "2", username: "ByteHunter", points: 2650, solved_count: 21, rank: 2 },
        { id: "3", username: "CodeBreaker", points: 2400, solved_count: 19, rank: 3 },
        { id: "4", username: "SecurityQueen", points: 2200, solved_count: 18, rank: 4 },
        { id: "5", username: "HackMaster", points: 2100, solved_count: 17, rank: 5 },
        { id: "6", username: "CryptoSolver", points: 1950, solved_count: 16, rank: 6 },
        { id: "7", username: "ReverseEngineer", points: 1850, solved_count: 15, rank: 7 },
        { id: "8", username: "NetworkNinja", points: 1750, solved_count: 14, rank: 8 },
        { id: "9", username: "ForensicsExpert", points: 1650, solved_count: 13, rank: 9 },
        { id: "10", username: "OSINTSpecialist", points: 1550, solved_count: 12, rank: 10 },
        { id: "11", username: "MalwareAnalyst", points: 1450, solved_count: 11, rank: 11 },
        { id: "12", username: "PentestPro", points: 1350, solved_count: 10, rank: 12 },
        { id: "13", username: "BugBountyHunter", points: 1250, solved_count: 9, rank: 13 },
        { id: "14", username: "EthicalHacker", points: 1150, solved_count: 8, rank: 14 },
        { id: "15", username: "SecResearcher", points: 1050, solved_count: 7, rank: 15 },
        // Add more mock users...
        ...Array.from({ length: 35 }, (_, i) => ({
          id: `${i + 16}`,
          username: `User${i + 16}`,
          points: Math.max(50, 1000 - (i * 20)),
          solved_count: Math.max(1, 7 - Math.floor(i / 5)),
          rank: i + 16
        }))
      ];

      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply top N filter
    const limit = parseInt(topN);
    if (limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredUsers(filtered);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-card border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-2">
            <Trophy className="h-10 w-10 text-primary" />
            <span>Leaderboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            See how you rank among the top cybersecurity practitioners
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Top N Filter */}
            <Select value={topN} onValueChange={setTopN}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Top N" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="25">Top 25</SelectItem>
                <SelectItem value="50">Top 50</SelectItem>
                <SelectItem value="100">Top 100</SelectItem>
                <SelectItem value="0">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Top 3 Podium */}
        {filteredUsers.length >= 3 && (
          <div className="mb-12">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="md:order-1 flex flex-col items-center">
                <Card className={`w-full text-center ${getRankStyle(2)} shadow-lg`}>
                  <CardContent className="pt-6 pb-4">
                    <Medal className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold">{filteredUsers[1].username}</h3>
                    <div className="text-3xl font-bold text-primary mt-2">{filteredUsers[1].points.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                    <Badge variant="outline" className="mt-2">
                      {filteredUsers[1].solved_count} solved
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* 1st Place */}
              <div className="md:order-2 flex flex-col items-center">
                <Card className={`w-full text-center ${getRankStyle(1)} shadow-xl transform scale-105`}>
                  <CardContent className="pt-6 pb-4">
                    <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold">{filteredUsers[0].username}</h3>
                    <div className="text-4xl font-bold text-primary mt-2">{filteredUsers[0].points.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                    <Badge variant="outline" className="mt-2">
                      {filteredUsers[0].solved_count} solved
                    </Badge>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">Champion</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 3rd Place */}
              <div className="md:order-3 flex flex-col items-center">
                <Card className={`w-full text-center ${getRankStyle(3)} shadow-lg`}>
                  <CardContent className="pt-6 pb-4">
                    <Award className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold">{filteredUsers[2].username}</h3>
                    <div className="text-3xl font-bold text-primary mt-2">{filteredUsers[2].points.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                    <Badge variant="outline" className="mt-2">
                      {filteredUsers[2].solved_count} solved
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Full Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {filteredUsers.map((leaderboardUser, index) => (
                <div
                  key={leaderboardUser.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-muted/50 ${
                    user && leaderboardUser.username === (user.user_metadata?.username || user.email)
                      ? "bg-primary/5 border-l-4 border-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(leaderboardUser.rank)}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {leaderboardUser.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-lg">{leaderboardUser.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {leaderboardUser.solved_count} challenges solved
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {leaderboardUser.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{users.length}</div>
              <div className="text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.solved_count, 0) / users.length) : 0}
              </div>
              <div className="text-muted-foreground">Avg. Solved</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.points, 0) / users.length) : 0}
              </div>
              <div className="text-muted-foreground">Avg. Points</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;