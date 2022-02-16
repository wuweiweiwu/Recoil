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

import {useSelectedTransaction} from '../useSelectionHooks';

import {useContext} from 'react';

export default function useSnapshot(): void | {[string]: SerializedValue} {
  const connection = useContext(ConnectionContext);
  const [txID] = useSelectedTransaction();
  const snapshot = connection?.tree?.getSnapshot(txID);
  return snapshot;
}
