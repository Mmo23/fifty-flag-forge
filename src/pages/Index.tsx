import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Shield, Trophy, Users, Target, Zap, BookOpen, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalChallenges: 156,
    activeChallenges: 12,
    totalSolves: 8943
  });

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

  const features = [
    {
      icon: Shield,
      title: "Reverse Engineering",
      description: "Dissect binaries and uncover hidden secrets",
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "Cryptography",
      description: "Break codes and master encryption techniques",
      color: "text-purple-500"
    },
    {
      icon: Target,
      title: "Digital Forensics",
      description: "Investigate digital crime scenes and recover evidence",
      color: "text-green-500"
    },
    {
      icon: BookOpen,
      title: "OSINT",
      description: "Gather intelligence from open sources",
      color: "text-orange-500"
    },
    {
      icon: Trophy,
      title: "Network Security",
      description: "Secure and attack network infrastructures",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Mobile Security",
      description: "Exploit mobile applications and devices",
      color: "text-cyan-500"
    }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Security Analyst",
      content: "CTFifty helped me land my dream job in cybersecurity. The challenges are practical and industry-relevant.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Penetration Tester",
      content: "The progressive difficulty and instant feedback make learning enjoyable. Best CTF platform I've used.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header user={user} onAuthStateChange={() => {}} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Master <span className="text-gradient">Cybersecurity</span> Through Practice
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of security professionals honing their skills with hands-on CTF challenges across 6 specialized categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/challenges">
                    Continue Learning <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/challenges">View Challenges</Link>
                  </Button>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-muted-foreground">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalChallenges}</div>
                <div className="text-muted-foreground">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.activeChallenges}</div>
                <div className="text-muted-foreground">New This Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalSolves.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Solves</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Six Specialized Categories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From reverse engineering to mobile security, master every aspect of cybersecurity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-ctf transition-all duration-300 border-gradient">
                <CardContent className="p-6">
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Security Professionals</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Security Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join CTFifty today and start solving challenges that will advance your cybersecurity career.
          </p>
          {!user && (
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8" />
                <span className="text-2xl font-bold">CTFifty</span>
              </div>
              <p className="text-white/80">
                The premier platform for cybersecurity education through hands-on challenges.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/challenges" className="hover:text-white">Challenges</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
                <li><Link to="/learn" className="hover:text-white">Learn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/compete" className="hover:text-white">Competitions</Link></li>
                <li><Link to="/jobs" className="hover:text-white">Job Board</Link></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 CTFifty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
