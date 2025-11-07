import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Users, MapPin, Calendar, Star, ArrowRight, Trophy, Heart, Shield, TrendingUp, Globe, Award, CheckCircle, Play } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: 'Find Your Perfect Sports Partner',
      description: 'Match with players based on skill level, location, and sports preferences.'
    },
    {
      icon: MapPin,
      title: 'Location-Based Matching',
      description: 'Discover sports events and partners in your local area and while traveling.'
    },
    {
      icon: Calendar,
      title: 'Easy Event Organization',
      description: 'Create and manage sports events with flexible scheduling and participant management.'
    },
    {
      icon: Trophy,
      title: 'Skill-Based Matching',
      description: 'Connect with players at your skill level for fair and enjoyable games.'
    },
    {
      icon: Heart,
      title: 'Build Lasting Connections',
      description: 'Form genuine friendships and expand your social circle through sports.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure Platform',
      description: 'Verified profiles and secure communication for peace of mind.'
    }
  ];

  const popularSports = [
    { name: 'Basketball', icon: '🏀', players: '2.3M+' },
    { name: 'Soccer', icon: '⚽', players: '1.8M+' },
    { name: 'Tennis', icon: '🎾', players: '1.2M+' },
    { name: 'Running', icon: '🏃', players: '3.1M+' },
    { name: 'Swimming', icon: '🏊', players: '980K+' },
    { name: 'Volleyball', icon: '🏐', players: '750K+' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Tennis Player',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      quote: 'I found my regular tennis partner through Sports Buddy. We play twice a week now and have become great friends!'
    },
    {
      name: 'Mike Chen',
      role: 'Basketball Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      quote: 'The skill-based matching is perfect. I always find players at my level for competitive games.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Running Group Leader',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      quote: 'Organizing running events has never been easier. I have a regular group of 15+ runners now!'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  World's Largest Sports Matching Platform
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Find Your Perfect{' '}
                  <span className="text-primary">Sports Buddy</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Connect with millions of players worldwide. Match based on skill level, location, and sports preferences. Build lasting friendships through the power of sports.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => onNavigate('register')} className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5M+</div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100K+</div>
                  <div className="text-sm text-muted-foreground">Events Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Sports</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1710301431051-ee6923af04aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBwZW9wbGUlMjBwbGF5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU3ODU0NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="People playing sports together"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-xl shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">New Match!</div>
                    <div className="text-sm text-muted-foreground">Basketball in Central Park</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-background p-4 rounded-xl shadow-lg border">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Sports</h2>
            <p className="text-lg text-muted-foreground">Join millions of players in these popular sports</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularSports.map((sport) => (
              <Card key={sport.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{sport.icon}</div>
                  <h3 className="font-semibold mb-2">{sport.name}</h3>
                  <p className="text-sm text-muted-foreground">{sport.players} players</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Sports Buddy?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge technology to help you make genuine, meaningful connections through sports
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Getting started is simple and fun</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Sports</h3>
              <p className="text-muted-foreground">Select the sports you're interested in and set your skill level for each</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Matched</h3>
              <p className="text-muted-foreground">Our algorithm finds the perfect partners based on your preferences and location</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Start Playing</h3>
              <p className="text-muted-foreground">Connect with your matches and start playing sports together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Players Say</h2>
            <p className="text-lg text-muted-foreground">Join thousands of satisfied Sports Buddy users</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <ImageWithFallback
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Badge variant="secondary" className="mb-4">
                Making a Difference
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Building a Healthier, More Connected World
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sports Buddy isn't just about finding partners—it's about creating a global community where everyone has access to the physical and social benefits of sports.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: CheckCircle, text: 'Connect with players in 150+ countries' },
                  { icon: Globe, text: 'Support for 50+ different sports and activities' },
                  { icon: Award, text: 'Verified profiles and safety features' },
                  { icon: TrendingUp, text: 'Growing community of 5M+ active users' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
              
              <Button size="lg" onClick={() => onNavigate('register')}>
                Join the Movement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1761039808115-77b271985e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb21tdW5pdHklMjB0ZWFtfGVufDF8fHx8MTc2MjMyNjg2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Sports community"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <Card className="p-6 text-center bg-primary text-primary-foreground">
                    <div className="text-3xl font-bold mb-2">98%</div>
                    <p className="text-sm opacity-90">User Satisfaction</p>
                  </Card>
                </div>
                <div className="space-y-4 pt-8">
                  <Card className="p-6 text-center bg-secondary">
                    <div className="text-3xl font-bold mb-2">100K+</div>
                    <p className="text-sm text-muted-foreground">Monthly Events</p>
                  </Card>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1522898467493-49726bf28798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMGZpdG5lc3MlMjB3b3Jrb3V0fGVufDF8fHx8MTc2MjI3MzAzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Fitness community"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Your Safety First
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Built on Trust & Safety</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We take your security seriously with industry-leading safety features and verification systems
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Profile Verification</h3>
              <p className="text-muted-foreground">
                All profiles go through a comprehensive verification process to ensure authenticity
              </p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Guidelines</h3>
              <p className="text-muted-foreground">
                Clear guidelines and active moderation keep our community safe and welcoming
              </p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rating System</h3>
              <p className="text-muted-foreground">
                Build trust through our transparent rating and review system after every event
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* App Features Showcase */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1658953229625-aad99d7603b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYyMzE3NDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sports Buddy App Interface"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              
              {/* Floating Feature Card */}
              <Card className="absolute -right-6 bottom-12 p-4 shadow-xl border-2 max-w-xs bg-background/95 backdrop-blur">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Match Found!</div>
                    <p className="text-sm text-muted-foreground">You've been matched with 3 tennis partners nearby</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Badge variant="secondary" className="mb-4">
                Powerful Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need in One App
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Smart Matching Algorithm',
                    description: 'Our AI-powered system finds the perfect partners based on your preferences, skill level, and location'
                  },
                  {
                    title: 'Real-time Chat',
                    description: 'Connect instantly with your matches through our built-in messaging system'
                  },
                  {
                    title: 'Event Management',
                    description: 'Create, join, and manage sports events with ease. Track attendance and send updates'
                  },
                  {
                    title: 'Progress Tracking',
                    description: 'Monitor your sports activities, achievements, and connections over time'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-foreground font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Find Your Sports Buddy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of players and start building meaningful connections through sports today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => onNavigate('register')}
              className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Matching Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onNavigate('login')}
              className="text-lg px-8 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-lg"
            >
              I Already Have an Account
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}