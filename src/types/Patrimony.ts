export interface Patrimony {
  id: string;
  patrimonyNumber: string;
  assetName: string;
  category: string;
  subcategory?: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  condition: string; // 'Novo' | 'Usado'
  currentLocation?: string;
  responsible?: string;
  resourceSource?: string;
  supplierDonor?: string;
  observations?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatrimonyRequest {
  assetName: string;
  category: string;
  subcategory?: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  condition: string;
  currentLocation?: string;
  responsible?: string;
  resourceSource?: string;
  supplierDonor?: string;
  observations?: string;
}

export interface UpdatePatrimonyRequest {
  assetName?: string;
  category?: string;
  subcategory?: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  condition?: string;
  currentLocation?: string;
  responsible?: string;
  resourceSource?: string;
  supplierDonor?: string;
  observations?: string;
}

