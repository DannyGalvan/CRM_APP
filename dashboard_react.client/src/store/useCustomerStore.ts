import { create } from 'zustand';
import { CustomerResponse } from '../types/CustomerResponse';
import { logger } from './logger';


interface CustomerState {
  customer: CustomerResponse | null
  add: (catalogue: CustomerResponse | null) => void
}

export const useCustomerStore = create<CustomerState>()(
  logger((set) => ({
    customer: null,
    add: (customer) => set({ customer }),
  }), 'useCustomerStore')
)