import { setupServer } from 'msw/node'
import { beforeAll, describe, expect, it, afterEach, } from 'vitest';

import { fetchContent } from '../lib/content';
import { handlers } from './mocks/handlers';

const server = setupServer();

describe("fetchContent Test Suite", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
    return () => server.close();
  });
  afterEach(() => {
    server.resetHandlers();
  });

  it("fetches content from url and returns the content as string", async () => {
    server.use(...handlers.success);
    const content = await fetchContent();
    expect(content).toBeTypeOf("string");
    expect(content).toEqual(
      "<speak><s>This is a sentence.</s><s>This is another sentence</s>Some more text<s>This is a longer piece of content</s></speak>"
    );
  });

  it('returns a fixed error string on failure "<speak><s>There was an error</s></speak>" ', async () => {
    server.use(...handlers.error);
    const content = await fetchContent();
    expect(content).equals("<speak><s>There was an error</s></speak>");
  });
});
