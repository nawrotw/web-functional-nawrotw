const API_URL = "http://localhost:5174/content";

interface ContentResp {
  content: string;
}

/**
 * Fetch the content from the api
 * In case of an error, return content as "<speak><s>There was an error</s></speak>"
 */
const fetchContent = async (url = API_URL): Promise<string> => {

  const response = await fetch(url);
  if (response.ok) {
    const { content } = await response.json() as ContentResp;
    return content;
  }
  return Promise.resolve("<speak><s>There was an error</s></speak>");
};

// Creating RegExp is an expensive task, so it is better to created them once and reuse.
const sentenceSplitRegExp = new RegExp('<s>(.+?)<\\/s>', 'g');
const searchRegExp = /<\/?s>/g;
/**
 * Parse the content into sentences, and return an array of sentences.
 *
 * input: "<speak><s>This is a sentence.</s><s>This is another sentence</s></speak>",
 * sentences: ['This is a sentence.', 'This is another sentence']
 */
const parseContentIntoSentences = (content: string): string[] => {
  if (!content) {
    throw new Error("This is not valid ssml");
  }

  const speakContentMatch = content.match(/<speak>(.*)<\/speak>/);
  if (!speakContentMatch || speakContentMatch?.length === 0) {
    throw new Error("This is not valid ssml");
  }
  // now parse sentences from speak element/s
  return speakContentMatch.slice(1).flatMap(speakContent => {
    return speakContent
        .match(sentenceSplitRegExp)
        ?.map(sentence =>
          sentence.replace(searchRegExp, '')
        );
    }
  )
    .filter(Boolean) as string[];
};

export { fetchContent, parseContentIntoSentences };
