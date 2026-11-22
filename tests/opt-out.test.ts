import { beforeEach, describe, expect, it } from 'bun:test';
import path from 'node:path';
import { registerDom } from './dom';

registerDom();

const SCRIPT = await Bun.file(path.resolve(import.meta.dir, '../assets/js/opt-out.js')).text();
const OPT_OUT_KEY = 'umami.disabled';
const SWITCH = '<p data-opt-out data-turn-off="Turn off statistics for this browser" data-turn-on="Turn statistics back on" data-is-on="Statistics are on for this browser." data-is-off="Statistics are off for this browser." hidden><span role="status" data-opt-out-state></span> <button type="button"></button></p>';

const runSwitch = (): void => {
  new Function(SCRIPT)();
};
const box = (): HTMLElement => document.querySelector<HTMLElement>('[data-opt-out]') as HTMLElement;
const button = (): HTMLButtonElement => box().querySelector('button') as HTMLButtonElement;

describe('the statistics switch script', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = SWITCH;
  });

  it('should show the switch and say that statistics are on', () => {
    runSwitch();
    expect(box().hidden).toBe(false);
    expect(box().textContent).toContain('Statistics are on for this browser.');
    expect(button().textContent).toBe('Turn off statistics for this browser');
  });

  it('should store the entry Umami checks and say that statistics are off when clicked', () => {
    runSwitch();
    button().click();
    expect(localStorage.getItem(OPT_OUT_KEY)).toBe('1');
    expect(box().textContent).toContain('Statistics are off for this browser.');
    expect(button().textContent).toBe('Turn statistics back on');
  });

  it('should delete the entry when clicked a second time', () => {
    runSwitch();
    button().click();
    button().click();
    expect(localStorage.getItem(OPT_OUT_KEY)).toBeNull();
    expect(button().textContent).toBe('Turn off statistics for this browser');
  });

  it('should start from the choice of an earlier visit', () => {
    localStorage.setItem(OPT_OUT_KEY, '1');
    runSwitch();
    expect(button().textContent).toBe('Turn statistics back on');
  });

  it('should treat an empty entry as statistics on, as Umami does', () => {
    localStorage.setItem(OPT_OUT_KEY, '');
    runSwitch();
    expect(button().textContent).toBe('Turn off statistics for this browser');
  });

  it('should keep the switch hidden when the browser blocks local storage', () => {
    const storage = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => {
        throw new DOMException('denied', 'SecurityError');
      },
    });
    try {
      runSwitch();
    } finally {
      if (storage) Object.defineProperty(window, 'localStorage', storage);
    }
    expect(box().hidden).toBe(true);
  });

  it('should do nothing on a page without the switch', () => {
    document.body.innerHTML = '<p>No switch here</p>';
    expect(runSwitch).not.toThrow();
  });
});
