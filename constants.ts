import { Lead, ChartData, Property, ClosedDeal, Agent, Integration, PipelineStage } from './types';

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', mobile: '+1 (555) 123-4567', status: 'New Lead', value: 450000, lastContact: '2023-10-25', source: 'Website', assignedAgent: 'Unassigned', tags: ['First-time Buyer', 'Urgent'] },
  { id: '2', name: 'Bob Smith', email: 'bob.smith@corp.com', mobile: '+1 (555) 234-5678', status: 'Contacted', value: 1200000, lastContact: '2023-10-24', source: 'Referral', assignedAgent: 'Sarah Connor', tags: ['Cash Buyer', 'Investor'] },
  { id: '3', name: 'Charlie Brown', email: 'charlie@gmail.com', mobile: '+1 (555) 345-6789', status: 'Qualified', value: 350000, lastContact: '2023-10-22', source: 'Zillow', assignedAgent: 'John Doe', tags: ['Pre-approved'] },
  { id: '4', name: 'Diana Prince', email: 'diana@themyscira.net', mobile: '+1 (555) 456-7890', status: 'Lost', value: 850000, lastContact: '2023-10-20', source: 'LinkedIn', assignedAgent: 'Sarah Connor', tags: ['Relocation'] },
  { id: '5', name: 'Evan Wright', email: 'evan@wright.com', mobile: '+1 (555) 567-8901', status: 'New Lead', value: 600000, lastContact: '2023-10-26', source: 'Website', assignedAgent: 'Unassigned', tags: [] },
  { id: '6', name: 'Fiona Gallagher', email: 'fiona@chicago.com', mobile: '+1 (555) 678-9012', status: 'Proposal Sent', value: 250000, lastContact: '2023-10-27', source: 'Open House', assignedAgent: 'Mike Ross', tags: ['Fixer Upper'] },
  { id: '7', name: 'George Martin', email: 'george@books.com', mobile: '+1 (555) 789-0123', status: 'New Lead', value: 950000, lastContact: '2023-10-28', source: 'Website', assignedAgent: 'Unassigned', tags: ['Luxury'] },
  { id: '8', name: 'Hannah Montana', email: 'hannah@music.com', mobile: '+1 (555) 890-1234', status: 'Negotiation', value: 3200000, lastContact: '2023-10-29', source: 'Referral', assignedAgent: 'Emily Rose', tags: ['VIP', 'Cash Buyer'] },
  { id: '9', name: 'Ian Malcolm', email: 'ian@chaos.com', mobile: '+1 (555) 901-2345', status: 'New Lead', value: 750000, lastContact: '2023-10-30', source: 'Zillow', assignedAgent: 'Unassigned', tags: [] },
  { id: '10', name: 'Jack Sparrow', email: 'jack@pearl.com', mobile: '+1 (555) 012-3456', status: 'Lost', value: 150000, lastContact: '2023-10-31', source: 'Social Media', assignedAgent: 'Kyle Reese', tags: ['Investor'] },
  { id: '11', name: 'Kara Thrace', email: 'kara@galactica.com', mobile: '+1 (555) 123-9876', status: 'Qualified', value: 550000, lastContact: '2023-11-01', source: 'Website', assignedAgent: 'Sarah Connor', tags: ['Military'] },
];

export const MOCK_CHART_DATA: ChartData[] = [
  { name: 'Jan', value: 400, revenue: 2400 },
  { name: 'Feb', value: 300, revenue: 1398 },
  { name: 'Mar', value: 200, revenue: 9800 },
  { name: 'Apr', value: 278, revenue: 3908 },
  { name: 'May', value: 189, revenue: 4800 },
  { name: 'Jun', value: 239, revenue: 3800 },
  { name: 'Jul', value: 349, revenue: 4300 },
];

const SAMPLE_DOCS = [
  { id: '1', name: 'Property Disclosure', type: 'PDF' as const, size: '2.4 MB', url: '#' },
  { id: '2', name: 'Floor Plan', type: 'JPG' as const, size: '1.1 MB', url: '#' },
  { id: '3', name: 'HOA Bylaws', type: 'PDF' as const, size: '4.5 MB', url: '#' },
];

const SAMPLE_OPEN_HOUSES = [
  { id: '1', date: '2023-11-05', start: '10:00 AM', end: '2:00 PM', host: 'Sarah Connor' },
  { id: '2', date: '2023-11-12', start: '11:00 AM', end: '3:00 PM', host: 'Mike Ross' },
];

