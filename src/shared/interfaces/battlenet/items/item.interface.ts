import { ItemQualityEnum } from '../../../enums/battlenet/item-quality.enum';
import { TranslationInterface } from '../translation.interface';

export interface ItemInterface {
  id: string;
  level: number;
  required_level: number;
  item_class: {
    id: string;
    name: TranslationInterface;
  };
  item_subclass: {
    id: string;
    name: TranslationInterface;
  };
  media: {
    id: string;
  };
  quality: {
    name: TranslationInterface;
    type: ItemQualityEnum;
  };
  name: TranslationInterface;
  inventory_type: {
    name: TranslationInterface;
    type: string;
  };
}
