import React, { useContext, useEffect, useState } from 'react';

import { StoreContext } from '../../contexts/store.context';
import { ItemQualityEnum } from '../../shared/enums/battlenet/item-quality.enum';
import { StoreContextInterface } from '../../shared/interfaces';

import './NewAuction.scss';

interface InternalItemInterface {
  id: string;
  name?: string;
  media?: string;
  quality?: ItemQualityEnum;
}

interface FindInStorageParamsInterface {
  items: [string, string][];
  itemId: string;
  propName: 'name' | 'img';
}

interface NewAuctionProps {
  handleCancel: () => void;
}

export const NewAuction = ({ handleCancel }: NewAuctionProps): JSX.Element => {
  const storeContext = useContext<StoreContextInterface>(StoreContext);
  const [items, setItems] = useState<InternalItemInterface[]>([]);
  const [selectedItem, setSelectedItem] = useState<
    InternalItemInterface | undefined
  >();
  const [noItemSelected, setNoItemSelected] = useState<boolean>(false);
  const [noBid, setNoBid] = useState<boolean>(false);
  const [bidBiggerThanBuyout, setBidBiggerThanBuyout] =
    useState<boolean>(false);
  const [newBid, setNewBid] = useState<number>(0);
  const [newBuyout, setNewBuyout] = useState<number>(0);
  // const selectRef = useRef<HTMLSelectElement>(null);
  const [selectClass, setSelectClass] = useState<string | undefined>();

  const handleCreateAuction = () => {
    if (!selectedItem) {
      setNoItemSelected(true);
      return;
    }
    if (newBid === 0) {
      setNoBid(true);
      return;
    }
    if (newBid > newBuyout && newBuyout > 0) {
      setBidBiggerThanBuyout(true);
      return;
    }
    storeContext.changeCache({
      newAuction: {
        itemId: selectedItem.id,
        bid: newBid,
        buyout: newBuyout,
      },
    });
    handleCancel();
  };

  const handleItemChange = (newItemId: string) => {
    setNoItemSelected(false);
    const newItem = items.find((i) => i.id === newItemId);
    setSelectedItem(newItem);
    setSelectClass(newItem?.quality?.toLocaleLowerCase() ?? '');
    // if (selectRef.current) {
    //   const select: HTMLSelectElement = selectRef.current;
    //   select.className = newItem?.quality?.toLocaleLowerCase() ?? '';
    // }
    /*
    TODO: Usar el ref aquí no está bien, porque da lugar a bugs, como cuando sale el modal 
     y automáticamente das a crear subasta para que salte la primera validación, para
     cambiar el valor del item y si te fijas "no se aplica" la clase; esto sucede porque, 
     aunque por código sí has cambiado la clase, react no lo va a reflejar hasta el siguiente render,
     useRef es un hook muy útil (para observar el dom, para modificar flags...), pero aquí no procede.
    TODOENG: useRef here does no good, it's prone to bugs, like when the modal pops up and 
     automatically you create an auction in order to trigger the first validation and change the
     item value, and if you pay close attention "it doesn't applies" the class name; this occurs because,
     although the code does change the class name, react is not going to replicate that change till the next render,
     useRef is a very handy hook (watching the dom, modifiyng flags...), but we should'nt apply it's use here.
    */
  };

  const handleBidChange = (newBid: number) => {
    setNoBid(false);
    setNewBid(newBid);
  };

  const handleBuyoutChange = (newBid: number) => {
    setBidBiggerThanBuyout(false);
    setNewBuyout(newBid);
  };

  const findInStorage = ({
    items,
    itemId,
    propName,
  }: FindInStorageParamsInterface): string | undefined => {
    const item = items.find(
      ([k]) => k.includes(itemId) && k.includes(propName)
    );
    return item ? item[1] : undefined;
  };

  useEffect(() => {
    const itemsAndMediaInStorage = Object.entries(window.localStorage).filter(
      ([key]) => key.includes('item:')
    );
    let newItems: InternalItemInterface[] = [];
    const imagesInStorage = itemsAndMediaInStorage.filter(([k]) =>
      k.includes('img')
    );
    const itemsInStorage = itemsAndMediaInStorage.filter(
      ([k]) => !k.includes('img')
    );
    for (const [, value] of itemsInStorage) {
      const storedItem = JSON.parse(value as string) as InternalItemInterface;
      const id = storedItem.id.toString();
      const newItem: InternalItemInterface = {
        id,
        name: storedItem.name,
        media: findInStorage({
          items: imagesInStorage as [string, string][],
          itemId: id,
          propName: 'img',
        }),
        quality: storedItem.quality,
      };

      const index = newItems.findIndex((i) => i.id === newItem.id);
      if (!newItems.some((i) => i.id === id))
        newItems.push({
          id,
          name: newItem.name,
          media: newItem.media,
          quality: newItem.quality,
        });
      else {
        newItems = [
          ...newItems.slice(0, index),
          newItem,
          ...newItems.slice(index + 1),
        ];
      }
    }
    setItems(newItems);
  }, []);

  return (
    <div className='new-auction'>
      {items.length === 0 ? (
        <div className='empty-items'>
          Para evitar el throttling a la API haz una búsqueda de subastas para
          así poder conseguir objetos para el localStorage. Ahora mismo el
          localStorage no tiene objetos, aliméntale!
        </div>
      ) : (
        <></>
      )}
      {items.length > 0 ? (
        <div className='item-to-auction'>
          Elije un objeto&nbsp;
          <select
            id='items'
            onChange={(evt) => handleItemChange(evt.target.value)}
            className={`${selectClass ?? ''}${
              noItemSelected ? ' error' : ''
            }`.trim()}
            defaultValue=''
            // ref={selectRef}
          >
            <option
              key='empty-value'
              value=''
            ></option>
            {items.map((i) => (
              <option
                key={i.id}
                value={i.id}
                className={i.quality?.toLocaleLowerCase()}
              >
                {i.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <></>
      )}
      <div className='bid'>
        Elije una puja inicial&nbsp;
        <input
          type='text'
          value={newBid}
          onChange={(evt) => handleBidChange(parseInt(evt.target.value))}
          className={noBid ? 'error' : ''}
        />
      </div>
      <div className='buyout'>
        Elije un precio de compra&nbsp;
        <input
          type='text'
          value={newBuyout}
          onChange={(evt) => handleBuyoutChange(parseInt(evt.target.value))}
          className={bidBiggerThanBuyout ? ' error' : ''}
        />
      </div>
      <div className='actions'>
        <button
          onClick={handleCreateAuction}
          disabled={noItemSelected}
        >
          Crear subasta
        </button>
        <button onClick={handleCancel}>Cancelar</button>
      </div>
    </div>
  );
};
