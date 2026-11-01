import { User, MetricCard, PropertyType, Property } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Indrant Sen',
  email: 'indrant.sen@example.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  status: 'online',
};

export const mockMetrics: MetricCard[] = [
  {
    id: '1',
    value: 24,
    label: 'Recent Properties',
    icon: 'Building',
    color: 'blue',
  },
  {
    id: '2',
    value: 6,
    label: 'Connection Request',
    icon: 'Users',
    color: 'green',
  },
  {
    id: '3',
    value: 3,
    label: 'Guest Preference',
    icon: 'Heart',
    color: 'purple',
  },
  {
    id: '4',
    value: 12,
    label: 'New Messages',
    icon: 'MessageSquare',
    color: 'orange',
  },
  {
    id: '5',
    value: 1,
    label: 'Schedule Visit',
    icon: 'Calendar',
    color: 'indigo',
  },
  {
    id: '6',
    value: 1,
    label: 'Query Feedback',
    icon: 'HelpCircle',
    color: 'red',
  },
];

export const mockPropertyTypes: PropertyType[] = [
  {
    id: '1',
    name: 'Apartment',
    icon: 'Building',
    count: 245,
  },
  {
    id: '2',
    name: 'House',
    icon: 'Home',
    count: 189,
  },
  {
    id: '3',
    name: 'Green Flat',
    icon: 'TreePine',
    count: 67,
  },
  {
    id: '4',
    name: 'Duplex',
    icon: 'Building2',
    count: 124,
  },
  {
    id: '5',
    name: 'Villa',
    icon: 'Castle',
    count: 89,
  },
  {
    id: '6',
    name: 'Office',
    icon: 'Briefcase',
    count: 156,
  },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa Lomas de Mazthal Machua',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    price: 2500,
    location: 'Downtown, California',
    rating: 4.8,
    reviews: 24,
    featured: true,
  },
  {
    id: '2',
    title: 'Casa Limas de Mazthal Machua',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    price: 1800,
    location: 'Beverly Hills, California',
    rating: 4.9,
    reviews: 18,
    featured: true,
  },
  {
    id: '3',
    title: 'Casa Lomas de Mazthal Machua',
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    price: 3200,
    location: 'Manhattan, New York',
    rating: 4.7,
    reviews: 31,
    featured: true,
  },
  {
    id: '4',
    title: 'Casa Lomas de Mazthal Machua',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    price: 2800,
    location: 'Miami Beach, Florida',
    rating: 4.6,
    reviews: 22,
    featured: true,
  },
];