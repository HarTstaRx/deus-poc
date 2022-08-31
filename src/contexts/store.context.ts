import { createContext } from 'react';

import { StoreContextInterface } from '../shared/interfaces';

export const StoreContext = createContext<StoreContextInterface>({
  cache: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeCache: () => {},
});