export const MOCK_PROPERTIES: Property[] = [
  { 
    id: '1', 
    address: '123 Maple Dr, Beverly Hills', 
    price: 2500000, 
    status: 'Active', 
    beds: 4, 
    baths: 3.5, 
    sqft: 3200, 
    image: 'https://picsum.photos/400/300?random=1',
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102',
      'https://picsum.photos/800/600?random=103',
    ],
    agent: 'Sarah Connor',
    type: 'Single Family',
    yearBuilt: 2018,
    lotSize: 8500,
    garage: 3,
    description: "Stunning modern estate with panoramic views of the city. Features an open floor plan, chef's kitchen, and resort-style backyard with pool and spa.",
    amenities: ['Pool', 'Spa', 'City View', 'Smart Home', 'Gated', 'Wine Cellar'],
    taxes: 25000,
    hoaFees: 450,
    documents: SAMPLE_DOCS,
    openHouses: SAMPLE_OPEN_HOUSES,
    location: { lat: 34.0736, lng: -118.4004 }
  },
  { 
    id: '2', 
    address: '456 Oak Ln, Santa Monica', 
    price: 1800000, 
    status: 'Pending', 
    beds: 3, 
    baths: 2, 
    sqft: 1800, 
    image: 'https://picsum.photos/400/300?random=2',
    images: [
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=201',
      'https://picsum.photos/800/600?random=202',
    ],
    agent: 'Mike Ross',
    type: 'Condo',
    yearBuilt: 2020,
    lotSize: 0,
    garage: 2,
    description: "Luxury condo steps from the beach. Floor-to-ceiling windows, high-end finishes, and private balcony.",
    amenities: ['Ocean View', 'Gym', 'Concierge', 'Rooftop Deck'],
    taxes: 18000,
    hoaFees: 1200,
    documents: [SAMPLE_DOCS[1]],
    openHouses: [],
    location: { lat: 34.0195, lng: -118.4912 }
  },
  { 
    id: '3', 
    address: '789 Pine St, Malibu', 
    price: 5500000, 
    status: 'Active', 
    beds: 5, 
    baths: 5, 
    sqft: 4500, 
    image: 'https://picsum.photos/400/300?random=3',
    images: ['https://picsum.photos/800/600?random=3'],
    agent: 'Sarah Connor',
    type: 'Single Family',
    yearBuilt: 2015,
    lotSize: 15000,
    garage: 4,
    description: "Exclusive beachfront property with private access to the sand. Expansive decks for entertaining and watching the sunset.",
    amenities: ['Beach Access', 'Gated', 'Guest House', 'Home Theater', 'Elevator'],
    taxes: 55000,
    hoaFees: 0,
    documents: SAMPLE_DOCS,
    openHouses: [SAMPLE_OPEN_HOUSES[0]],
    location: { lat: 34.0259, lng: -118.7798 }
  },
  { 
    id: '4', 
    address: '101 Palm Ave, Venice', 
    price: 1200000, 
    status: 'Sold', 
    beds: 2, 
    baths: 2, 
    sqft: 1200, 
    image: 'https://picsum.photos/400/300?random=4',
    images: ['https://picsum.photos/800/600?random=4'],
    agent: 'Sarah Connor',
    type: 'Townhouse',
    yearBuilt: 2010,
    lotSize: 2000,
    garage: 1,
    description: "Charming townhouse in the heart of Venice. Walk to Abbot Kinney shops and restaurants.",
    amenities: ['Hardwood Floors', 'Fireplace', 'Patio'],
    taxes: 12000,
    hoaFees: 300,
    documents: [],
    openHouses: [],
    location: { lat: 33.9850, lng: -118.4695 }
  },
  { 
    id: '5', 
    address: '555 Sunset Blvd, West Hollywood', 
    price: 3200000, 
    status: 'Active', 
    beds: 3, 
    baths: 3, 
    sqft: 2800, 
    image: 'https://picsum.photos/400/300?random=5',
    images: ['https://picsum.photos/800/600?random=5'],
    agent: 'Emily Rose',
    type: 'Condo',
    yearBuilt: 2022,
    lotSize: 0,
    garage: 2,
    description: "Penthouse living at its finest. Private elevator access, wrap-around terrace, and world-class amenities.",
    amenities: ['City View', 'Concierge', 'Pool', 'Gym', 'Valet'],
    taxes: 32000,
    hoaFees: 1500,
    documents: [],
    openHouses: [],
    location: { lat: 34.0900, lng: -118.3617 }
  },
  { 
    id: '6', 
    address: '888 Canyon Rd, Topanga', 
    price: 1950000, 
    status: 'Pending', 
    beds: 4, 
    baths: 3, 
    sqft: 2600, 
    image: 'https://picsum.photos/400/300?random=6',
    images: ['https://picsum.photos/800/600?random=6'],
    agent: 'Kyle Reese',
    type: 'Single Family',
    yearBuilt: 1985,
    lotSize: 45000,
    garage: 2,
    description: "Secluded retreat in the canyon. Surrounded by nature, this home features vaulted ceilings and a large deck.",
    amenities: ['Mountain View', 'Hiking Trails', 'Privacy', 'Spa'],
    taxes: 19500,
    hoaFees: 0,
    documents: [],
    openHouses: [],
    location: { lat: 34.0919, lng: -118.6028 }
  }
];

