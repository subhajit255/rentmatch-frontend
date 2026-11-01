export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface MetricCard {
  id: string;
  value: number;
  label: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

export interface PropertyType {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Property {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  featured?: boolean;
}

export interface NavigationItem {
  id: string;
  url: string;
  label: string;
  icon: string;
  active?: boolean;
  hasNotification?: boolean;
}