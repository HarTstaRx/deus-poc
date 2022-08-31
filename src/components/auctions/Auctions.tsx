import React, { useState, useEffect, useCallback, useContext } from 'react';

import { StoreContext } from '../../contexts/store.context';
import { battlenetService } from '../../services';
import { ItemQualityEnum } from '../../shared/enums/battlenet/item-quality.enum';
import {
  PaginationInterface,
  StoreContextInterface,
} from '../../shared/interfaces';
import { AuctionInterface } from '../../shared/interfaces/battlenet/auctions/auction.interface';
import { ItemMediaInterface } from '../../shared/interfaces/battlenet/items/item-media.interface';
import { ItemInterface } from '../../shared/interfaces/battlenet/items/item.interface';
import { isNullOrEmpty, randomId, removeDuplicates } from '../../shared/utils';
import { Auction } from '../auction/Auction';

import './Auctions.scss';

interface AuctionsProps {
  realmId: string;
  auctionHouseId: string;
}

export const Auctions = ({
  realmId,
  auctionHouseId,
}: AuctionsProps): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [auctions, setAuctions] = useState<AuctionInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emptyAuctionHouse, setEmptyAuctionHouse] = useState<boolean>(false);
  const [areItemsLoaded, setAreItemsLoaded] = useState<boolean>(false);
  const auctionsPerPage = 100;

  const handleBuyout = (auctionId: string) => {
    if (!auctions) return;
    const newAuctions = auctions.filter((a) => a.id !== auctionId);
    setAuctions(newAuctions);
    if (newAuctions.length === 0) setEmptyAuctionHouse(true);
  };

  const buildItemCallsWithPromises = useCallback(
    (itemIds: string[]): Promise<PaginationInterface<ItemInterface>>[] => {
      const promises: Promise<PaginationInterface<ItemInterface>>[] = [];
      const idsNotInStorage = itemIds.filter(
        (id) => window.localStorage.getItem(`item:${id}`) === null
      );
      if (idsNotInStorage.length === 0) return promises;
      // avoiding http.414: query too large
      const maxIds = 700;
      if (idsNotInStorage.length < 700)
        promises.push(battlenetService.searchItems({ ids: idsNotInStorage }));
      else {
        for (let i = 0; i < idsNotInStorage.length; i += maxIds) {
          const chunk = idsNotInStorage.slice(i, i + maxIds);
          promises.push(battlenetService.searchItems({ ids: chunk }));
        }
      }
      return promises;
    },
    []
  );

  const buildMediaCallsWithPromises = useCallback(
    (itemIds: string[]): Promise<PaginationInterface<ItemMediaInterface>>[] => {
      const promises: Promise<PaginationInterface<ItemMediaInterface>>[] = [];
      const idsNotInStorage = itemIds.filter(
        (id) => window.localStorage.getItem(`item:${id}:img`) === null
      );
      if (idsNotInStorage.length === 0) return promises;
      // avoiding http.414: query too large
      const maxIds = 700;
      if (idsNotInStorage.length < 700)
        promises.push(
          battlenetService.searchMedias({ ids: idsNotInStorage, tags: 'item' })
        );
      else {
        for (let i = 0; i < idsNotInStorage.length; i += maxIds) {
          const chunk = idsNotInStorage.slice(i, i + maxIds);
          promises.push(
            battlenetService.searchMedias({ ids: chunk, tags: 'item' })
          );
        }
      }
      return promises;
    },
    []
  );

  const saveMediaInLocalStorage = useCallback(
    (results: PaginationInterface<ItemMediaInterface>[]) => {
      const medias = results.flatMap((result) =>
        result.results.map((r) => r.data)
      );
      for (const media of medias) {
        window.localStorage.setItem(
          `item:${media.id}:img`,
          media.assets[0].value
        );
      }
      setAreItemsLoaded(true);
    },
    []
  );

  const saveItemsInLocalStorage = useCallback(
    (
      results: PaginationInterface<ItemInterface>[],
      newAuctions: AuctionInterface[]
    ) => {
      const mediaIds = results.flatMap((result) =>
        result.results.map((itemMetadata) => itemMetadata.data.media.id)
      );
      const promises = buildMediaCallsWithPromises(mediaIds);
      Promise.all(promises)
        .then(saveMediaInLocalStorage)
        .catch(() => Promise.reject());
      for (const result of results) {
        for (const metadata of result.results) {
          const item = metadata.data;
          const toStore = {
            id: item.id,
            name: item.name.es_ES,
            quality: item.quality.type,
          };
          window.localStorage.setItem(
            `item:${item.id}`,
            JSON.stringify(toStore)
          );
        }
      }
      setAuctions(newAuctions);
    },
    [buildMediaCallsWithPromises, saveMediaInLocalStorage]
  );

  useEffect(() => {
    const newAuction = storeContext.cache.newAuction;
    if (!newAuction) return;
    setAuctions([
      ...auctions,
      {
        bid: newAuction.bid,
        buyout: newAuction.buyout,
        item: {
          id: newAuction.itemId,
        },
        id: randomId(),
        quantity: 1,
        time_left: 'VERY_LONG',
        quality: ItemQualityEnum.COMMON,
      },
    ]);

    setEmptyAuctionHouse(false);
    storeContext.changeCache({ ...storeContext.cache, newAuction: undefined });
  }, [auctions, storeContext, storeContext.cache]);

  useEffect(() => {
    setAreItemsLoaded(false);
    setAuctions([]);
    if (isNullOrEmpty(realmId) || isNullOrEmpty(auctionHouseId)) return;

    setIsLoading(true);
    battlenetService
      .getAuctions({ realmId, auctionHouseId })
      .then((data) => {
        if (!data.auctions || data.auctions.length === 0) {
          setEmptyAuctionHouse(true);
          return;
        }
        void new Promise(() => JSON.stringify(data.auctions)).then(
          (stringAuctions: unknown) => {
            window.localStorage.setItem(
              `auctions:${realmId}:${auctionHouseId}`,
              stringAuctions as string
            );
          }
        );
        const newAuctions = data.auctions.slice(0, auctionsPerPage);
        setAuctions(newAuctions);
        const itemIds = removeDuplicates(
          newAuctions.flatMap((a) => a.item).map((i) => i.id)
        );
        const promises = buildItemCallsWithPromises(itemIds);
        Promise.all(promises)
          .then((results) => saveItemsInLocalStorage(results, newAuctions))
          .catch(() => Promise.reject());
      })
      .finally(() => setIsLoading(false));
  }, [
    realmId,
    auctionHouseId,
    saveItemsInLocalStorage,
    buildItemCallsWithPromises,
  ]);

  return (
    <div className='auctions-list'>
      <div className='auctions-header'>
        <span>Nombre</span>
        <span>Puja actual</span>
        <span>Compra</span>
        <span>Cantidad</span>
        <span>Tiempo restante</span>
        <span>Acciones</span>
      </div>
      <div className='auctions-list__items'>
        {isLoading && 'Cargando...'}
        {emptyAuctionHouse && (
          <div className='empty-auction-house'>
            No hay nada por aquí... Crea una subasta!
          </div>
        )}
        {auctions?.map((auction) => (
          <Auction
            key={auction.id}
            {...auction}
            handleBuyout={handleBuyout}
            areItemsLoaded={areItemsLoaded}
          />
        ))}
      </div>
    </div>
  );
};
