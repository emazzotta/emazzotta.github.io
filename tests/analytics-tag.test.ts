import { describe, expect, it } from 'bun:test';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');
const read = (file: string): Promise<string> => Bun.file(path.join(ROOT, file)).text();

describe('the Umami tag', () => {
  it('should count page views only on the host in CNAME', async () => {
    const [config, include, cname] = await Promise.all([
      read('_config.yml'),
      read('_includes/analytics-providers/umami.html'),
      read('CNAME'),
    ]);

    expect(config).toMatch(new RegExp(`^ {4}domains +: "${cname.trim().replaceAll('.', '\\.')}"$`, 'm'));
    expect(include).toContain('data-domains="{{ site.analytics.umami.domains }}" data-do-not-track="true"');
  });
});
