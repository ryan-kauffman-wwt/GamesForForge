import { generateReadme } from '../generateReadme';

describe('generateReadme', () => {
  describe('whack-a-mole', () => {
    let readme;

    beforeEach(() => {
      readme = generateReadme('whack-a-mole');
    });

    test('returns a string', () => {
      expect(typeof readme).toBe('string');
    });

    test('contains the game title', () => {
      expect(readme).toContain('Whack-a-Mole');
    });

    test('contains a How to Play section', () => {
      expect(readme).toContain('How to Play');
    });

    test('contains gameplay details (score, timer)', () => {
      expect(readme).toContain('60 seconds');
      expect(readme).toContain('point');
    });

    test('contains a Tech Stack section', () => {
      expect(readme).toContain('Tech Stack');
    });

    test('contains Getting Started instructions', () => {
      expect(readme).toContain('npm install');
      expect(readme).toContain('npm run dev');
    });

    test('is non-empty and substantial', () => {
      expect(readme.length).toBeGreaterThan(200);
    });
  });

  describe('unknown game (fallback)', () => {
    test('returns a generic readme for an unrecognised game', () => {
      const readme = generateReadme('mystery-game');
      expect(typeof readme).toBe('string');
      expect(readme).toContain('Mystery Game');
      expect(readme.length).toBeGreaterThan(100);
    });

    test('capitalises each word in the title', () => {
      const readme = generateReadme('word-search');
      expect(readme).toContain('Word Search');
    });
  });

  describe('input validation', () => {
    test('throws TypeError when called with no argument', () => {
      expect(() => generateReadme()).toThrow(TypeError);
    });

    test('throws TypeError when called with null', () => {
      expect(() => generateReadme(null)).toThrow(TypeError);
    });

    test('throws TypeError when called with a non-string', () => {
      expect(() => generateReadme(42)).toThrow(TypeError);
    });
  });
});
