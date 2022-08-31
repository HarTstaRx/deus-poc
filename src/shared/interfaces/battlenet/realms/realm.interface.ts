import { TranslationInterface } from '../translation.interface';

export interface RealmInterface {
  is_tournament: boolean;
  timezone: string;
  name: TranslationInterface;
  slug: string;
  id: string;
  region: {
    id: string;
    name: TranslationInterface;
  };
  category: TranslationInterface;
  locale: string;
  type: {
    name: TranslationInterface;
    type: string;
  };
}
