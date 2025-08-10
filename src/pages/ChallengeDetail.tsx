import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import { ArrowLeft, Download, Flag, Users, Clock, Trophy, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  category: string;
  level: string;
  points: number;
  description: string;
  file_url?: string;
  tries: number;
  solved_count: number;
  created_at: string;
}

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [flag, setFlag] = useState("");
  const [submitResult, setSubmitResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [alreadySolved, setAlreadySolved] = useState(false);

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
    if (id) {
      fetchChallenge();
    }
  }, [id]);

  const fetchChallenge = async () => {
    try {
      // Mock data for demonstration
      const mockChallenges = {
        "1": {
          id: "1",
          title: "Basic Buffer Overflow",
          category: "Reverse Engineering",
          level: "Easy",
          points: 100,
          description: `This challenge introduces you to the fundamentals of buffer overflow vulnerabilities. You'll analyze a simple C program that has a buffer overflow vulnerability and exploit it to capture the flag.

**Learning Objectives:**
- Understand how buffer overflows work
- Learn to identify vulnerable code patterns
- Practice basic exploitation techniques

**Instructions:**
1. Download the provided binary file
2. Analyze the code for vulnerabilities
3. Craft an input that triggers the buffer overflow
4. Extract the flag from the program's output

**Hints:**
- The buffer is only 64 bytes long
- Look for functions that don't check input length
- The flag format is: CTF{...}`,
          file_url: "/challenges/buffer_overflow.zip",
          tries: 245,
          solved_count: 89,
          created_at: "2024-01-15T10:00:00Z"
        },
        "2": {
          id: "2",
          title: "Caesar Cipher Challenge",
          category: "Cryptography",
          level: "Easy", 
          points: 50,
          description: `A classic substitution cipher challenge. The message has been encoded using a Caesar cipher with an unknown shift value.

**Your Task:**
Decode the following message to reveal the flag:

\`\`\`
FWKLV LV D VHFUHW PHVVDJH: FWI{FDHVDU_FLSKHU_LV_HDV}
\`\`\`

**Hints:**
- Try different shift values (1-25)
- The flag format is CTF{...}
- Common English words should appear in the decrypted text`,
          tries: 456,
          solved_count: 234,
          created_at: "2024-01-14T15:30:00Z"
        }
      };

      const challengeData = mockChallenges[id as keyof typeof mockChallenges];
      if (challengeData) {
        setChallenge(challengeData);
      } else {
        toast({
          title: "Challenge not found",
          description: "The requested challenge could not be found",
          variant: "destructive",
        });
        navigate("/challenges");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      toast({
        title: "Error",
        description: "Failed to load challenge",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit flags",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!flag.trim()) {
      toast({
        title: "Flag required",
        description: "Please enter a flag before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      // Mock flag validation - in real app this would be server-side
      const correctFlags = {
        "1": "CTF{buffer_overflow_basics}",
        "2": "CTF{caesar_cipher_is_easy}"
      };

      const isCorrect = flag.trim() === correctFlags[id as keyof typeof correctFlags];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isCorrect) {
        setSubmitResult({
          correct: true,
          message: `Congratulations! You've successfully solved this challenge and earned ${challenge?.points} points!`
        });
        setAlreadySolved(true);
        
        // Update challenge stats (mock)
        if (challenge) {
          setChallenge({
            ...challenge,
            solved_count: challenge.solved_count + 1,
            tries: challenge.tries + 1
          });
        }

        toast({
          title: "Challenge Solved! 🎉",
          description: `You earned ${challenge?.points} points!`,
        });
      } else {
        setSubmitResult({
          correct: false,
          message: "Incorrect flag. Try again!"
        });
        
        // Update tries count (mock)
        if (challenge) {
          setChallenge({
            ...challenge,
            tries: challenge.tries + 1
          });
        }
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would download from secure storage
    toast({
      title: "Download started",
      description: "Challenge file is being downloaded",
    });
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
          <div className="text-center">Loading challenge...</div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Challenge not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/challenges")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Challenges
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getLevelColor(challenge.level)}>
                        {challenge.level}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(challenge.category)}>
                        {challenge.category}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold">{challenge.title}</h1>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{challenge.points}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{challenge.solved_count} solved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{challenge.tries} tries</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4" />
                    <span>Created {new Date(challenge.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Challenge Description */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {challenge.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Section */}
            {challenge.file_url && (
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleDownload} className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download Challenge Files</span>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Download the challenge files to get started. File size: ~2.5 MB
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Flag Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="h-5 w-5" />
                  <span>Submit Flag</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alreadySolved ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Challenge already solved! You've earned {challenge.points} points.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmitFlag} className="space-y-4">
                    <div>
                      <Label htmlFor="flag">Flag</Label>
                      <Textarea
                        id="flag"
                        placeholder="Enter your flag here (e.g., CTF{flag_content})"
                        value={flag}
                        onChange={(e) => setFlag(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    {submitResult && (
                      <Alert className={submitResult.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                        {submitResult.correct ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription className={submitResult.correct ? "text-green-800" : "text-red-800"}>
                          {submitResult.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit" disabled={submitting || alreadySolved} className="w-full">
                      {submitting ? "Submitting..." : "Submit Flag"}
                    </Button>
                    
                    {!user && (
                      <p className="text-sm text-muted-foreground text-center">
                        <span>Please </span>
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="text-primary hover:underline"
                        >
                          log in
                        </button>
                        <span> to submit flags</span>
                      </p>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Challenge Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Attempts</span>
                  <span className="font-medium">{challenge.tries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Successful Solves</span>
                  <span className="font-medium">{challenge.solved_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">
                    {challenge.tries > 0 ? Math.round((challenge.solved_count / challenge.tries) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge className={getLevelColor(challenge.level)}>
                    {challenge.level}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;