export const MOCK_CLOSED_DEALS: ClosedDeal[] = [
  {
    id: '1',
    propertyAddress: '101 Palm Ave, Venice',
    propertyImage: 'https://picsum.photos/400/300?random=4',
    salePrice: 1200000,
    commission: 36000, // 3%
    agent: { name: 'Sarah Connor', image: undefined },
    listedDate: '2023-08-15',
    soldDate: '2023-10-05',
    daysOnMarket: 51,
    buyerName: 'Tech Corp LLC'
  },
  {
    id: '2',
    propertyAddress: '321 Silver Lake Blvd',
    propertyImage: 'https://picsum.photos/400/300?random=12',
    salePrice: 1650000,
    commission: 49500,
    agent: { name: 'Mike Ross', image: undefined },
    listedDate: '2023-09-01',
    soldDate: '2023-09-28',
    daysOnMarket: 27,
    buyerName: 'Jane & John Doe'
  },
  {
    id: '3',
    propertyAddress: '987 Hilltop Dr, Hollywood',
    propertyImage: 'https://picsum.photos/400/300?random=15',
    salePrice: 2800000,
    commission: 84000,
    agent: { name: 'Emily Rose', image: undefined },
    listedDate: '2023-07-10',
    soldDate: '2023-10-01',
    daysOnMarket: 83,
    buyerName: 'Star Ventures'
  },
  {
    id: '4',
    propertyAddress: '55 Ocean View, Malibu',
    propertyImage: 'https://picsum.photos/400/300?random=18',
    salePrice: 5500000,
    commission: 137500, // 2.5%
    agent: { name: 'Sarah Connor', image: undefined },
    listedDate: '2023-05-15',
    soldDate: '2023-09-15',
    daysOnMarket: 123,
    buyerName: 'Private Trust'
  },
  {
    id: '5',
    propertyAddress: '777 Downtown Loft',
    propertyImage: 'https://picsum.photos/400/300?random=20',
    salePrice: 850000,
    commission: 25500,
    agent: { name: 'Kyle Reese', image: undefined },
    listedDate: '2023-09-10',
    soldDate: '2023-10-12',
    daysOnMarket: 32,
    buyerName: 'Young Professional'
  }
];

