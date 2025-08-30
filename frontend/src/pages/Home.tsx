import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to continue",
        variant: "destructive"
      });
      return;
    }

    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    // Store phone number in localStorage (in real app, this would authenticate with backend)
    localStorage.setItem("studentPhone", phoneNumber);
    navigate("/dashboard");
  };

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Engaging quizzes aligned with Kenyan curriculum"
    },
    {
      icon: Users,
      title: "Grade-Specific Content",
      description: "Tailored content for Grades 1-9"
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Monitor your learning journey and achievements"
    },
    {
      icon: Star,
      title: "Subject Mastery",
      description: "Master all key subjects at your own pace"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-secondary">LearnEasy</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Your interactive learning companion for mastering the Kenyan curriculum. 
            Join thousands of students improving their grades!
          </p>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="bg-card/95 backdrop-blur-sm shadow-strong border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">Get Started</CardTitle>
              <CardDescription className="text-base">
                Enter your phone number to access your learning dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button 
                onClick={handleLogin}
                variant="hero"
                size="lg"
                className="w-full h-12 text-lg font-semibold"
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/95 backdrop-blur-sm border-0 shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-medium">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">8</div>
              <div className="text-muted-foreground">Subjects Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">95%</div>
              <div className="text-muted-foreground">Grade Improvement</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;