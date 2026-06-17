import { Product, Review } from './types';

export const products: Product[] = [
  { 
    id: 1, 
    name: "The Afinds Signature Shirt", 
    price: 89, 
    category: "men", 
    badge: "Bestseller", 
    rating: 4.9, 
    reviews: 312, 
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80" 
  },
  { 
    id: 2, 
    name: "Oversized Linen Blazer", 
    price: 129, 
    category: "women", 
    badge: "New", 
    rating: 4.8, 
    reviews: 142, 
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&q=80" 
  },
  { 
    id: 3, 
    name: "Slim Fit Cargo Pants", 
    price: 89, 
    category: "men", 
    badge: "New", 
    rating: 4.7, 
    reviews: 98, 
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" 
  },
  { 
    id: 4, 
    name: "Satin Slip Dress", 
    price: 109, 
    category: "women", 
    badge: "Sale", 
    rating: 4.6, 
    reviews: 201, 
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80" 
  },
  { 
    id: 5, 
    name: "Relaxed Linen Trousers", 
    price: 79, 
    category: "women", 
    badge: "", 
    rating: 4.5, 
    reviews: 77, 
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80" 
  },
  { 
    id: 6, 
    name: "Utility Overshirt", 
    price: 99, 
    category: "men", 
    badge: "Only 3 left!", 
    rating: 4.8, 
    reviews: 54, 
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80" 
  },
  { 
    id: 7, 
    name: "Cropped Knit Cardigan", 
    price: 69, 
    category: "women", 
    badge: "Sold Out", 
    rating: 4.9, 
    reviews: 188, 
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80" 
  },
  { 
    id: 8, 
    name: "Wide Leg Denim", 
    price: 119, 
    category: "women", 
    badge: "New", 
    rating: 4.7, 
    reviews: 93, 
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80" 
  },
  { 
    id: 9, 
    name: "Essential Crew Tee", 
    price: 39, 
    category: "men", 
    badge: "Bestseller", 
    rating: 4.6, 
    reviews: 410, 
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" 
  },
  { 
    id: 10, 
    name: "Belted Trench Coat", 
    price: 189, 
    category: "women", 
    badge: "New", 
    rating: 4.9, 
    reviews: 67, 
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80" 
  },
  { 
    id: 11, 
    name: "Jogger Set", 
    price: 99, 
    category: "men", 
    badge: "Sale", 
    rating: 4.5, 
    reviews: 130, 
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" 
  },
  { 
    id: 12, 
    name: "Tailored Blazer Dress", 
    price: 149, 
    category: "women", 
    badge: "Sold Out", 
    rating: 4.8, 
    reviews: 45, 
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80" 
  }
];

export const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const reviews: Review[] = [
  {
    id: 1,
    initials: "JC",
    name: "Julian C.",
    rating: 5,
    text: "Bought the Signature Shirt. Less than 24 hours later, a girl asked me for directions, smiled, and complement my fit. Coincidence? My therapist says yes, but Afinds says no. 10/10 would buy again.",
    verified: true,
    date: "2 days ago"
  },
  {
    id: 2,
    initials: "ML",
    name: "Marcus L.",
    rating: 5,
    text: "My closet used to be entirely grey shirts and cargo shorts. I bought the Utility Overshirt and Slim Fit Cargo Pants. My roommates literally asked if I got a promotion or a hot date. Turns out it's just great retail therapy.",
    verified: true,
    date: "1 week ago"
  },
  {
    id: 3,
    initials: "SK",
    name: "Sarah K.",
    rating: 5,
    text: "I bought my boyfriend the Signature Shirt because I was tired of his high school tees. He looks like a high-concept model now. I also bought the Over-sized Linen Blazer for myself and my confidence skyrocketed. Afinds represents truth in advertising.",
    verified: true,
    date: "3 days ago"
  }
];
