import { User } from 'oidc-client-ts';
import React, { useState } from 'react';
import { useEffect } from 'react';

import { AuctionHouseFilter } from './components/auction-house-filter/AuctionHouseFilter';
import { RealmFilter } from './components/realm-filter/RealmFilter';
import { authenticationService } from './services';
import { InterceptorService } from './services';
import { LoginMetadataInterface } from './shared/interfaces';
import { isNullOrEmpty } from './shared/utils';
import { Auctions } from './components/auctions/Auctions';
import { Modal } from './shared/components';
import { NewAuction } from './components/new-auction/NewAuction';

import './App.scss';

function App(): JSX.Element {
  const [battleTag, setBattleTag] = useState<string | undefined>();
  const [appIsConfigured, setAppIsConfigured] = useState<boolean>(false);
  const [currentRealm, setCurrentRealm] = useState<string | undefined>();
  const [currentAuctionHouse, setCurrentAuctionHouse] = useState<
    string | undefined
  >();
  const [isNewAuctionModalOpen, setIsNewAuctionModalOpen] =
    useState<boolean>(false);

  const handleRealmChange = (newRealmId: string) => {
    setCurrentRealm(newRealmId);
    setCurrentAuctionHouse(undefined);
  };

  const handleAddAuction = () => {
    setIsNewAuctionModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsNewAuctionModalOpen(false);
  };

  useEffect(() => {
    setAppIsConfigured(InterceptorService());
    if (!authenticationService.isAuthenticated()) {
      if (!isNullOrEmpty(authenticationService.getAccessCode())) {
        void authenticationService.getAccessToken();
      } else {
        void authenticationService
          .signinRedirectCallback()
          .then((user: User | null) => {
            const userInfo = user as unknown as LoginMetadataInterface;
            setBattleTag(userInfo.profile.battle_tag);
          });
        void authenticationService.signInRedirect();
      }
    } else {
      const userInfo = authenticationService.getUserInfoFromStorage();
      if (userInfo) setBattleTag(userInfo.profile.battle_tag);
    }
  }, []);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Visor de casa de subastas de World of Warcraft Classic</h1>
        {battleTag}
      </header>
      {appIsConfigured && (
        <main>
          <div className='filters'>
            <RealmFilter handleRealmChange={handleRealmChange} />
            {currentRealm && (
              <AuctionHouseFilter
                realmId={currentRealm}
                handleAuctionHouseChange={setCurrentAuctionHouse}
              />
            )}
            {currentRealm && currentAuctionHouse && (
              <button
                className='add-auction'
                onClick={handleAddAuction}
              >
                Crear subasta
              </button>
            )}
          </div>
          {currentRealm && currentAuctionHouse && (
            <Auctions
              realmId={currentRealm}
              auctionHouseId={currentAuctionHouse}
            />
          )}
          <Modal
            isOpen={isNewAuctionModalOpen}
            onClose={handleCloseModal}
            title='Crea una subasta'
          >
            <NewAuction handleCancel={handleCloseModal} />
          </Modal>
        </main>
      )}
      <footer>Prueba de concepto por David Díez para DEUS</footer>
    </div>
  );
}

export default App;
