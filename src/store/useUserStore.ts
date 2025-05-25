import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './types';

interface UserState {
  user: User;
  setLearningRobot: (robotId: string | null) => void;
}

const defaultUser: User = {
  id: 1,
  learning: null,
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,

      setLearningRobot: (robotId) =>
        set((state) => ({
          user: {
            ...state.user,
            learning: robotId,
          },
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;
