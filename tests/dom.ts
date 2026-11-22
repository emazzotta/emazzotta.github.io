import { afterAll } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

export const registerDom = (): void => {
  GlobalRegistrator.register({ settings: { device: { prefersReducedMotion: 'reduce' } } });
  afterAll(() => GlobalRegistrator.unregister());
};
