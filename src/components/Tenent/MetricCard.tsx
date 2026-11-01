import React from 'react';
import { 
  Building, 
  Users, 
  Heart, 
  MessageSquare, 
  Calendar, 
  HelpCircle 
} from 'lucide-react';
import { MetricCard as MetricCardType } from '../types';

interface MetricCardProps {
  metric: MetricCardType;
}

const iconMap = {
  Building,
  Users,
  Heart,
  MessageSquare,
  Calendar,
  HelpCircle,
};

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
};

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const IconComponent = iconMap[metric.icon as keyof typeof iconMap];
  const colorClasses = colorMap[metric.color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${colorClasses}`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};