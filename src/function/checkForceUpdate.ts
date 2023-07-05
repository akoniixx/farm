export function isForceUpdate({
  currentVersion,
  latestVersion,
}: {
  currentVersion: string;
  latestVersion: string;
}): boolean {
  const gapVersion = 3;
  const prevNumbers = currentVersion.split('.').map(Number);
  const currentNumbers = latestVersion.split('.').map(Number);

  // Check if the length is 1 or 2
  const firstNumberChanged = prevNumbers[0] !== currentNumbers[0];
  const twoNumberChanged = prevNumbers[1] !== currentNumbers[1];

  const lastNumberChanged =
    prevNumbers.slice(-1)[0] !== currentNumbers.slice(-1)[0] &&
    currentNumbers.slice(-1)[0] - prevNumbers.slice(-1)[0] <= gapVersion;

  return twoNumberChanged || firstNumberChanged || lastNumberChanged;
}
