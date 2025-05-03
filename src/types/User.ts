export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    bio?: string | null,
    avatar?: string | null,
    address?: string | null,
    country?: string | null,
    city?: string | null,
    marital_status?: string | null,
    phone?: string | null,
    facebook?: string | null,
    whatsapp?: string | null,
    instagram?: string | null,
    linkedin?: string | null,
    twitter?: string | null,
    createdAt?: Date,
    updatedAt?: Date
  }
  