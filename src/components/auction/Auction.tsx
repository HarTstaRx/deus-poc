import React, { useState, useEffect } from 'react';
import { ItemQualityEnum } from '../../shared/enums/battlenet/item-quality.enum';

import { AuctionInterface } from '../../shared/interfaces/battlenet/auctions/auction.interface';

import './Auction.scss';

interface AuctionProps extends AuctionInterface {
  areItemsLoaded?: boolean;
  handleBuyout: (auctionId: string) => void;
}

export const Auction = ({
  id,
  bid,
  item,
  quantity,
  time_left,
  buyout,
  areItemsLoaded,
  handleBuyout,
  quality,
}: AuctionProps): JSX.Element => {
  const [itemName, setItemName] = useState<string | undefined>();
  const [itemQuality, setItemQuality] = useState<ItemQualityEnum | undefined>(
    quality
  );
  const [itemSrc, setItemSrc] = useState<string | undefined>();
  const [showBidding, setShowBidding] = useState<boolean>(false);
  const [showBidError, setShowBidError] = useState<boolean>(false);
  const [showBuyError, setShowBuyError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBidded, setIsBidded] = useState<boolean>(false);
  const [currentBid, setCurrentBid] = useState<number>(bid);
  const [newBid, setNewBid] = useState<number>(currentBid);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleBid = () => setShowBidding(true);

  const handleMakeBuyout = async () => {
    setIsLoading(true);
    await wait(1000);
    handleBuyout(id);
    setIsLoading(false);
  };

  const handleMakeBid = async () => {
    if (newBid <= currentBid) {
      setShowBidError(true);
      return;
    }
    if (newBid > buyout) {
      setShowBuyError(true);
      return;
    }
    setShowBidError(false);
    setShowBuyError(false);
    setIsLoading(true);
    await wait(1000);
    setCurrentBid(newBid);
    setIsLoading(false);
    setShowBidding(false);
    setIsBidded(true);
  };

  const handleCancelBid = () => {
    setNewBid(currentBid);
    setShowBidError(false);
    setShowBuyError(false);
    setShowBidding(false);
  };

  const makeItTwoNumbersToString = (numberToFix: number): string => {
    if (numberToFix === 0) return '00';
    if (numberToFix < 10) return `0${numberToFix}`;
    return numberToFix.toLocaleString();
  };

  const getGold = (money: number): string => {
    const gold = Math.floor(money / 10000);
    return makeItTwoNumbersToString(gold);
  };

  const getSilver = (money: number): string => {
    const silverAndGold = Math.floor(money / 100);
    const silverAndGoldString = makeItTwoNumbersToString(silverAndGold);
    if (silverAndGold < 100) return silverAndGoldString;
    return silverAndGoldString.substring(silverAndGoldString.length - 2);
  };

  const getCopper = (money: number): string => {
    if (money < 100) return makeItTwoNumbersToString(money);
    const sMoney = money.toString();
    const copper = sMoney.substring(sMoney.length - 2);
    return makeItTwoNumbersToString(parseInt(copper));
  };

  const printCurrency = (currency: number): JSX.Element => {
    if (currency === 0) return <></>;
    return (
      <div
        className='currency'
        data-value={currency}
      >
        <span className='gold'>
          {getGold(currency)}
          <img
            alt='oro'
            src='https://wow.zamimg.com/images/icons/money-gold.gif'
          />
        </span>
        <span className='silver'>
          {getSilver(currency)}
          <img
            alt='plata'
            src='https://wow.zamimg.com/images/icons/money-silver.gif'
          />
        </span>
        <span className='copper'>
          {getCopper(currency)}
          <img
            alt='cobre'
            src='https://wow.zamimg.com/images/icons/money-copper.gif'
          />
        </span>
      </div>
    );
  };

  interface StoredItemInterface {
    id: string;
    name: string;
    quality: ItemQualityEnum;
  }
  useEffect(() => {
    const localStorageItem = window.localStorage.getItem(`item:${item.id}`);
    if (!localStorageItem) return;
    const storedItem = JSON.parse(
      window.localStorage.getItem(`item:${item.id}`) ?? ''
    ) as StoredItemInterface;
    if (storedItem) {
      setItemName(storedItem.name);
      setItemQuality(storedItem.quality);
    }
    const src = window.localStorage.getItem(`item:${item.id}:img`);
    if (src) setItemSrc(src);
  }, [areItemsLoaded, item.id]);

  return (
    <li
      className='auction'
      id={id}
    >
      <span
        className='item'
        id={item.id}
        title={itemName}
      >
        <img
          src={itemSrc}
          alt={itemName}
        />
        &nbsp;
        <span
          className={`item-name${
            itemQuality ? ` ${itemQuality.toLocaleLowerCase()}` : ''
          }`}
        >
          {itemName && itemName.length > 15
            ? `${itemName.substring(0, 13)}...`
            : itemName}
        </span>
      </span>
      <span className={`bid${showBidding && showBidError ? ' error' : ''}`}>
        {printCurrency(currentBid)}
      </span>
      <span className={`buyout${showBidding && showBuyError ? ' error' : ''}`}>
        {printCurrency(buyout)}
      </span>
      <span className='quantity'>{quantity}</span>
      <span className='time_left'>{time_left}</span>
      <span className='actions'>
        {!showBidding && (
          <button
            className='bid-action'
            onClick={handleBid}
            disabled={isBidded}
          >
            Pujar
          </button>
        )}
        {showBidding && (
          <span className='bidding'>
            <input
              type='text'
              value={newBid}
              onChange={(evt) => setNewBid(parseInt(evt.target.value))}
            />
            <button
              className='make-bid'
              onClick={() => void handleMakeBid()}
              disabled={isLoading}
            >
              ✅
            </button>
            <button
              className='cancel'
              onClick={handleCancelBid}
              disabled={isLoading}
            >
              ❌
            </button>
          </span>
        )}
        <button
          className='make-buyout'
          onClick={() => void handleMakeBuyout()}
          disabled={isLoading}
        >
          Comprar
        </button>
      </span>
    </li>
  );
};
