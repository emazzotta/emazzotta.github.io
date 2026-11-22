import { describe, expect, it } from 'bun:test';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');
const LEGAL = await Bun.file(path.join(ROOT, '_pages/legal.md')).text();
const SCRIPT_TAG = `<script type="module" src="{{ '/assets/js/opt-out.js' | relative_url }}"></script>`;

describe('the legal page', () => {
  it('should carry a hidden statistics switch with every label', () => {
    const tag = LEGAL.match(/<p [^>]*data-opt-out[^>]*>/)?.[0] ?? '';
    expect(tag).toContain(' hidden');
    ['data-turn-off', 'data-turn-on', 'data-is-on', 'data-is-off'].forEach((label) => expect(tag).toMatch(new RegExp(`${label}="[^"]+"`)));
    expect(LEGAL).toContain('data-opt-out-state');
  });

  it('should load the switch script as a module', async () => {
    expect(LEGAL).toContain(SCRIPT_TAG);
    expect(await Bun.file(path.join(ROOT, 'assets/js/opt-out.js')).exists()).toBe(true);
  });
});