export const MOCK_AGENTS: Agent[] = [
  { 
    id: '1', 
    name: 'Sarah Connor', 
    email: 'sarah@prestige.com', 
    role: 'Senior Agent', 
    status: 'Active', 
    phone: '+1 (555) 001-2345',
    licenseNumber: 'CA-DRE #01928374',
    bio: 'Top-producing agent with over 10 years of experience in the luxury market. Sarah specializes in high-end estates in Beverly Hills and Bel Air, consistently ranking in the top 1% of agents nationwide.',
    languages: ['English', 'Spanish'],
    specialties: ['Luxury Homes', 'Relocation', 'Investments'],
    joinedDate: '2015-03-15',
    social: { linkedin: '#', instagram: '#', website: 'www.sarahconnor.com' },
    stats: { 
      leads: 45, 
      deals: 12, 
      revenue: 5200000, 
      rating: 4.9,
      newLeads: 8,
      appointments: 3,
      dealsThisMonth: 2
    }
  },
  { 
    id: '2', 
    name: 'Mike Ross', 
    email: 'mike@prestige.com', 
    role: 'Sales Associate', 
    status: 'Active',
    phone: '+1 (555) 002-3456',
    licenseNumber: 'CA-DRE #02837465',
    bio: 'Mike brings a fresh perspective to real estate with his background in corporate law. He is known for his negotiation skills and data-driven approach to pricing properties in competitive markets.',
    languages: ['English'],
    specialties: ['Condos', 'First-time Buyers', 'Downtown LA'],
    joinedDate: '2019-06-20',
    social: { linkedin: '#', instagram: '#' },
    stats: { 
      leads: 28, 
      deals: 8, 
      revenue: 2100000, 
      rating: 4.7,
      newLeads: 5,
      appointments: 1,
      dealsThisMonth: 1
    }
  },
  { 
    id: '3', 
    name: 'Kyle Reese', 
    email: 'kyle@prestige.com', 
    role: 'Sales Associate', 
    status: 'Away',
    phone: '+1 (555) 003-4567',
    licenseNumber: 'CA-DRE #03746582',
    bio: 'A specialist in the coastal markets, Kyle has a deep understanding of the unique zoning and lifestyle factors of beach communities. He helps clients find their perfect seaside retreat.',
    languages: ['English', 'German'],
    specialties: ['Beachfront', 'Vacation Rentals', 'Santa Monica'],
    joinedDate: '2020-01-10',
    social: { linkedin: '#' },
    stats: { 
      leads: 15, 
      deals: 3, 
      revenue: 850000, 
      rating: 4.5,
      newLeads: 2,
      appointments: 0,
      dealsThisMonth: 0
    }
  },
  { 
    id: '4', 
    name: 'Emily Rose', 
    email: 'emily@prestige.com', 
    role: 'Listing Specialist', 
    status: 'Active',
    phone: '+1 (555) 004-5678',
    licenseNumber: 'CA-DRE #04657391',
    bio: 'Emily is a marketing powerhouse. Her listing strategies involve high-end production video, social media campaigns, and international reach to ensure properties get maximum exposure.',
    languages: ['English', 'French', 'Mandarin'],
    specialties: ['Seller Representation', 'Luxury Marketing', 'Staging'],
    joinedDate: '2018-11-05',
    social: { linkedin: '#', instagram: '#', website: 'www.emilyrose.realty' },
    stats: { 
      leads: 32, 
      deals: 9, 
      revenue: 3400000, 
      rating: 4.8,
      newLeads: 12,
      appointments: 4,
      dealsThisMonth: 3
    }
  },
  { 
    id: '5', 
    name: 'John Doe', 
    email: 'john@prestige.com', 
    role: 'Manager', 
    status: 'Inactive',
    phone: '+1 (555) 005-6789',
    licenseNumber: 'CA-DRE #05748392',
    bio: 'With 20 years in the industry, John now manages the team, mentoring new agents and overseeing compliance. He ensures every transaction meets the highest standards of integrity.',
    languages: ['English'],
    specialties: ['Management', 'Compliance', 'Training'],
    joinedDate: '2010-02-01',
    stats: { 
      leads: 5, 
      deals: 25, 
      revenue: 8900000, 
      rating: 5.0,
      newLeads: 0,
      appointments: 1,
      dealsThisMonth: 0
    }
  },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'mls', name: 'MLS Connection', icon: 'Database', status: 'DISCONNECTED', description: 'Sync property data directly from your local MLS provider.' },
  { id: 'gmail', name: 'Gmail', icon: 'Mail', status: 'CONNECTED', description: 'Sync emails and contacts.' },
  { id: 'cal', name: 'Google Calendar', icon: 'Calendar', status: 'CONNECTED', description: 'Sync appointments and showings.' },
  { id: 'docu', name: 'DocuSign', icon: 'FileSignature', status: 'DISCONNECTED', description: 'Send and sign contracts digitally.' },
];

export const DEFAULT_PIPELINE: PipelineStage[] = [
  { id: 'new', name: 'New Lead', color: 'bg-blue-500', order: 1 },
  { id: 'contacted', name: 'Contacted', color: 'bg-yellow-500', order: 2 },
  { id: 'qualified', name: 'Qualified', color: 'bg-green-500', order: 3 },
  { id: 'proposal', name: 'Proposal Sent', color: 'bg-purple-500', order: 4 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500', order: 5 },
  { id: 'closed', name: 'Closed Won', color: 'bg-emerald-600', order: 6 },
];