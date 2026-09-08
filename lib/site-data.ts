import {
  Anchor,
  Hammer,
  Camera,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  Wrench,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const company = {
  name: 'Ocean Tune',
  legalName: 'Ocean Tune Private Limited',
  tagline: 'Practical Solutions for Modern Maldives',
  address: 'H Dh Nellaidhoo, Maldives',
  phone: '+960 966 6469',
  email: 'info@oceantune.com',
  description:
    'A Maldivian company providing practical solutions across multiple industries — from marine supplies and construction to design, printing, and digital support.',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
};

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: LucideIcon;
  image: string;
  features: string[];
};

export const services: Service[] = [
  {
    slug: 'marine-spare-parts',
    title: 'Marine Spare Parts',
    shortDescription:
      'Quality spare parts, maintenance supplies, and technical support for Yamaha, Suzuki, and Mercury outboard engines.',
    longDescription:
      'We supply reliable marine spare parts and maintenance essentials for outboard engines. Our team provides expert technical consultation to keep your vessels running smoothly in Maldivian waters.',
    icon: Anchor,
    image:
      'https://images.pexels.com/photos/9592461/pexels-photo-9592461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: [
      'OEM spare parts',
      'Engine oil',
      'Filters',
      'Spark plugs',
      'Technical consultation',
    ],
  },
  {
    slug: 'construction-services',
    title: 'Construction Services',
    shortDescription:
      'From masonry and renovations to complete finishing work — building with confidence.',
    longDescription:
      'Our construction team handles everything from masonry and renovations to complete finishing work. We deliver quality craftsmanship for residential and commercial property improvements.',
    icon: Hammer,
    image:
      'https://images.pexels.com/photos/15798782/pexels-photo-15798782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: [
      'Masonry',
      'Renovations',
      'Finishing work',
      'Property improvements',
    ],
  },
  {
    slug: 'photography-printing',
    title: 'Photography & Printing',
    shortDescription:
      'Professional printing services for photos, events, and businesses — transform moments into memories.',
    longDescription:
      'We offer professional photo printing, custom products, and business printing services. From event materials to custom prints, we help you preserve moments and promote your brand.',
    icon: Camera,
    image:
      'https://images.pexels.com/photos/7014874/pexels-photo-7014874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: [
      'Photo printing',
      'Custom products',
      'Business printing',
      'Event materials',
    ],
  },
  {
    slug: 'administrative-support',
    title: 'Administrative Support',
    shortDescription:
      'Helping individuals and businesses navigate online services and administrative processes.',
    longDescription:
      'We simplify digital services for individuals and businesses. From form assistance and online accounts to data entry and digital payment support, we make administrative processes hassle-free.',
    icon: MonitorSmartphone,
    image:
      'https://images.pexels.com/photos/8296975/pexels-photo-8296975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: [
      'Form assistance',
      'Online accounts',
      'Data entry',
      'Digital payment support',
    ],
  },
  {
    slug: 'graphic-web-design',
    title: 'Graphic & Web Design',
    shortDescription:
      'Professional graphic design and web solutions that help businesses communicate and grow.',
    longDescription:
      'Our creative team delivers professional graphic design and web solutions. From flyers and brochures to branding and website design, we help your business stand out and connect with customers.',
    icon: Palette,
    image:
      'https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    features: [
      'Flyers',
      'Brochures',
      'Branding',
      'Website design',
    ],
  },
];

export type CarouselSlide = {
  title: string;
  headline: string;
  description: string;
  image: string;
  icon: LucideIcon;
};

export const carouselSlides: CarouselSlide[] = [
  {
    title: 'Marine Spare Parts',
    headline: 'Reliable Marine Spare Parts',
    description:
      'Quality spare parts, maintenance supplies, and technical support for Yamaha, Suzuki, and Mercury outboard engines.',
    image:
      'https://images.pexels.com/photos/9592461/pexels-photo-9592461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Anchor,
  },
  {
    title: 'Construction Services',
    headline: 'Building with Confidence',
    description:
      'From masonry and renovations to complete finishing work.',
    image:
      'https://images.pexels.com/photos/15798782/pexels-photo-15798782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Hammer,
  },
  {
    title: 'Photography & Printing',
    headline: 'Transform Moments into Memories',
    description:
      'Professional printing services for photos, events, and businesses.',
    image:
      'https://images.pexels.com/photos/7014874/pexels-photo-7014874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Camera,
  },
  {
    title: 'Administrative Support',
    headline: 'Digital Services Made Simple',
    description:
      'Helping individuals and businesses navigate online services and administrative processes.',
    image:
      'https://images.pexels.com/photos/8296975/pexels-photo-8296975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: MonitorSmartphone,
  },
  {
    title: 'Graphic & Web Design',
    headline: 'Creative Designs That Connect',
    description:
      'Professional graphic design and web solutions that help businesses communicate and grow.',
    image:
      'https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    icon: Palette,
  },
];

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyChooseFeatures: Feature[] = [
  {
    title: 'Local Expertise',
    description:
      'Understanding the needs of Maldivian communities and businesses.',
    icon: Users,
  },
  {
    title: 'Reliable Service',
    description:
      'Focused on quality, professionalism, and customer satisfaction.',
    icon: ShieldCheck,
  },
  {
    title: 'Diverse Solutions',
    description:
      'Multiple services available through a single trusted provider.',
    icon: Sparkles,
  },
];

export type PortfolioItem = {
  title: string;
  category: string;
  description: string;
  image: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'Outboard Engine Supply',
    category: 'Marine',
    description: 'Complete spare parts kit for Yamaha outboard engines delivered to a local resort.',
    image:
      'https://images.pexels.com/photos/30094170/pexels-photo-30094170.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Island Property Renovation',
    category: 'Construction',
    description: 'Full renovation and finishing of a residential property in Nellaidhoo.',
    image:
      'https://images.pexels.com/photos/37352217/pexels-photo-37352217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Event Photography Print Run',
    category: 'Printing',
    description: 'Large-format photo printing and event materials for a corporate gathering.',
    image:
      'https://images.pexels.com/photos/716272/pexels-photo-716272.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Resort Brand Identity',
    category: 'Design',
    description: 'Complete brand package including logo, brochures, and promotional flyers.',
    image:
      'https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Business Website Launch',
    category: 'Web',
    description: 'Modern responsive website for a local marine transport company.',
    image:
      'https://images.pexels.com/photos/326516/pexels-photo-326516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Building Restoration',
    category: 'Construction',
    description: 'Facade restoration and plaster work for a commercial building.',
    image:
      'https://images.pexels.com/photos/30415240/pexels-photo-30415240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export const portfolioCategories = ['All', 'Marine', 'Construction', 'Printing', 'Design', 'Web'];

export type Value = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const companyValues: Value[] = [
  {
    title: 'Reliability',
    description: 'We deliver on our promises, every time. Our customers count on us for dependable products and consistent service.',
    icon: ShieldCheck,
  },
  {
    title: 'Quality',
    description: 'We hold ourselves to high standards, ensuring every product and service meets professional benchmarks.',
    icon: Sparkles,
  },
  {
    title: 'Professionalism',
    description: 'Our team approaches every project with expertise, respect, and a commitment to doing the job right.',
    icon: Wrench,
  },
  {
    title: 'Customer Focus',
    description: 'We listen to our customers, understand their needs, and tailor solutions that genuinely help them succeed.',
    icon: Users,
  },
];

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export const footerLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Our Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
];
