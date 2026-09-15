export const defaultSettings: Record<string, string> = {
  // Hero
  'hero.headline': 'Practical Solutions for Modern Maldives',
  'hero.headlineAccent': 'Modern Maldives',
  'hero.description':
    'From marine supplies and construction services to design, printing, and digital support, Ocean Tune helps individuals and businesses get things done.',

  // Home — Services section
  'home.services.eyebrow': 'What We Do',
  'home.services.title': 'Our Services',
  'home.services.description':
    'Five core service areas designed to support individuals and businesses across the Maldives.',
  'home.services.ctaTitle': 'Need something else?',
  'home.services.ctaDescription':
    "We offer more than what's listed here. Reach out and let's talk.",
  'home.services.ctaButton': 'Contact Us',

  // Home — Why Choose
  'home.why.eyebrow': 'Why Choose Us',
  'home.why.title': 'Why Choose Ocean Tune',
  'home.why.description': 'We combine local knowledge with professional service to deliver real value.',

  // Home — Featured Work
  'home.work.eyebrow': 'Our Work',
  'home.work.title': 'Featured Projects',
  'home.work.description':
    "A glimpse of the work we've delivered across marine, construction, printing, design, and web.",
  'home.work.button': 'View Full Portfolio',

  // Home — Contact CTA
  'home.cta.title': 'Ready to Get Started?',
  'home.cta.description':
    'Contact us today to discuss your requirements and discover how Ocean Tune can help.',
  'home.cta.buttonPrimary': 'Contact Us',

  // Home — Brands
  'home.brands.label': 'Brands We Work With',

  // About page
  'about.hero.title': 'About Ocean Tune',
  'about.hero.description':
    'A Maldivian company committed to delivering dependable products and professional services across the islands.',
  'about.overview.image': 'https://images.pexels.com/photos/2245278/pexels-photo-2245278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'about.overview.eyebrow': 'Company Overview',
  'about.overview.title': 'Serving Individuals & Businesses Across the Maldives',
  'about.overview.paragraph1':
    'is a Maldivian company providing practical solutions across multiple industries. We serve individuals, businesses, and organizations through reliable products and professional services.',
  'about.overview.paragraph2':
    'From marine spare parts and construction to photography, printing, and digital services, Ocean Tune is your trusted partner for getting things done — efficiently and professionally.',
  'about.mission': 'Deliver dependable products and services that create value for customers.',
  'about.vision': 'Become a trusted service provider throughout the Maldives.',
  'about.values.eyebrow': 'Our Values',
  'about.values.title': 'What Drives Us',
  'about.values.description': 'The principles that guide every decision we make and every service we deliver.',

  // Contact page
  'contact.hero.title': 'Contact Us',
  'contact.hero.description':
    "Have a question or need a quote? Send us a message and we'll get back to you as soon as possible.",
  'contact.heading': 'Get in Touch',
  'contact.intro':
    'Whether you need marine spare parts, construction services, printing, or digital support, our team is ready to help. Reach out using any of the methods below.',
  'contact.hours': 'Sun — Thu: 8:00 AM — 6:00 PM',
  'contact.formHeading': 'Send Us a Message',
  'contact.formDescription': "Fill out the form below and we'll respond within one business day.",

  // Services page
  'services.hero.title': 'Our Services',
  'services.hero.description':
    'Professional services designed to support individuals and businesses across the Maldives.',

  // Portfolio page
  'portfolio.hero.title': 'Our Portfolio',
  'portfolio.hero.description':
    'A selection of completed work across marine, construction, printing, design, and web.',
  'portfolio.categories': 'All,Marine,Construction,Printing,Design,Web',

  // Theme & branding
  'theme.primary': '#0A335C',
  'theme.secondary': '#1DA5A5',
  'brand.logoImage': '',
  'footer.copyright': '',
};

export const settingsGroups: Record<string, { label: string; keys: [string, string][] }> = {
  Hero: {
    label: 'Homepage Hero',
    keys: [
      ['hero.headline', 'Headline'],
      ['hero.headlineAccent', 'Headline accent (gradient text)'],
      ['hero.description', 'Description'],
    ],
  },
  'Home — Services Section': {
    label: 'Home — Services Section',
    keys: [
      ['home.services.eyebrow', 'Eyebrow'],
      ['home.services.title', 'Title'],
      ['home.services.description', 'Description'],
      ['home.services.ctaTitle', 'CTA card title'],
      ['home.services.ctaDescription', 'CTA card description'],
      ['home.services.ctaButton', 'CTA card button label'],
    ],
  },
  'Home — Why Choose': {
    label: 'Home — Why Choose Us',
    keys: [
      ['home.why.eyebrow', 'Eyebrow'],
      ['home.why.title', 'Title'],
      ['home.why.description', 'Description'],
    ],
  },
  'Home — Featured Work': {
    label: 'Home — Featured Work',
    keys: [
      ['home.work.eyebrow', 'Eyebrow'],
      ['home.work.title', 'Title'],
      ['home.work.description', 'Description'],
      ['home.work.button', 'Button label'],
    ],
  },
  'Home — CTA Banner': {
    label: 'Home — CTA Banner',
    keys: [
      ['home.cta.title', 'Title'],
      ['home.cta.description', 'Description'],
      ['home.cta.buttonPrimary', 'Primary button label'],
    ],
  },
  'Home — Brands': {
    label: 'Home — Brands',
    keys: [['home.brands.label', 'Section label']],
  },
  'About Page': {
    label: 'About Page',
    keys: [
      ['about.hero.title', 'Hero title'],
      ['about.hero.description', 'Hero description'],
      ['about.overview.image', 'Overview image URL'],
      ['about.overview.eyebrow', 'Overview eyebrow'],
      ['about.overview.title', 'Overview title'],
      ['about.overview.paragraph1', 'Overview paragraph 1 (starts with legal name)'],
      ['about.overview.paragraph2', 'Overview paragraph 2'],
      ['about.mission', 'Our Mission'],
      ['about.vision', 'Our Vision'],
      ['about.values.eyebrow', 'Values eyebrow'],
      ['about.values.title', 'Values title'],
      ['about.values.description', 'Values description'],
    ],
  },
  'Contact Page': {
    label: 'Contact Page',
    keys: [
      ['contact.hero.title', 'Hero title'],
      ['contact.hero.description', 'Hero description'],
      ['contact.heading', 'Section heading'],
      ['contact.intro', 'Intro paragraph'],
      ['contact.hours', 'Business hours'],
      ['contact.formHeading', 'Form heading'],
      ['contact.formDescription', 'Form description'],
    ],
  },
  'Services Page': {
    label: 'Services Page',
    keys: [
      ['services.hero.title', 'Hero title'],
      ['services.hero.description', 'Hero description'],
    ],
  },
  'Portfolio Page': {
    label: 'Portfolio Page',
    keys: [
      ['portfolio.hero.title', 'Hero title'],
      ['portfolio.hero.description', 'Hero description'],
      ['portfolio.categories', 'Categories (comma separated)'],
    ],
  },
  Theme: {
    label: 'Theme & Branding',
    keys: [
      ['theme.primary', 'Primary color'],
      ['theme.secondary', 'Secondary color'],
      ['brand.logoImage', 'Logo image URL (replaces the built-in logo)'],
      ['footer.copyright', 'Footer copyright text (optional)'],
    ],
  },
};