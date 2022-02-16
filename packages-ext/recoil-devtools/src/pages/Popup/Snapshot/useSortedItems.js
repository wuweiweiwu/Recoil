/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * Recoil DevTools browser extension.
 *
 * @emails oncall+recoil
 * @flow strict-local
 * @format
 */

import type {SerializedValue} from '../../../utils/Serialization';

import ConnectionContext from '../ConnectionContext';

import Item from '../Items/Item';
import {useSelectedTransaction} from '../useSelectionHooks';

import useSnapshot from './useSnapshot';

import * as React from 'react';
import {useContext, useMemo} from 'react';

type SnapshotNode = {
  name: string,
  content: SerializedValue,
};

export default function useSortedItems(): {
  atoms: Array<SnapshotNode>,
  selectors: Array<SnapshotNode>,
} {
  const connection = useContext(ConnectionContext);
  const [txID] = useSelectedTransaction();
  const localSnapshot = useSnapshot();
  const {snapshot, sortedKeys} = useMemo(() => {
    return {
      snapshot: localSnapshot,
      sortedKeys: Object.keys(localSnapshot ?? {}).sort(),
    };
  }, [localSnapshot]);

  const atoms = [];
  const selectors = [];

  if (connection != null && snapshot != null) {
    sortedKeys.forEach(key => {
      const node = connection.getNode(key);
      const list = node?.type === 'selector' ? selectors : atoms;
      list.push({name: key, content: snapshot[key]});
    });
  }
  return {atoms, selectors};
}
