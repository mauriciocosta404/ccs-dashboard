export interface CreateMovementRequest {
  date?: Date | string;
  patrimonyId?: string;
  assetName?: string;
  movementType: string;
  origin?: string;
  destination?: string;
  quantity?: number;
  obs?: string;
  responsible?: string;
  resourceSource?: string;
  supplierDonor?: string;
  observations?: string;
}

export interface UpdateMovementRequest {
  date?: Date | string;
  patrimonyId?: string;
  assetName?: string;
  movementType?: string;
  origin?: string;
  destination?: string;
  quantity?: number;
  obs?: string;
  responsible?: string;
  resourceSource?: string;
  supplierDonor?: string;
  observations?: string;
}

export interface Movement {
  id: string;
  movementType: string;
  date?: Date | string;
  patrimonyId?: string;
  patrimonyNumber?: string;
  assetName?: string;
  origin?: string;
  destination?: string;
  quantity?: number;
  obs?: string;
  responsible?: string;
  resourceSource?: string;
  supplierDonor?: string;
  observations?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

