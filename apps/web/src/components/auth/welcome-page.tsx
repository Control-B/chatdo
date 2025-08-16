"use client";

import { Button } from "../ui/button";
import { MessageSquare, Users, Zap, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };
  const features = [
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description: "Instant messaging with real-time updates and notifications",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Create channels and collaborate with your team seamlessly",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with modern technologies for optimal performance",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security to keep your conversations safe",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-accent-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Welcome to ChatDO
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              A modern chat platform built for Digital Ocean developers and
              teams. Connect, collaborate, and build amazing things together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-8 py-3"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="text-base px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background-card border border-border-primary rounded-lg p-6 text-center hover:bg-background-hover transition-colors"
            >
              <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon size={24} className="text-accent-blue" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-tertiary text-sm">
            © 2024 ChatDO. Built with ❤️ for the Digital Ocean community.
          </p>
        </div>
      </div>
    </div>
  );
}
