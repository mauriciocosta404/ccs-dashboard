export interface Settings {
  id: string;
  churchName?: string;
  acronym?: string;
  localChurch?: string;
  foundingDate?: Date | string;
  foundingLocation?: string;
  headquartersAddress?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  pastor?: string;
  vicePastor?: string;
  secretary?: string;
  treasurer?: string;
  others?: string;
  bank?: string;
  accountNumber?: string;
  ibanNib?: string;
  registrationNumber?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateSettingsRequest {
  churchName?: string;
  acronym?: string;
  localChurch?: string;
  foundingDate?: Date | string;
  foundingLocation?: string;
  headquartersAddress?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  pastor?: string;
  vicePastor?: string;
  secretary?: string;
  treasurer?: string;
  others?: string;
  bank?: string;
  accountNumber?: string;
  ibanNib?: string;
  registrationNumber?: string;
}

export interface UpdateSettingsRequest {
  churchName?: string;
  acronym?: string;
  localChurch?: string;
  foundingDate?: Date | string;
  foundingLocation?: string;
  headquartersAddress?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  pastor?: string;
  vicePastor?: string;
  secretary?: string;
  treasurer?: string;
  others?: string;
  bank?: string;
  accountNumber?: string;
  ibanNib?: string;
  registrationNumber?: string;
}


