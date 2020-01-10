import { useState, useCallback } from 'react';

import storage, { StorageState } from '../utils/storage';

export function useStorage(key: keyof StorageState) {
  const setting = storage.getKey(key);
  const [value, setState] = useState(setting);

  const setWrappedState = useCallback(
    (newValue) => {
      const isObject = typeof newValue === 'object';
      const currentSetting = storage.getKey(key);
      const currentSettingObj =
        typeof currentSetting === 'object' ? currentSetting : {};

      const data = isObject
        ? { [key]: { ...currentSettingObj, ...newValue } }
        : { [key]: newValue };

      const updated = storage.set(data)[key];
      setState(updated);
    },
    [key]
  );

  return [value, setWrappedState];
}
