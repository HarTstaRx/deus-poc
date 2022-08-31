import { AuctionInterface } from './auction.interface';

export interface AuctionMetadataInterface {
  _links: {
    self: {
      href: string;
    };
  };
  connected_realm: {
    href: string;
  };
  auctions: AuctionInterface[];
}
