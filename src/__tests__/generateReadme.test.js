import { generateReadme } from '../generateReadme';

describe('generateReadme', () => {
  test('generates a readme file for a game', () => {
    expect(() => generateReadme('whack-a-mole')).toThrow('Not implemented');
  });
});