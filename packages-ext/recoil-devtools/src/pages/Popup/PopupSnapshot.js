/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * Recoil DevTools browser extension.
 *
 * @emails oncall+recoil
 * @flow strict-local
 * @format
 */
'use strict';

import type {SnapshotType} from '../../types/DevtoolsTypes';
import type {Node} from 'react';

import React, {useContext, useMemo, useState} from 'react';

import ConnectionContext from './ConnectionContext';
import Item from './Items/Item';
import SnapshotSearch from './Snapshot/SnapshotSearch.react';
import {useSelectedTransaction} from './useSelectionHooks';
import SnapshotContext from './Snapshot/SnapshotContext';
import AtomsList from './Snapshot/AtomsList.react';
import SelectorsList from './Snapshot/SelectorsList.react';

const styles = {
  container: {
    paddingLeft: 8,
  },
  item: {
    marginBottom: 16,
  },
};

function SnapshotRenderer(): React$Node {
  const [searchVal, setSearchVal] = useState('');
  const connection = useContext(ConnectionContext);
  const [txID] = useSelectedTransaction();
  const {snapshot, sortedKeys} = useMemo(() => {
    const localSnapshot = connection?.tree?.getSnapshot(txID);
    return {
      snapshot: localSnapshot,
      sortedKeys: Object.keys(localSnapshot ?? {}).sort(),
    };
  }, [connection, txID]);

  if (snapshot == null || connection == null) {
    return null;
  }

  const atoms = [];
  const selectors = [];
  sortedKeys.forEach(key => {
    const node = connection.getNode(key);
    const list = node?.type === 'selector' ? selectors : atoms;
    list.push(
      <Item
        isRoot={true}
        name={key}
        key={key}
        content={snapshot[key]}
        node={node}
      />,
    );
  });

  return (
    <SnapshotContext.Provider value={{searchVal, setSearchVal}}>
      <div style={styles.container}>
        <SnapshotSearch />
        <AtomsList />
        <SelectorsList />
      </div>
    </SnapshotContext.Provider>
  );
}

export default SnapshotRenderer;
