import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { queryGemini } from './gemini';

const originalFetch = global.fetch;

describe('queryGemini', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('formats prompt with conversation history and returns parsed JSON when response is JSON string', async () => {
    const prompt = 'Apa itu React?';
    const history = [
      { isBot: false, text: 'Halo' },
      { isBot: true, text: 'Hai, ada yang bisa saya bantu?' },
    ];

    const responseJSON = {
      section: {
        question: 'Apa itu React?',
        answer: 'React adalah library UI...',
        summary: 'Ringkasan singkat.',
        resourcesSection: {
          title: 'Sumber & Referensi Belajar',
          links: [{ label: 'React', url: 'https://react.dev' }],
        },
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ text: JSON.stringify(responseJSON) }),
    });

    const result = await queryGemini(prompt, history);
    expect(JSON.parse(result)).toEqual(responseJSON);

    // Ensure fetch called with formatted body including history markers
    const body = JSON.parse(global.fetch.mock.calls[0][1].body).prompt;
    expect(body).toContain('User: Halo');
    expect(body).toContain('Assistant: Hai, ada yang bisa saya bantu?');
    expect(body).toContain(prompt);
  });

  it('extracts JSON from text when response contains extra text', async () => {
    const wrapped = 'Some intro... {"section": {"question": "Q", "answer": "A", "summary": "S", "resourcesSection": {"title": "T", "links": []}}} ...tail';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ text: wrapped }),
    });

    const result = await queryGemini('Q');
    const parsed = JSON.parse(result);
    expect(parsed.section.question).toBe('Q');
  });

  it('returns fallback structured error JSON when no JSON can be parsed', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ text: 'plain text without json' }),
    });

    const result = await queryGemini('Test');
    const parsed = JSON.parse(result);
    expect(parsed.question).toBe('Test');
    expect(parsed.summary).toBeDefined();
  });

  it('throws with server error including status text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      text: vi.fn().mockResolvedValue('Internal error'),
    });

    await expect(queryGemini('X')).rejects.toThrow('Could not get a response. Please try again.');
  });
});
