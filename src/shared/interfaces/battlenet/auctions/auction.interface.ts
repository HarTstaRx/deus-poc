import { ItemQualityEnum } from '../../../enums/battlenet/item-quality.enum';
import { AuctionItemInterface } from './auction-item.interface';

export interface AuctionInterface {
  id: string;
  item: AuctionItemInterface;
  bid: number;
  buyout: number;
  quantity: number;
  time_left: string;
  quality: ItemQualityEnum;
}
