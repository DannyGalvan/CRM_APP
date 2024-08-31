import { create } from 'zustand';
import { logger } from './logger';
import { PilotResponse } from '../types/PilotResponse';


interface PilotState {
  pilot: PilotResponse | null
  add: (catalogue: PilotResponse| null) => void
}

export const usePilotStore = create<PilotState>()(
  logger((set) => ({
    pilot: null,
    add: (pilot) => set({ pilot }),
  }), 'usePilotStore')
)