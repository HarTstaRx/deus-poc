export interface NewAuctionInterface {
  itemId: string;
  bid: number;
  buyout: number;
}

export interface CacheInterface {
  newAuction?: NewAuctionInterface;
}

export interface StoreContextInterface {
  cache: CacheInterface;
  changeCache: (newCache: Partial<CacheInterface>) => void;
}
