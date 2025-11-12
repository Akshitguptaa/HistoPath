"use client";

import React from 'react';
import { ModeToggle } from '@/components/ThemeSwitcher';
import { SparklesIcon } from '@/components/icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-8 w-8 text-brand-primary-500" />
            <h1 className="text-2xl font-bold text-foreground">
              Histopath
            </h1>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};