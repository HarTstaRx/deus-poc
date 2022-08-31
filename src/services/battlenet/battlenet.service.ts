import {
  PaginationInterface,
  ConnectedRealmInterface,
  AuctionHouseMetadataInterface,
} from '../../shared/interfaces';
import { AuctionMetadataInterface } from '../../shared/interfaces/battlenet/auctions/auction-metadata.interface';
import { ItemMediaMetadataInterface } from '../../shared/interfaces/battlenet/items/item-media-metadata.interface';
import { ItemMediaInterface } from '../../shared/interfaces/battlenet/items/item-media.interface';
import { ItemInterface } from '../../shared/interfaces/battlenet/items/item.interface';
import { BaseService } from '../base.service';
import { GetAuctionsParamsInterface } from './get-auctions.params.interface';
import { SearchItemsParamsInterface } from './search-items.params.interface';
import { SearchMediaParamsInterface } from './search-media.params.interface';

class BattlenetService extends BaseService {
  endpoint = 'https://eu.api.blizzard.com/data';
  #namespace = 'dynamic-classic-eu';

  getRealms = (): Promise<PaginationInterface<ConnectedRealmInterface>> =>
    this.getData(
      `${this.endpoint}/wow/search/connected-realm?namespace=${
        this.#namespace
      }&status.type=UP`
    );
  getAuctionHouses = (
    realmId: string
  ): Promise<AuctionHouseMetadataInterface> =>
    this.getData(
      `${
        this.endpoint
      }/wow/connected-realm/${realmId}/auctions/index?namespace=${
        this.#namespace
      }`
    );
  getAuctions = (
    params: GetAuctionsParamsInterface
  ): Promise<AuctionMetadataInterface> =>
    this.getData(
      `${this.endpoint}/wow/connected-realm/${params.realmId}/auctions/${
        params.auctionHouseId
      }?namespace=${this.#namespace}`
    );
  searchItems = (
    params: SearchItemsParamsInterface
  ): Promise<PaginationInterface<ItemInterface>> => {
    return this.getData(
      `${
        this.endpoint
      }/wow/search/item?namespace=static-eu&id=${params.ids.join('||')}`
    );
  };
  getItemMedia = (itemId: string): Promise<ItemMediaMetadataInterface> =>
    this.getData(
      `${this.endpoint}/wow/media/item/${itemId}?namespace=static-classic-eu`
    );
  searchMedias = (
    params: SearchMediaParamsInterface
  ): Promise<PaginationInterface<ItemMediaInterface>> => {
    return this.getData(
      `${this.endpoint}/wow/search/media?namespace=static-eu&tags=${
        params.tags
      }&id=${params.ids.join('||')}`
    );
  };
}

export const battlenetService = new BattlenetService();
