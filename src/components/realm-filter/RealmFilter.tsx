import React, { useState, useEffect } from 'react';

import { battlenetService } from '../../services';
import { RealmInterface } from '../../shared/interfaces';

import './RealmFilter.scss';

interface RealmFilterProps {
  handleRealmChange: (newRealmId: string) => void;
}

export const RealmFilter = ({
  handleRealmChange,
}: RealmFilterProps): JSX.Element => {
  const [realms, setRealms] = useState<RealmInterface[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    battlenetService
      .getRealms()
      .then((paginatedData) => {
        setRealms(
          paginatedData.results.flatMap(
            (connectedRealm) => connectedRealm.data.realms
          )
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className='realm-filter'>
      {realms && (
        <>
          Selecciona un reino&nbsp;
          <select
            id='realms'
            onChange={(evt) => handleRealmChange(evt.target.value)}
            disabled={isLoading}
            defaultValue=''
          >
            <option
              key='empty-value'
              value=''
            ></option>
            {realms.map((realm) => (
              <option
                key={realm.id}
                value={realm.id}
              >{`[${realm.category.es_ES}] ${realm.name.es_ES}`}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
