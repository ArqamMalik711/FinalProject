import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Reviews.css';

// Mock data to simulate reviews from carwow
const carMakes = [
  { id: 'audi', name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/1200px-Audi-Logo_2016.svg.png' },
  { id: 'bmw', name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1200px-BMW.svg.png' },
  { id: 'ford', name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1920px-Ford_logo_flat.svg.png' },
  { id: 'hyundai', name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/1920px-Hyundai_Motor_Company_logo.svg.png' },
  { id: 'kia', name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/KIA_logo3.svg/1920px-KIA_logo3.svg.png' },
  { id: 'mercedes', name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/1200px-Mercedes-Logo.svg.png' },
  { id: 'toyota', name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/1920px-Toyota.svg.png' },
  { id: 'volkswagen', name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Volkswagen_Logo_till_1995.svg/2048px-Volkswagen_Logo_till_1995.svg.png' }
];


const carModelsData = {
  audi: [
    { id: 'a1', name: 'A1 Sportback' },
    { id: 'a3', name: 'A3' },
    { id: 'a4', name: 'A4' },
    { id: 'q3', name: 'Q3' },
    { id: 'q5', name: 'Q5' }
  ],
  bmw: [
    { id: '1-series', name: '1 Series' },
    { id: '3-series', name: '3 Series' },
    { id: '5-series', name: '5 Series' },
    { id: 'x3', name: 'X3' },
    { id: 'x5', name: 'X5' }
  ],
  ford: [
    { id: 'fiesta', name: 'Fiesta' },
    { id: 'focus', name: 'Focus' },
    { id: 'kuga', name: 'Kuga' },
    { id: 'mustang', name: 'Mustang' },
    { id: 'puma', name: 'Puma' }
  ],
  hyundai: [
    { id: 'i10', name: 'i10' },
    { id: 'i20', name: 'i20' },
    { id: 'i30', name: 'i30' },
    { id: 'tucson', name: 'Tucson' },
    { id: 'ioniq-5', name: 'IONIQ 5' }
  ],
  kia: [
    { id: 'ceed', name: 'Ceed' },
    { id: 'sportage', name: 'Sportage' },
    { id: 'ev6', name: 'EV6' },
    { id: 'picanto', name: 'Picanto' },
    { id: 'niro', name: 'Niro' }
  ],
  mercedes: [
    { id: 'a-class', name: 'A-Class' },
    { id: 'c-class', name: 'C-Class' },
    { id: 'e-class', name: 'E-Class' },
    { id: 'gla', name: 'GLA' },
    { id: 'glc', name: 'GLC' }
  ],
  toyota: [
    { id: 'yaris', name: 'Yaris' },
    { id: 'corolla', name: 'Corolla' },
    { id: 'rav4', name: 'RAV4' },
    { id: 'yaris-cross', name: 'Yaris Cross' },
    { id: 'aygo-x', name: 'Aygo X' }
  ],
  volkswagen: [
    { id: 'golf', name: 'Golf' },
    { id: 'polo', name: 'Polo' },
    { id: 'tiguan', name: 'Tiguan' },
    { id: 't-roc', name: 'T-Roc' },
    { id: 'id3', name: 'ID.3' }
  ]
};

// Expanded mock review data for all car models
const mockReviews = {
  // BMW models
  'bmw-1-series': [
    {
      id: 21,
      title: 'BMW 1 Series',
      image: 'https://carwow-uk-wp-3.imgix.net/BMW-1-Series-front.jpg',
      rating: 8.4,
      date: 'April 18, 2023',
      body: 'The BMW 1 Series is a premium family hatchback that offers a great driving experience, potent engines, and a high-quality interior. It stands out for its sporty handling and refined driving dynamics.',
      pros: [
        'Excellent handling',
        'Strong engine lineup',
        'Quality interior',
        'Great infotainment system'
      ],
      cons: [
        'Not as spacious as some rivals',
        'Firm ride with larger wheels',
        'Some features should be standard'
      ],
      author: {
        name: 'Chris Davies',
        role: 'Automotive Expert',
        avatar: 'https://i.pravatar.cc/300?img=11'
      }
    }
  ],
  'bmw-3-series': [
    {
      id: 1,
      title: 'BMW 3 Series',
      image: 'https://carwow-uk-wp-3.imgix.net/BMW-3-Series-front-1.jpg',
      rating: 8.5,
      date: 'May 15, 2023',
      body: 'The BMW 3 Series is a compact executive car that offers an engaging driving experience combined with a comfortable ride, efficient engines, and a premium cabin. While it\'s not the cheapest option, its strong resale values help offset the initial cost.',
      pros: [
        'Great to drive',
        'Efficient engines',
        'Premium interior quality',
        'Spacious cabin for its class'
      ],
      cons: [
        'Alternatives have more standard equipment',
        'Pricier than mainstream rivals',
        'Some features should be standard at this price'
      ],
      author: {
        name: 'Matt Robinson',
        role: 'Senior Reviewer',
        avatar: 'https://i.pravatar.cc/300?img=1'
      }
    },
    {
      id: 2,
      title: 'BMW 3 Series Touring',
      image: 'https://carwow-uk-wp-3.imgix.net/BMW-3-Series-Touring-front.jpg',
      rating: 8.2,
      date: 'June 3, 2023',
      body: 'The BMW 3 Series Touring adds practicality to the already excellent 3 Series package. It offers a spacious, premium interior and a boot that\'s big enough for most family needs. The driving experience remains engaging, while the ride comfort is well-balanced.',
      pros: [
        'More practical than the saloon',
        'Drives almost as well as the sedan',
        'High-quality interior',
        'Efficient engine options'
      ],
      cons: [
        'Mercedes C-Class Estate has a bigger boot',
        'Options quickly become expensive',
        'Firm ride with larger wheels'
      ],
      author: {
        name: 'Sophie Hart',
        role: 'Content Editor',
        avatar: 'https://i.pravatar.cc/300?img=5'
      }
    }
  ],
  'bmw-5-series': [
    {
      id: 22,
      title: 'BMW 5 Series',
      image: 'https://carwow-uk-wp-3.imgix.net/BMW-5-Series-front-angle.jpg',
      rating: 9.1,
      date: 'March 12, 2023',
      body: 'The BMW 5 Series stands as one of the best executive sedans on the market, offering an impeccable blend of comfort, driving dynamics, technology, and prestige. It\'s a thoroughly well-rounded package that\'s difficult to fault.',
      pros: [
        'Exceptional comfort and refinement',
        'Technology-rich interior',
        'Impressive range of engines',
        'Handles remarkably well for its size'
      ],
      cons: [
        'Options quickly add up',
        'Not quite as cosseting as a Mercedes E-Class',
        'Plug-in hybrids sacrifice some boot space'
      ],
      author: {
        name: 'Thomas Greene',
        role: 'Chief Road Tester',
        avatar: 'https://i.pravatar.cc/300?img=15'
      }
    }
  ],
  'bmw-x3': [
    {
      id: 23,
      title: 'BMW X3',
      image: 'https://carwow-uk-wp-3.imgix.net/BMW-X3-front.jpg',
      rating: 8.8,
      date: 'January 25, 2023',
      body: 'The BMW X3 is a premium mid-size SUV that offers a compelling blend of practicality, driving enjoyment, and upscale interior quality. It strikes a good balance between comfort and sportiness, making it a top choice in its class.',
      pros: [
        'Sharp handling for an SUV',
        'Spacious and well-built interior',
        'Strong and efficient engines',
        'Good standard equipment'
      ],
      cons: [
        'Firmer ride than some rivals',
        'Can get expensive with options',
        'Not the most distinctive design'
      ],
      author: {
        name: 'Rebecca Moore',
        role: 'SUV Specialist',
        avatar: 'https://i.pravatar.cc/300?img=25'
      }
    }
  ],
  'bmw-x5': [
    {
      id: 24,
      title: 'BMW X5',
      image: 'https://carwow-uk-wp-3.imgix.net/BMW-X5-front.jpg',
      rating: 9.0,
      date: 'February 8, 2023',
      body: 'The BMW X5 is a luxury SUV that impresses with its blend of comfort, space, technology, and driving dynamics. It offers a premium experience in every area, from its sophisticated interior to its powerful engine lineup.',
      pros: [
        'Luxurious and tech-filled cabin',
        'Excellent powertrain options',
        'Comfortable yet surprisingly agile',
        'Practical and versatile interior'
      ],
      cons: [
        'Gets expensive with options',
        'Third-row seats are tight',
        'Some rivals offer more off-road capability'
      ],
      author: {
        name: 'Andrew Collins',
        role: 'Luxury Vehicle Expert',
        avatar: 'https://i.pravatar.cc/300?img=18'
      }
    }
  ],
  
  // Ford models
  'ford-fiesta': [
    {
      id: 25,
      title: 'Ford Fiesta',
      image: 'https://carwow-uk-wp-3.imgix.net/ford-fiesta-front-1.jpg',
      rating: 8.1,
      date: 'April 5, 2023',
      body: 'The Ford Fiesta remains one of the best small hatchbacks on the market, offering an exceptional driving experience, stylish design, and practical features. Despite its compact size, it feels grown-up and refined.',
      pros: [
        'Class-leading driving dynamics',
        'Efficient engines',
        'Good tech for the class',
        'Comfortable interior'
      ],
      cons: [
        'Not the most spacious in its class',
        'Some cheap interior materials',
        'Basic entry models lack features'
      ],
      author: {
        name: 'Laura Johnson',
        role: 'Small Car Specialist',
        avatar: 'https://i.pravatar.cc/300?img=32'
      }
    }
  ],
  'ford-focus': [
    {
      id: 3,
      title: 'Ford Focus',
      image: 'https://carwow-uk-wp-3.imgix.net/focus-tracker-front-1.jpg',
      rating: 8.0,
      date: 'April 12, 2023',
      body: 'The Ford Focus is a fun-to-drive family hatchback with a good amount of space for passengers and a decent boot. Its engines are economical and the interior quality has improved significantly over previous generations, though some rivals still feel more premium inside.',
      pros: [
        'Fun to drive',
        'Roomy interior',
        'Economical engines',
        'Good infotainment system'
      ],
      cons: [
        'Some rivals feel more premium inside',
        'Automatic gearbox can be hesitant',
        'ST model isn\'t as exciting as some hot hatches'
      ],
      author: {
        name: 'David Smith',
        role: 'Automotive Expert',
        avatar: 'https://i.pravatar.cc/300?img=8'
      }
    }
  ],
  'ford-kuga': [
    {
      id: 26,
      title: 'Ford Kuga',
      image: 'https://carwow-uk-wp-3.imgix.net/ford-kuga-front-1.jpg',
      rating: 8.2,
      date: 'March 18, 2023',
      body: 'The Ford Kuga is a practical and comfortable family SUV that offers good value for money. The plug-in hybrid version offers impressive electric range and economy, while all models retain Ford\'s trademark engaging driving experience.',
      pros: [
        'Comfortable and practical',
        'Efficient PHEV option',
        'Good to drive for an SUV',
        'Well-equipped for the price'
      ],
      cons: [
        'Interior quality isn\'t class-leading',
        'Infotainment not as slick as some rivals',
        'PHEV has reduced boot space'
      ],
      author: {
        name: 'Mark Wilson',
        role: 'Family Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=33'
      }
    }
  ],
  'ford-mustang': [
    {
      id: 27,
      title: 'Ford Mustang',
      image: 'https://carwow-uk-wp-3.imgix.net/ford-mustang-front-1.jpg',
      rating: 7.9,
      date: 'January 30, 2023',
      body: 'The Ford Mustang delivers an authentic American muscle car experience with its dramatic styling and powerful V8 engine. While it\'s not the most sophisticated sports car, its character, performance, and value make it an attractive proposition.',
      pros: [
        'Characterful V8 engine',
        'Head-turning looks',
        'Relatively good value',
        'Practical for a sports car'
      ],
      cons: [
        'Interior quality falls short of European rivals',
        'Handling not as precise as some competitors',
        'High running costs'
      ],
      author: {
        name: 'Richard Hammond',
        role: 'Performance Car Specialist',
        avatar: 'https://i.pravatar.cc/300?img=22'
      }
    }
  ],
  'ford-puma': [
    {
      id: 28,
      title: 'Ford Puma',
      image: 'https://carwow-uk-wp-3.imgix.net/ford-puma-front.jpg',
      rating: 8.6,
      date: 'February 14, 2023',
      body: 'The Ford Puma is one of the best small SUVs on the market, combining practicality with the fun driving characteristics Ford is known for. Its innovative features like the MegaBox storage solution make it stand out in a crowded segment.',
      pros: [
        'Best-in-class driving experience',
        'Clever MegaBox boot feature',
        'Mild hybrid technology improves economy',
        'Sharp styling'
      ],
      cons: [
        'Rear space is tight for taller adults',
        'Some cheap-feeling interior materials',
        'ST-Line models have firm suspension'
      ],
      author: {
        name: 'Sarah Miller',
        role: 'Compact SUV Expert',
        avatar: 'https://i.pravatar.cc/300?img=29'
      }
    }
  ],

  // Hyundai models
  'hyundai-tucson': [
    {
      id: 4,
      title: 'Hyundai Tucson',
      image: 'https://carwow-uk-wp-3.imgix.net/Hyundai-Tucson-front-1.jpg',
      rating: 9.0,
      date: 'March 10, 2023',
      body: 'The Hyundai Tucson stands out with its bold styling and offers a practical, high-tech interior that competes with more premium rivals. The hybrid options provide good performance with low running costs, and the overall package represents excellent value for money.',
      pros: [
        'Eye-catching looks',
        'Spacious and practical interior',
        'Impressive hybrid options',
        'Excellent warranty'
      ],
      cons: [
        'Base model lacks some features',
        'Not as fun to drive as a Ford Kuga',
        'Some touch-sensitive controls can be fiddly'
      ],
      author: {
        name: 'James Taylor',
        role: 'Lead Reviewer',
        avatar: 'https://i.pravatar.cc/300?img=12'
      }
    }
  ],

  // Volkswagen models
  'volkswagen-golf': [
    {
      id: 5,
      title: 'Volkswagen Golf',
      image: 'https://carwow-uk-wp-3.imgix.net/Volkswagen-Golf-front-quarter.jpg',
      rating: 8.7,
      date: 'February 22, 2023',
      body: 'The Volkswagen Golf continues to be a benchmark in the family hatchback class. It combines a comfortable ride with secure handling, a range of efficient engines, and a well-built, spacious interior. The infotainment system has some ergonomic issues, but overall it\'s a highly accomplished car.',
      pros: [
        'Comfortable and refined',
        'Efficient engines',
        'High-quality interior',
        'Spacious for passengers'
      ],
      cons: [
        'Frustrating touch-sensitive controls',
        'Some rivals are more fun to drive',
        'Not as affordable as it once was'
      ],
      author: {
        name: 'Emma Johnson',
        role: 'Content Writer',
        avatar: 'https://i.pravatar.cc/300?img=23'
      }
    }
  ],

  // Hyundai - expand with all models
  'hyundai-i10': [
    {
      id: 29,
      title: 'Hyundai i10',
      image: 'https://carwow-uk-wp-3.imgix.net/hyundai-i10-front.jpg',
      rating: 8.3,
      date: 'January 15, 2023',
      body: 'The Hyundai i10 is a small city car that punches above its weight, offering impressive interior space, good equipment levels and refined driving manners. It\'s one of the most grown-up feeling cars in its class, despite its compact dimensions.',
      pros: [
        'Spacious for its size',
        'Well-equipped across the range',
        'Refined and comfortable ride',
        'Easy to drive and park'
      ],
      cons: [
        'Some cheap-feeling interior materials',
        'Not as fun to drive as some rivals',
        'Base engine feels underpowered'
      ],
      author: {
        name: 'Jessica Taylor',
        role: 'City Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=26'
      }
    }
  ],
  'hyundai-i20': [
    {
      id: 30,
      title: 'Hyundai i20',
      image: 'https://carwow-uk-wp-3.imgix.net/hyundai-i20-front.jpg',
      rating: 8.5,
      date: 'February 3, 2023',
      body: 'The Hyundai i20 is a well-rounded supermini that offers plenty of equipment, a spacious interior, and decent value for money. The latest version has striking styling and improved technology that helps it compete with the best in its class.',
      pros: [
        'Bold, distinctive styling',
        'Lots of standard equipment',
        'Spacious interior and good boot',
        'Long warranty'
      ],
      cons: [
        'Not as fun to drive as a Ford Fiesta',
        'Interior design feels a bit busy',
        'Some rivals feel more premium inside'
      ],
      author: {
        name: 'Michael Chen',
        role: 'Car Reviewer',
        avatar: 'https://i.pravatar.cc/300?img=27'
      }
    }
  ],
  'hyundai-i30': [
    {
      id: 31,
      title: 'Hyundai i30',
      image: 'https://carwow-uk-wp-3.imgix.net/hyundai-i30-front.jpg',
      rating: 7.9,
      date: 'March 5, 2023',
      body: 'The Hyundai i30 is a practical and sensible family hatchback that offers good value, a long warranty and decent equipment levels. While not the most exciting option in its class, it\'s a solid all-rounder that\'s easy to live with day-to-day.',
      pros: [
        'Comfortable ride quality',
        'Well-equipped for the price',
        'Practical interior space',
        '5-year unlimited mileage warranty'
      ],
      cons: [
        'Not as engaging to drive as rivals',
        'Interior feels durable but not premium',
        'Infotainment not as slick as some competitors'
      ],
      author: {
        name: 'Robert Wilson',
        role: 'Family Car Specialist',
        avatar: 'https://i.pravatar.cc/300?img=28'
      }
    }
  ],
  'hyundai-ioniq-5': [
    {
      id: 32,
      title: 'Hyundai IONIQ 5',
      image: 'https://carwow-uk-wp-3.imgix.net/hyundai-ioniq-5-front.jpg',
      rating: 9.3,
      date: 'January 27, 2023',
      body: 'The Hyundai IONIQ 5 is a groundbreaking electric car that combines retro-futuristic styling with cutting-edge technology. It offers fast charging, impressive range, and a spacious, lounge-like interior that makes it one of the most compelling EVs on the market.',
      pros: [
        'Standout design',
        'Ultra-fast 800V charging capability',
        'Spacious and versatile interior',
        'Strong performance across all versions'
      ],
      cons: [
        'Firm ride on larger wheels',
        'Not as fun to drive as some rivals',
        'Expensive for a Hyundai'
      ],
      author: {
        name: 'Alicia Torres',
        role: 'EV Specialist',
        avatar: 'https://i.pravatar.cc/300?img=30'
      }
    }
  ],

  // Audi models
  'audi-a1': [
    {
      id: 33,
      title: 'Audi A1 Sportback',
      image: 'https://carwow-uk-wp-3.imgix.net/audi-a1-sportback-front.jpg',
      rating: 8.0,
      date: 'February 12, 2023',
      body: 'The Audi A1 Sportback brings premium quality to the small car segment, with upmarket interior materials, refined driving manners, and strong engines. It\'s expensive compared to mainstream rivals, but offers a high-end experience in a compact package.',
      pros: [
        'Premium interior quality',
        'Strong engines across the range',
        'Good tech and infotainment',
        'Solid resale values'
      ],
      cons: [
        'Expensive compared to non-premium rivals',
        'Firmer ride than some alternatives',
        'Not as fun to drive as a MINI'
      ],
      author: {
        name: 'Daniel Morris',
        role: 'Premium Car Specialist',
        avatar: 'https://i.pravatar.cc/300?img=31'
      }
    }
  ],
  'audi-a3': [
    {
      id: 34,
      title: 'Audi A3',
      image: 'https://carwow-uk-wp-3.imgix.net/audi-a3-front.jpg',
      rating: 8.7,
      date: 'March 8, 2023',
      body: 'The Audi A3 is a premium family hatchback that offers a high-tech interior, strong refinement, and a good balance of comfort and handling. It successfully bridges the gap between mainstream hatchbacks and more expensive premium cars.',
      pros: [
        'High-quality interior',
        'Refined ride and handling balance',
        'Impressive technology',
        'Strong resale values'
      ],
      cons: [
        'More expensive than mainstream rivals',
        'Some rivals are more fun to drive',
        'Options can quickly add up'
      ],
      author: {
        name: 'Claire Johnson',
        role: 'Family Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=32'
      }
    }
  ],
  'audi-a4': [
    {
      id: 35,
      title: 'Audi A4',
      image: 'https://carwow-uk-wp-3.imgix.net/audi-a4-front.jpg',
      rating: 8.6,
      date: 'April 5, 2023',
      body: 'The Audi A4 is a refined and sophisticated executive sedan that offers a beautiful interior, impressive technology, and a comfortable driving experience. It might not be as sporty as a BMW 3 Series, but it excels in refinement and build quality.',
      pros: [
        'Beautifully built interior',
        'Refined engines',
        'Cutting-edge technology',
        'Comfortable ride quality'
      ],
      cons: [
        'Not as engaging to drive as some rivals',
        'Some rivals offer more standard equipment',
        'Conservative styling'
      ],
      author: {
        name: 'James Parker',
        role: 'Executive Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=33'
      }
    }
  ],
  'audi-q3': [
    {
      id: 36,
      title: 'Audi Q3',
      image: 'https://carwow-uk-wp-3.imgix.net/audi-q3-front.jpg',
      rating: 8.4,
      date: 'January 18, 2023',
      body: 'The Audi Q3 is a premium compact SUV that offers a high-quality interior, strong practicality, and a comfortable driving experience. It successfully combines the elevated driving position of an SUV with the refinement expected of an Audi.',
      pros: [
        'Premium interior quality',
        'Practical and versatile space',
        'Good technology',
        'Strong engine lineup'
      ],
      cons: [
        'Not as fun to drive as a BMW X1',
        'Expensive with options',
        'Firmer ride on larger wheels'
      ],
      author: {
        name: 'Lisa Thompson',
        role: 'SUV Reviewer',
        avatar: 'https://i.pravatar.cc/300?img=34'
      }
    }
  ],
  'audi-q5': [
    {
      id: 37,
      title: 'Audi Q5',
      image: 'https://carwow-uk-wp-3.imgix.net/audi-q5-front.jpg',
      rating: 8.9,
      date: 'February 22, 2023',
      body: 'The Audi Q5 is a premium mid-size SUV that delivers a refined driving experience, upscale interior, and strong practicality. It strikes an excellent balance between comfort, performance, and everyday usability.',
      pros: [
        'High-quality cabin materials',
        'Refined and powerful engines',
        'Comfortable yet controlled ride',
        'Practical family space'
      ],
      cons: [
        'Some rivals are more fun to drive',
        'Can get expensive with options',
        'Conservative styling'
      ],
      author: {
        name: 'Mark Roberts',
        role: 'Luxury Vehicle Specialist',
        avatar: 'https://i.pravatar.cc/300?img=35'
      }
    }
  ],

  // Volkswagen models
  'volkswagen-polo': [
    {
      id: 38,
      title: 'Volkswagen Polo',
      image: 'https://carwow-uk-wp-3.imgix.net/volkswagen-polo-front.jpg',
      rating: 8.5,
      date: 'March 15, 2023',
      body: 'The Volkswagen Polo offers a refined, Golf-like experience in a smaller package. It\'s one of the most grown-up feeling superminis on the market, with a high-quality interior, impressive refinement, and mature driving dynamics.',
      pros: [
        'Quality interior',
        'Comfortable ride',
        'Good technology',
        'Strong engines'
      ],
      cons: [
        'Not as fun to drive as a Ford Fiesta',
        'More expensive than some rivals',
        'Conservative styling'
      ],
      author: {
        name: 'William Stewart',
        role: 'Small Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=36'
      }
    }
  ],
  'volkswagen-tiguan': [
    {
      id: 39,
      title: 'Volkswagen Tiguan',
      image: 'https://carwow-uk-wp-3.imgix.net/volkswagen-tiguan-front.jpg',
      rating: 8.7,
      date: 'January 30, 2023',
      body: 'The Volkswagen Tiguan is a practical and refined family SUV with a premium feel, spacious interior, and solid build quality. It\'s not the most exciting SUV to drive, but it excels as a comfortable, high-quality family vehicle.',
      pros: [
        'Quality interior materials',
        'Practical cabin and boot space',
        'Refined engines',
        'Good technology'
      ],
      cons: [
        'Not as engaging to drive as some rivals',
        'Can get expensive with options',
        'Conservative design'
      ],
      author: {
        name: 'Rachel Brown',
        role: 'Family SUV Specialist',
        avatar: 'https://i.pravatar.cc/300?img=37'
      }
    }
  ],
  'volkswagen-t-roc': [
    {
      id: 40,
      title: 'Volkswagen T-Roc',
      image: 'https://carwow-uk-wp-3.imgix.net/volkswagen-t-roc-front.jpg',
      rating: 8.3,
      date: 'April 2, 2023',
      body: 'The Volkswagen T-Roc is a stylish compact SUV that offers a good balance of practicality, comfort, and driving dynamics. It has more personality than typical Volkswagen models, while maintaining the quality and refinement the brand is known for.',
      pros: [
        'More characterful design than other VWs',
        'Comfortable and composed ride',
        'Good range of engines',
        'Practical for its size'
      ],
      cons: [
        'Interior quality not as good as a Golf',
        'Some hard plastics in the cabin',
        'Gets expensive with options'
      ],
      author: {
        name: 'Karen Mitchell',
        role: 'Compact SUV Expert',
        avatar: 'https://i.pravatar.cc/300?img=38'
      }
    }
  ],
  'volkswagen-id3': [
    {
      id: 41,
      title: 'Volkswagen ID.3',
      image: 'https://carwow-uk-wp-3.imgix.net/volkswagen-id3-front.jpg',
      rating: 8.8,
      date: 'February 8, 2023',
      body: 'The Volkswagen ID.3 is the brand\'s first purpose-built electric car, offering impressive range, good practicality, and a futuristic interior. It combines the familiar VW qualities with cutting-edge electric technology, making it an excellent all-electric family hatchback.',
      pros: [
        'Good real-world electric range',
        'Spacious interior and boot',
        'Comfortable ride',
        'Futuristic feel'
      ],
      cons: [
        'Interior quality not as good as a Golf',
        'Fiddly touch-sensitive controls',
        'Software issues in early models'
      ],
      author: {
        name: 'Thomas Edison',
        role: 'Electric Vehicle Specialist',
        avatar: 'https://i.pravatar.cc/300?img=39'
      }
    }
  ],

  // Kia models
  'kia-ceed': [
    {
      id: 42,
      title: 'Kia Ceed',
      image: 'https://carwow-uk-wp-3.imgix.net/kia-ceed-front.jpg',
      rating: 8.1,
      date: 'March 25, 2023',
      body: 'The Kia Ceed is a well-rounded family hatchback that offers good value for money, a long warranty, and decent practicality. It might not lead the class in any particular area, but it\'s a solid all-rounder with few significant weaknesses.',
      pros: [
        '7-year warranty',
        'Well-equipped for the price',
        'Practical interior and boot',
        'User-friendly technology'
      ],
      cons: [
        'Not as fun to drive as a Ford Focus',
        'Interior quality behind Volkswagen Golf',
        'Engines not as refined as some rivals'
      ],
      author: {
        name: 'Peter Anderson',
        role: 'Family Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=40'
      }
    }
  ],
  'kia-sportage': [
    {
      id: 43,
      title: 'Kia Sportage',
      image: 'https://carwow-uk-wp-3.imgix.net/kia-sportage-front.jpg',
      rating: 8.9,
      date: 'April 10, 2023',
      body: 'The Kia Sportage is a boldly styled family SUV that offers excellent value, a long warranty, and impressive practicality. The latest generation has distinctive styling and a high-tech interior that helps it stand out in a crowded segment.',
      pros: [
        'Striking exterior design',
        'Impressive dual-screen interior',
        'Spacious cabin and boot',
        '7-year warranty'
      ],
      cons: [
        'Some rivals are more fun to drive',
        'Hybrid versions are expensive',
        'Divisive styling may not appeal to all'
      ],
      author: {
        name: 'Amanda Hughes',
        role: 'Family SUV Specialist',
        avatar: 'https://i.pravatar.cc/300?img=41'
      }
    }
  ],
  'kia-ev6': [
    {
      id: 44,
      title: 'Kia EV6',
      image: 'https://carwow-uk-wp-3.imgix.net/kia-ev6-front.jpg',
      rating: 9.2,
      date: 'January 22, 2023',
      body: 'The Kia EV6 is a groundbreaking electric car that combines striking design, impressive range, and ultra-fast charging capability. It offers a premium experience that rivals more expensive electric cars, with strong performance and a spacious interior.',
      pros: [
        'Distinctive design inside and out',
        'Ultra-fast 800V charging',
        'Long electric range',
        'Spacious and practical interior'
      ],
      cons: [
        'Ride can be firm with larger wheels',
        'More expensive than previous Kia models',
        'Some fiddly touch-sensitive controls'
      ],
      author: {
        name: 'Olivia Wright',
        role: 'Electric Vehicle Expert',
        avatar: 'https://i.pravatar.cc/300?img=42'
      }
    }
  ],
  'kia-picanto': [
    {
      id: 45,
      title: 'Kia Picanto',
      image: 'https://carwow-uk-wp-3.imgix.net/kia-picanto-front.jpg',
      rating: 8.2,
      date: 'February 18, 2023',
      body: 'The Kia Picanto is a well-designed city car that offers good value for money, decent equipment levels, and surprising practicality for its size. It\'s one of the more grown-up feeling cars in its class, with respectable refinement and build quality.',
      pros: [
        'Good interior quality for the class',
        'Surprisingly practical for its size',
        '7-year warranty',
        'Easy to drive and park'
      ],
      cons: [
        'Basic engines need working hard',
        'Not as fun to drive as some rivals',
        'Limited rear seat space'
      ],
      author: {
        name: 'George Wilson',
        role: 'City Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=43'
      }
    }
  ],
  'kia-niro': [
    {
      id: 46,
      title: 'Kia Niro',
      image: 'https://carwow-uk-wp-3.imgix.net/kia-niro-front.jpg',
      rating: 8.6,
      date: 'March 12, 2023',
      body: 'The Kia Niro is a practical and efficient family SUV available with hybrid, plug-in hybrid, and all-electric powertrains. The second generation brings more distinctive styling and improved interior quality, making it an attractive proposition for eco-conscious buyers.',
      pros: [
        'Choice of electrified powertrains',
        'Practical and well-designed interior',
        'Good equipment levels',
        '7-year warranty'
      ],
      cons: [
        'Not as fun to drive as some rivals',
        'EV version not as advanced as dedicated EVs',
        'Styling may be too bold for some tastes'
      ],
      author: {
        name: 'Linda Parker',
        role: 'Hybrid Vehicle Specialist',
        avatar: 'https://i.pravatar.cc/300?img=44'
      }
    }
  ],

  // Mercedes models
  'mercedes-a-class': [
    {
      id: 47,
      title: 'Mercedes-Benz A-Class',
      image: 'https://carwow-uk-wp-3.imgix.net/mercedes-a-class-front.jpg',
      rating: 8.5,
      date: 'January 10, 2023',
      body: 'The Mercedes-Benz A-Class brings premium quality and technology to the family hatchback segment. Its standout feature is the impressive MBUX infotainment system and high-quality interior, though it comes at a price premium over mainstream rivals.',
      pros: [
        'Class-leading interior technology',
        'Premium cabin materials',
        'Refined and comfortable',
        'Strong range of engines'
      ],
      cons: [
        'More expensive than mainstream rivals',
        'Options quickly add up',
        'Not as fun to drive as a BMW 1 Series'
      ],
      author: {
        name: 'Henry Collins',
        role: 'Premium Car Specialist',
        avatar: 'https://i.pravatar.cc/300?img=45'
      }
    }
  ],
  'mercedes-c-class': [
    {
      id: 48,
      title: 'Mercedes-Benz C-Class',
      image: 'https://carwow-uk-wp-3.imgix.net/mercedes-c-class-front.jpg',
      rating: 9.0,
      date: 'February 5, 2023',
      body: 'The Mercedes-Benz C-Class is a refined and luxurious executive sedan that offers S-Class inspired technology and design in a smaller package. It prioritizes comfort and luxury over sportiness, making it a relaxing car to drive and travel in.',
      pros: [
        'Elegant, high-quality interior',
        'Impressive technology',
        'Comfortable ride',
        'Efficient engines including plug-in hybrids'
      ],
      cons: [
        'Not as engaging to drive as a BMW 3 Series',
        'Some features should be standard',
        'Touch-sensitive controls can be fiddly'
      ],
      author: {
        name: 'Victoria Adams',
        role: 'Executive Car Specialist',
        avatar: 'https://i.pravatar.cc/300?img=46'
      }
    }
  ],
  'mercedes-e-class': [
    {
      id: 49,
      title: 'Mercedes-Benz E-Class',
      image: 'https://carwow-uk-wp-3.imgix.net/mercedes-e-class-front.jpg',
      rating: 9.2,
      date: 'March 20, 2023',
      body: 'The Mercedes-Benz E-Class is a sophisticated luxury sedan that excels in comfort, refinement, and technology. It offers a soothing driving experience with exceptional build quality and impressive attention to detail throughout.',
      pros: [
        'Exceptionally comfortable',
        'Beautiful interior quality',
        'Cutting-edge technology',
        'Refined engines'
      ],
      cons: [
        'BMW 5 Series is more fun to drive',
        'Options are expensive',
        'Some touch-sensitive controls'
      ],
      author: {
        name: 'Charles Montgomery',
        role: 'Luxury Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=47'
      }
    }
  ],
  'mercedes-gla': [
    {
      id: 50,
      title: 'Mercedes-Benz GLA',
      image: 'https://carwow-uk-wp-3.imgix.net/mercedes-gla-front.jpg',
      rating: 8.3,
      date: 'April 15, 2023',
      body: 'The Mercedes-Benz GLA is a premium compact SUV that offers the elevated driving position and practicality of an SUV with the technology and quality of Mercedes\' other models. The second generation is more SUV-like than its predecessor, with improved space and practicality.',
      pros: [
        'Premium interior quality',
        'Impressive technology',
        'Comfortable ride',
        'More practical than the A-Class'
      ],
      cons: [
        'Some rivals are more fun to drive',
        'Gets expensive with options',
        'Not as spacious as some competitors'
      ],
      author: {
        name: 'Natalie Porter',
        role: 'Compact SUV Specialist',
        avatar: 'https://i.pravatar.cc/300?img=48'
      }
    }
  ],
  'mercedes-glc': [
    {
      id: 51,
      title: 'Mercedes-Benz GLC',
      image: 'https://carwow-uk-wp-3.imgix.net/mercedes-glc-front.jpg',
      rating: 8.8,
      date: 'January 28, 2023',
      body: 'The Mercedes-Benz GLC is a premium mid-size SUV that offers a luxurious interior, comfortable ride, and impressive technology. The latest version brings improved efficiency and even more technology from the S-Class, making it a compelling luxury SUV option.',
      pros: [
        'High-quality, luxurious interior',
        'Smooth and comfortable ride',
        'Excellent technology',
        'Efficient engine options'
      ],
      cons: [
        'Not as sporty as a BMW X3',
        'Some options should be standard',
        'Touch controls can be distracting'
      ],
      author: {
        name: 'Martin Lewis',
        role: 'SUV Expert',
        avatar: 'https://i.pravatar.cc/300?img=49'
      }
    }
  ],

  // Toyota models
  'toyota-yaris': [
    {
      id: 52,
      title: 'Toyota Yaris',
      image: 'https://carwow-uk-wp-3.imgix.net/toyota-yaris-front.jpg',
      rating: 8.7,
      date: 'February 15, 2023',
      body: 'The Toyota Yaris is a practical and efficient small car that stands out with its hybrid powertrain, offering impressive fuel economy and low emissions. The latest generation brings sharper styling, better driving dynamics, and improved interior quality.',
      pros: [
        'Excellent hybrid efficiency',
        'Fun to drive',
        'Improved interior quality',
        'Strong reliability record'
      ],
      cons: [
        'Tight rear seats',
        'Infotainment not class-leading',
        'Engine can be noisy when pushed'
      ],
      author: {
        name: 'Diana Chen',
        role: 'Small Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=50'
      }
    }
  ],
  'toyota-corolla': [
    {
      id: 53,
      title: 'Toyota Corolla',
      image: 'https://carwow-uk-wp-3.imgix.net/toyota-corolla-front.jpg',
      rating: 8.6,
      date: 'March 5, 2023',
      body: 'The Toyota Corolla combines excellent hybrid efficiency with sharp styling and a comfortable driving experience. After years of the rather dull Auris, the Corolla name returns with a car that\'s much more appealing to look at and drive.',
      pros: [
        'Excellent hybrid efficiency',
        'Comfortable ride',
        'Reliable and well-built',
        'Sharp styling'
      ],
      cons: [
        'Infotainment system could be better',
        'Engines can be noisy when pushed',
        'Ford Focus is more fun to drive'
      ],
      author: {
        name: 'Robert Kim',
        role: 'Family Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=51'
      }
    }
  ],
  'toyota-rav4': [
    {
      id: 54,
      title: 'Toyota RAV4',
      image: 'https://carwow-uk-wp-3.imgix.net/toyota-rav4-front.jpg',
      rating: 8.5,
      date: 'January 12, 2023',
      body: 'The Toyota RAV4 is a practical and efficient family SUV that stands out with its hybrid and plug-in hybrid options. It offers distinctive styling, a spacious interior, and Toyota\'s renowned reliability, making it a sensible choice for families.',
      pros: [
        'Efficient hybrid powertrains',
        'Spacious and practical interior',
        'Distinctive styling',
        'Strong reliability record'
      ],
      cons: [
        'Interior quality not as premium as some rivals',
        'Infotainment system could be better',
        'Not as refined as some competitors'
      ],
      author: {
        name: 'Paul Davidson',
        role: 'Family SUV Expert',
        avatar: 'https://i.pravatar.cc/300?img=52'
      }
    }
  ],
  'toyota-yaris-cross': [
    {
      id: 55,
      title: 'Toyota Yaris Cross',
      image: 'https://carwow-uk-wp-3.imgix.net/toyota-yaris-cross-front.jpg',
      rating: 8.4,
      date: 'February 28, 2023',
      body: 'The Toyota Yaris Cross is a practical small SUV that combines the efficient hybrid powertrain of the Yaris with a more practical, SUV-like body. It offers the high driving position many buyers want with the reliability and low running costs Toyota is known for.',
      pros: [
        'Efficient hybrid powertrain',
        'Good practicality for its size',
        'Available with all-wheel drive',
        'Strong predicted reliability'
      ],
      cons: [
        'Interior feels a bit basic',
        'Not as fun to drive as some rivals',
        'Engine can be noisy when pushed hard'
      ],
      author: {
        name: 'Julia Martinez',
        role: 'Compact SUV Specialist',
        avatar: 'https://i.pravatar.cc/300?img=53'
      }
    }
  ],
  'toyota-aygo-x': [
    {
      id: 56,
      title: 'Toyota Aygo X',
      image: 'https://carwow-uk-wp-3.imgix.net/toyota-aygo-x-front.jpg',
      rating: 8.2,
      date: 'March 22, 2023',
      body: 'The Toyota Aygo X is a city car with SUV-inspired styling that offers character, efficiency, and Toyota\'s reliability in a compact package. It\'s more distinctive than its predecessor and offers improved comfort and refinement.',
      pros: [
        'Distinctive styling',
        'Good fuel economy',
        'Easy to drive and park',
        'Better comfort than typical city cars'
      ],
      cons: [
        'Only one engine option',
        'Limited rear seat space',
        'Basic entry-level equipment'
      ],
      author: {
        name: 'Tony Garcia',
        role: 'City Car Expert',
        avatar: 'https://i.pravatar.cc/300?img=54'
      }
    }
  ]
};

const Reviews = () => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [carModels, setCarModels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (selectedMake) {
      setCarModels(carModelsData[selectedMake] || []);
      setSelectedModel('');
    } else {
      setCarModels([]);
    }
  }, [selectedMake]);

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSearched(false);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setSearched(false);
  };

  const handleMakeClick = (makeId) => {
    setSelectedMake(makeId);
    setSelectedModel('');
    setSearched(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    
    // Generate the key for the mockReviews object
    const reviewKey = `${selectedMake}-${selectedModel}`;
    
    // Find the matching reviews or return empty array
    setReviews(mockReviews[reviewKey] || []);
  };

  // Get the selected make and model names for display
  const getSelectedMakeName = () => {
    const make = carMakes.find(make => make.id === selectedMake);
    return make ? make.name : '';
  };

  const getSelectedModelName = () => {
    const model = carModels.find(model => model.id === selectedModel);
    return model ? model.name : '';
  };

  return (
    <div>
      <div className="reviews-header">
        <h1>Car Reviews</h1>
        <p>Read expert reviews for all the latest models. Find out what our experts think about performance, practicality, reliability and more.</p>
      </div>
      
      <div className="reviews-container">
        <div className="reviews-content">
          <div className="selector-section">
            <form onSubmit={handleSearch}>
              <div className="selector-row">
                <div className="selector-group">
                  <label htmlFor="make">Select a Make</label>
                  <select
                    id="make"
                    value={selectedMake}
                    onChange={handleMakeChange}
                    required
                  >
                    <option value="">Choose a car make</option>
                    {carMakes.map(make => (
                      <option key={make.id} value={make.id}>{make.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="selector-group">
                  <label htmlFor="model">Select a Model</label>
                  <select
                    id="model"
                    value={selectedModel}
                    onChange={handleModelChange}
                    disabled={!selectedMake}
                    required
                  >
                    <option value="">Choose a car model</option>
                    {carModels.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="button-container">
                <button type="submit" className="search-button">
                  Find Reviews <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
          
          {searched && (
            <div className="review-results">
              {reviews.length > 0 ? (
                <>
                  <h2>{reviews.length} review{reviews.length !== 1 ? 's' : ''} for {getSelectedMakeName()} {getSelectedModelName()}</h2>
                  
                  {reviews.map(review => (
                    <div className="review-card" key={review.id}>
                      <div className="review-header">
                        <img 
                          src={review.image} 
                          alt={review.title} 
                          className="review-image"
                        />
                        <div className="review-title">
                          <h2>{review.title}</h2>
                          <div className="review-meta">
                            <div className="rating">
                              <span className="rating-value">{review.rating}/10</span>
                              <div className="rating-stars">
                                {[...Array(Math.floor(review.rating / 2))].map((_, i) => (
                                  <i key={i} className="fas fa-star"></i>
                                ))}
                                {review.rating / 2 % 1 !== 0 && (
                                  <i className="fas fa-star-half-alt"></i>
                                )}
                              </div>
                            </div>
                            <span className="review-date">Reviewed: {review.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="review-body">
                        <p className="review-text">{review.body}</p>
                        
                        <div className="review-pros-cons">
                          <div className="review-pros">
                            <h4>
                              <i className="fas fa-plus-circle"></i> 
                              Pros
                            </h4>
                            <ul>
                              {review.pros.map((pro, index) => (
                                <li key={index}>{pro}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="review-cons">
                            <h4>
                              <i className="fas fa-minus-circle"></i> 
                              Cons
                            </h4>
                            <ul>
                              {review.cons.map((con, index) => (
                                <li key={index}>{con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="review-footer">
                        <div className="review-author">
                          <img 
                            src={review.author.avatar} 
                            alt={review.author.name} 
                            className="author-avatar"
                          />
                          <div className="author-info">
                            <h4>{review.author.name}</h4>
                            <p>{review.author.role}</p>
                          </div>
                        </div>
                        
                        <div className="review-actions">
                          <Link to={`/car/${selectedMake}-${selectedModel}`}>View {getSelectedMakeName()} Models</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-results">
                  <h3>No reviews found</h3>
                  <p>We couldn't find any reviews for the {getSelectedMakeName()} {getSelectedModelName()}. Please try a different model or check back later.</p>
                  <p>You can browse our popular makes below.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="popular-makes">
            <h3>Popular Makes</h3>
            <div className="makes-grid">
              {carMakes.map(make => (
                <div 
                  key={make.id} 
                  className="make-item" 
                  onClick={() => handleMakeClick(make.id)}
                >
                  <img src={make.logo} alt={make.name} />
                  <p>{make.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="dark-section">
        <div className="review-stats">
          <div className="stats-header">
            <h2>Trusted Reviews</h2>
            <p>Join millions of car buyers who trust our expert reviews</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">10.3M+</div>
              <div className="stat-label">Monthly Viewers</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">1000+</div>
              <div className="stat-label">Expert Reviews</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">4.8/5</div>
              <div className="stat-label">User Rating</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">98%</div>
              <div className="stat-label">Would Recommend</div>
            </div>
          </div>
          
          <div className="brands-container">
            {carMakes.map(make => (
              <img 
                key={make.id}
                src={make.logo}
                alt={make.name}
                className="brand-logo"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 