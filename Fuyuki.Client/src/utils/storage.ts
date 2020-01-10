import Storage from 'ayaka/localStorage';

export interface StorageState {
  version: string;
  isDarkTheme: boolean;
}

const DEFAULTS: StorageState = {
  version: `1.0`,
  isDarkTheme: false
};

const s = new Storage<StorageState>('fuyukiUserSettings', DEFAULTS);

// Always apply latest DEFAULTS
s.upgrade((d) => ({ ...DEFAULTS, ...d }));

export default s;
