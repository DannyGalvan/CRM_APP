import { create } from 'zustand';
import { OrderResponse } from '../types/OrderResponse';
import { logger } from './logger';


interface OrderState {
  order: OrderResponse | null
  add: (catalogue: OrderResponse | null) => void
}

export const useOrderStore = create<OrderState>()(
  logger((set) => ({
    order: null,
    add: (order) => set({ order }),
  }), 'useOrderStore')
)