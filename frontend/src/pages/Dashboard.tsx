import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, User, BookOpen, Trophy, ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const phoneNumber = localStorage.getItem("studentPhone");
    if (!phoneNumber) {
      navigate("/");
    }
  }, [navigate]);

  const grades = Array.from({ length: 9 }, (_, i) => `Grade ${i + 1}`);
  
  const subjects = [
    "Mathematics",
    "English",
    "Kiswahili",
    "Science",
    "Social Studies",
    "CRE (Christian Religious Education)",
    "IRE (Islamic Religious Education)",
    "Home Science"
  ];

  const canStartQuiz = selectedGrade && selectedSubject;

  const handleStartQuiz = () => {
    if (canStartQuiz) {
      localStorage.setItem("currentGrade", selectedGrade);
      localStorage.setItem("currentSubject", selectedSubject);
      navigate("/quiz");
    }
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("studentPhone");
    navigate("/");
  };

  const phoneNumber = localStorage.getItem("studentPhone");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <h1 className="text-2xl font-bold text-white">LearnEasy Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                📱 {phoneNumber}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfile}
                className="text-white hover:bg-white/20"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Ready to Learn?</h2>
            <p className="text-muted-foreground text-lg">Choose your grade and subject to start a quiz</p>
          </div>

          {/* Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Grade Selection */}
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Choose Your Grade
                </CardTitle>
                <CardDescription>
                  Select the grade level you're currently studying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade} className="text-lg">
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Subject Selection */}
            <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-secondary" />
                  Choose Subject
                </CardTitle>
                <CardDescription>
                  Pick a subject to practice and improve your skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="text-lg">
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Start Section */}
          <Card className="bg-gradient-card shadow-strong">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Start Your Quiz</h3>
                <p className="text-muted-foreground">
                  {canStartQuiz 
                    ? `Ready to test your knowledge in ${selectedSubject} for ${selectedGrade}?`
                    : "Please select both grade and subject to begin"
                  }
                </p>
              </div>
              
              <Button 
                onClick={handleStartQuiz}
                variant="hero"
                size="lg"
                disabled={!canStartQuiz}
                className="text-lg px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-success-light/20 border-success-light">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">12</div>
                <div className="text-sm text-success-foreground">Quizzes Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary-light/20 border-secondary-light">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">850</div>
                <div className="text-sm text-secondary-foreground">Total Points</div>
              </CardContent>
            </Card>
            <Card className="bg-primary-light/20 border-primary-light">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-primary-foreground">Average Score</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;