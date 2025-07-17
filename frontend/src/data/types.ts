/**
 * EXPENSESINK Landing Page Data Types
 * Clean TypeScript interfaces for all landing page content
 */

import { LucideIcon } from 'lucide-react';

export interface FeatureData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
  color: string;
  hoverColor: string;
  demoContent?: {
    title: string;
    description: string;
    visual: React.ReactNode;
  };
}

export interface TestimonialData {
  id: string;
  quote: string;
  author: string;
  role: string;
  university?: string;
  avatar?: string;
  rating: number;
  verified: boolean;
}

export interface DashboardScreenData {
  id: string;
  title: string;
  mainValue: string;
  subtitle: string;
  insight: string;
  chart: 'spending' | 'categories' | 'trends' | 'health';
  color: 'green' | 'blue' | 'purple' | 'emerald';
}

export interface CategoryData {
  id: string;
  name: string;
  amount: number;
  icon: LucideIcon;
  color: string;
}

export interface TrustIndicatorData {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  description: string;
}

export interface UniversityPartnerData {
  id: string;
  name: string;
  logo: string;
  studentCount: number;
}
