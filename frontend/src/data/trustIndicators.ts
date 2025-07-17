/**
 * EXPENSESINK Trust Indicators & Stats
 * Social proof data for building credibility
 */

import { Users, Shield, TrendingUp, Heart, Star, CheckCircle } from 'lucide-react';
import { TrustIndicatorData } from './types';

export const trustIndicatorsData: TrustIndicatorData[] = [
  {
    id: 'active-students',
    label: 'Active Students',
    value: '12,000+',
    icon: Users,
    description: 'Students actively using EXPENSESINK worldwide'
  },
  {
    id: 'money-saved',
    label: 'Money Saved',
    value: '$2.4M+',
    icon: TrendingUp,
    description: 'Total amount saved by our student community'
  },
  {
    id: 'satisfaction-rate',
    label: 'Love Rate',
    value: '98%',
    icon: Heart,
    description: 'Students who say EXPENSESINK reduced their financial stress'
  },
  {
    id: 'security-rating',
    label: 'Security Score',
    value: 'A+',
    icon: Shield,
    description: 'Bank-level encryption and privacy protection'
  },
  {
    id: 'app-rating',
    label: 'App Rating',
    value: '4.9/5',
    icon: Star,
    description: 'Average rating from student reviews'
  },
  {
    id: 'universities',
    label: 'Universities',
    value: '150+',
    icon: CheckCircle,
    description: 'Universities where students use EXPENSESINK'
  }
];

export const universityLogos = [
  'MIT', 'Harvard', 'Stanford', 'Berkeley', 'NYU', 'BU', 'Columbia', 'Yale'
];
