declare module 'react-native-version-check' {
  export function getLatestVersion(): Promise<string>;
  export function getCurrentVersion(): string;
  export function needUpdate({
    currentVersion,
    latestVersion,
  }: {
    currentVersion: string;
    latestVersion: string;
  }): Promise<{
    isNeeded: boolean;
  }>;
  export function getAppStoreUrl({}: any): Promise<string>;
  export function getPlayStoreUrl({}: any): Promise<string>;
  export function getLatestVersion({
    provider,
  }: {
    provider: string;
  }): Promise<string>;
  export function getPackageName(): Promise<string>;
  export function getCountry(): Promise<string>;
}
