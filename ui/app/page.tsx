"use client";

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ArrowRight, CheckCircle2, Brain, Zap, Shield, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">AI-Powered Histopathology Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Advanced Cancer Detection <br />
              <span className="text-primary">Made Simple</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload histopathology images and get instant AI-powered analysis with confidence scores and interactive heatmaps.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/analyze">
                <Button size="lg" className="text-base">
                  Start Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-base">
                  View Dashboard
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-xl mx-auto">
              <Stat value="85%" label="Accuracy" />
              <Stat value="<1s" label="Analysis Time" />
              <Stat value="24/7" label="Available" />
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Key Features
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need for accurate histopathology analysis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="AI-Powered Analysis"
                description="Deep learning models trained on extensive histopathology datasets for precise cancer detection."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Instant Results"
                description="Get analysis results in seconds with detailed confidence scores and visual heatmaps."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Secure & Private"
                description="Your data is processed securely with industry-standard encryption and privacy practices."
              />
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  How It Works
                </h2>
                <p className="text-muted-foreground">
                  Simple and efficient analysis in three steps
                </p>
              </div>

              <div className="space-y-12">
                <ProcessStep
                  number="1"
                  title="Upload Image"
                  description="Upload your histopathology slide image in PNG, JPG, or TIFF format"
                />
                <ProcessStep
                  number="2"
                  title="AI Analysis"
                  description="Our AI model analyzes the image and generates predictions with confidence scores"
                />
                <ProcessStep
                  number="3"
                  title="Review Results"
                  description="Get instant results with heatmap visualization and chat with our AI assistant"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start analyzing histopathology images with AI-powered precision today.
              </p>
              <Link href="/analyze">
                <Button size="lg" className="text-base">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-foreground">HistoPath AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Advanced AI-powered histopathology analysis for rapid, accurate cancer detection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/analyze" className="text-muted-foreground hover:text-foreground transition-colors">Analysis</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2025 HistoPath AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <CheckCircle2 className="w-6 h-6 text-primary mt-3 hidden sm:block" />
    </div>
  );
}