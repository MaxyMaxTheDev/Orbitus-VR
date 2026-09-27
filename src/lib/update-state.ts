const IS_UPDATING_KEY = 'orbitus-vr-is-updating';
const BUILD_ID_KEY = 'orbitus-vr-build-id';
const PENDING_BUILD_ID_KEY = 'orbitus-vr-pending-build-id';
const UPDATE_STARTED_AT_KEY = 'orbitus-vr-update-started-at';
const UPDATE_DURATION_KEY = 'orbitus-vr-update-duration';

export const UPDATE_MIN_MS = 3 * 60 * 1000;
export const UPDATE_MAX_MS = 5 * 60 * 1000;
/** How often to re-ask /api/deployment while confirming the target build. */
export const UPDATE_VERIFY_POLL_MS = 1000;
/**
 * Grace period after the progress window to wait for the deploy to go live.
 * When it expires we accept the running build rather than failing the user:
 * the client cannot distinguish a rolled-back deploy from an alias or preview
 * URL whose SHA simply never matches, and the app is serving fine either way.
 */
export const UPDATE_VERIFY_TIMEOUT_MS = 20 * 1000;

function read(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

function write(key: string, value: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

function remove(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

export function getStoredBuildId(): string | null {
  return read(BUILD_ID_KEY);
}

export function setStoredBuildId(buildId: string) {
  write(BUILD_ID_KEY, buildId);
}

export function isUpdateInProgress(): boolean {
  return read(IS_UPDATING_KEY) === 'true';
}

/**
 * Called when the user clicks Update. Flags the session so the next boot shows
 * the updating screen, and remembers which build we are updating to.
 */
export function beginUpdate(buildId: string | null) {
  write(IS_UPDATING_KEY, 'true');
  remove(UPDATE_STARTED_AT_KEY);
  remove(UPDATE_DURATION_KEY);
  if (buildId) {
    write(PENDING_BUILD_ID_KEY, buildId);
  } else {
    remove(PENDING_BUILD_ID_KEY);
  }
}

/**
 * Called on the first boot after `beginUpdate`. The presence of a start
 * timestamp is what distinguishes a healthy boot-after-update from a refresh
 * that interrupted an update already in flight.
 */
export function markUpdateAttemptStarted() {
  if (read(UPDATE_STARTED_AT_KEY) !== null) return;
  write(UPDATE_STARTED_AT_KEY, String(Date.now()));
  write(
    UPDATE_DURATION_KEY,
    String(UPDATE_MIN_MS + Math.random() * (UPDATE_MAX_MS - UPDATE_MIN_MS)),
  );
}

export function getUpdateStartedAt(): number | null {
  const raw = read(UPDATE_STARTED_AT_KEY);
  if (raw === null) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getUpdateDuration(): number {
  const parsed = Number(read(UPDATE_DURATION_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : UPDATE_MIN_MS;
}

/** The build we are updating *to*, used to confirm the deploy actually went live. */
export function getPendingBuildId(): string | null {
  return read(PENDING_BUILD_ID_KEY);
}

/**
 * Called once the update window elapses and the target build has either been
 * confirmed live or waited out, so we never leave a stale build id behind.
 */
export function completeUpdate() {
  const pendingBuildId = read(PENDING_BUILD_ID_KEY);
  if (pendingBuildId) {
    setStoredBuildId(pendingBuildId);
  }
  remove(IS_UPDATING_KEY);
  remove(PENDING_BUILD_ID_KEY);
  remove(UPDATE_STARTED_AT_KEY);
  remove(UPDATE_DURATION_KEY);
}
