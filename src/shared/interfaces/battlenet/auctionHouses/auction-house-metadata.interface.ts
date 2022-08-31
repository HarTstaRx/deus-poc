import { AuctionHouseInterface } from './auction-house.interface';

export interface AuctionHouseMetadataInterface {
  _links: {
    self: {
      href: string;
    };
  };
  auctions: AuctionHouseInterface[];
}
