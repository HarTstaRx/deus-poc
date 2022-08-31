import { MetadataInterface } from './metadata.interface';
import { RealmInterface } from './realm.interface';

export interface ConnectedRealmInterface {
  id: string;
  has_queue: boolean;
  status: MetadataInterface;
  population: MetadataInterface;
  realms: RealmInterface[];
}
