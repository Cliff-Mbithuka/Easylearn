import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Trophy, BookOpen, Star, Target, Award } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  
  const phoneNumber = localStorage.getItem("studentPhone");
  const lastQuizScore = localStorage.getItem("lastQuizScore");
  const lastQuizTotal = localStorage.getItem("lastQuizTotal");

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/");
    }
  }, [phoneNumber, navigate]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleStartNewQuiz = () => {
    navigate("/dashboard");
  };

  // Mock data (in real app, this would come from backend)
  const profileData = {
    totalQuizzes: 12,
    totalPoints: 850,
    averageScore: 85,
    currentGrade: "Grade 7",
    subjectsCompleted: 5,
    achievements: [
      { name: "First Quiz", icon: Trophy, earned: true },
      { name: "Mathematics Master", icon: Target, earned: true },
      { name: "Science Explorer", icon: Star, earned: false },
      { name: "Perfect Score", icon: Award, earned: false }
    ],
    recentQuizzes: [
      { subject: "Mathematics", score: 4, total: 5, date: "Today" },
      { subject: "English", score: 5, total: 5, date: "Yesterday" },
      { subject: "Science", score: 3, total: 5, date: "2 days ago" }
    ]
  };

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
                onClick={handleBackToDashboard}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-white">Student Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="shadow-strong mb-8 bg-gradient-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Student Profile</h2>
                    <p className="text-muted-foreground flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {phoneNumber}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {profileData.currentGrade}
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleStartNewQuiz} variant="hero" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Latest Quiz Result */}
          {lastQuizScore && lastQuizTotal && (
            <Card className="shadow-medium mb-8 border-l-4 border-l-success">
              <CardHeader>
                <CardTitle className="flex items-center text-success">
                  <Trophy className="w-5 h-5 mr-2" />
                  Latest Quiz Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {lastQuizScore}/{lastQuizTotal}
                    </p>
                    <p className="text-muted-foreground">
                      {Math.round((parseInt(lastQuizScore) / parseInt(lastQuizTotal)) * 100)}% Score
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Just Completed!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-success-light/10 border-success">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-success">{profileData.totalQuizzes}</div>
                <div className="text-sm text-muted-foreground">Quizzes Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-secondary-light/10 border-secondary">
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary">{profileData.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </CardContent>
            </Card>
            <Card className="bg-primary-light/10 border-primary">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{profileData.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>
            <Card className="bg-warning/10 border-warning">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-warning">{profileData.subjectsCompleted}</div>
                <div className="text-sm text-muted-foreground">Subjects Attempted</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Achievements */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-warning" />
                  Achievements
                </CardTitle>
                <CardDescription>Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned 
                        ? "bg-gradient-primary text-white" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        achievement.earned ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {achievement.name}
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Quizzes */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Recent Quizzes
                </CardTitle>
                <CardDescription>Your latest quiz attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.recentQuizzes.map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{quiz.subject}</div>
                      <div className="text-sm text-muted-foreground">{quiz.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{quiz.score}/{quiz.total}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((quiz.score / quiz.total) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;