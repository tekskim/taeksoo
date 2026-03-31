/**
 * Lock document scrolling (standalone/global overlays).
 *
 * Stores current scroll position and prevents body scroll.
 */
const lockGlobalScroll = () => {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
};

/**
 * Unlock document scrolling (standalone/global overlays).
 *
 * Restores previous scroll position.
 */
const unlockGlobalScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
};

/**
 * Lock scrolling on a specific element.
 *
 * Saves current overflow value and applies overflow: hidden.
 * @param el Target element to lock
 */
const lockElementScroll = (el: HTMLElement) => {
  if (!el) return;
  // 이미 잠금 상태면 무시
  if (el.dataset.scrollLocked === 'true') return;
  el.dataset.prevOverflow = el.style.overflow || '';
  el.style.overflow = 'hidden';
  el.dataset.scrollLocked = 'true';
};

/**
 * Unlock scrolling on a specific element.
 *
 * Restores previously saved overflow value.
 * @param el Target element to unlock
 */
const unlockElementScroll = (el: HTMLElement) => {
  if (!el) return;
  const prev = el.dataset.prevOverflow ?? '';
  el.style.overflow = prev;
  delete el.dataset.prevOverflow;
  delete el.dataset.scrollLocked;
};

export { lockGlobalScroll, unlockGlobalScroll, lockElementScroll, unlockElementScroll };
