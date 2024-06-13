import { create } from 'zustand';
import { ProductResponse } from '../types/ProductResponse';
import { logger } from './logger';


interface ProductState {
  product: ProductResponse | null
  add: (catalogue: ProductResponse | null) => void
}

export const useProductStore = create<ProductState>()(
  logger((set) => ({
    product: null,
    add: (product) => set({ product }),
  }), 'useProductStore')
)