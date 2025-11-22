"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ModeToggle } from '@/components/ThemeSwitcher';
import { SparklesIcon } from '@/components/icons/SparklesIcon';
import { ReportModal } from '@/components/modals/ReportModal';
import { AboutModal } from '@/components/modals/AboutModal';
import { ResourcesModal } from '@/components/modals/ResourcesModal';
import { StatisticsModal } from '@/components/modals/StatisticsModal';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const Header: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'report' | 'about' | 'resources' | 'stats' | null>(null);

  return (
    <>
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-brand-primary-500" />
              <Link href="/" className="text-2xl font-bold text-foreground">
                HistoPath
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
                
                {/* Dashboard - Only visible when signed in */}
                <SignedIn>
                  <Link 
                    href="/dashboard" 
                    className="text-muted-foreground hover:text-brand-primary-600 transition-colors cursor-pointer"
                  >
                    Dashboard
                  </Link>
                </SignedIn>

                <button 
                  onClick={() => setActiveModal('stats')} 
                  className="text-muted-foreground hover:text-brand-primary-600 transition-colors cursor-pointer"
                >
                  Statistics
                </button>
                <button 
                  onClick={() => setActiveModal('report')} 
                  className="text-muted-foreground hover:text-brand-primary-600 transition-colors cursor-pointer"
                >
                  Report
                </button>
                <button 
                  onClick={() => setActiveModal('resources')} 
                  className="text-muted-foreground hover:text-brand-primary-600 transition-colors cursor-pointer"
                >
                  Resources
                </button>
                <button 
                  onClick={() => setActiveModal('about')} 
                  className="text-muted-foreground hover:text-brand-primary-600 transition-colors cursor-pointer"
                >
                  About
                </button>
              </nav>

              <div className="h-6 w-px bg-border hidden sm:block" />
              
              <ModeToggle />

              {/* Authentication Controls */}
              <div className="flex items-center pl-2">
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button size="sm">Sign In</Button>
                  </SignInButton>
                </SignedOut>
              </div>

            </div>
          </div>
        </div>
      </header>

      <ReportModal isOpen={activeModal === 'report'} onClose={() => setActiveModal(null)} />
      <AboutModal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} />
      <ResourcesModal isOpen={activeModal === 'resources'} onClose={() => setActiveModal(null)} />
      <StatisticsModal isOpen={activeModal === 'stats'} onClose={() => setActiveModal(null)} />
    </>
  );
};