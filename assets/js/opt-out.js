const OPT_OUT_KEY = 'umami.disabled';

const usableStorage = () => {
  try {
    const store = window.localStorage;
    store.getItem(OPT_OUT_KEY);
    return store;
  } catch {
    return null;
  }
};

// Umami's script skips a page view when this entry is truthy, so read it the same way.
const isOptedOut = (store) => Boolean(store.getItem(OPT_OUT_KEY));

const toggleOptOut = (store) => {
  if (isOptedOut(store)) store.removeItem(OPT_OUT_KEY);
  else store.setItem(OPT_OUT_KEY, '1');
  return isOptedOut(store);
};

const box = document.querySelector('[data-opt-out]');
const state = box?.querySelector('[data-opt-out-state]');
const button = box?.querySelector('button');
const store = usableStorage();
if (box && state && button && store) {
  const show = (off) => {
    state.textContent = off ? box.dataset.isOff : box.dataset.isOn;
    button.textContent = off ? box.dataset.turnOn : box.dataset.turnOff;
  };
  button.addEventListener('click', () => show(toggleOptOut(store)));
  show(isOptedOut(store));
  box.hidden = false;
}
