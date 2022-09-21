import React, { useState, useEffect } from 'react';

import { battlenetService } from '../../services';
import { AuctionHouseInterface } from '../../shared/interfaces';
import { isNullOrEmpty } from '../../shared/utils';

import './AuctionHouseFilter.scss';

interface AuctionHouseFilterProps {
  realmId: string;
  handleAuctionHouseChange: (newAuctionHouseId: string) => void;
}

export const AuctionHouseFilter = ({
  realmId,
  handleAuctionHouseChange,
}: AuctionHouseFilterProps): JSX.Element => {
  const [auctionHouses, setAuctionHouses] = useState<AuctionHouseInterface[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setAuctionHouses([]);
    if (isNullOrEmpty(realmId)) return;
    setIsLoading(true);
    battlenetService
      .getAuctionHouses(realmId)
      .then((data) => setAuctionHouses(data.auctions))
      .finally(() => setIsLoading(false));
  }, [realmId]);

  return (
    <div className='auction-house-filter'>
      {auctionHouses.length > 0 && (
        <>
          Selecciona una casa de subastas&nbsp;
          <select
            id='auction-houses'
            onChange={(evt) => handleAuctionHouseChange(evt.target.value)}
            disabled={isLoading}
            defaultValue=''
          >
            <option
              key='empty-value'
              value=''
            ></option>
            {auctionHouses.map((ah) => (
              <option
                key={ah.id}
                value={ah.id}
              >{`${ah.name.es_ES}`}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
