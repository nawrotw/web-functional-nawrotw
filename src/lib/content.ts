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

/**
 * Parse the content into sentences, and return an array of sentences.
 *
 * input: "<speak><s>This is a sentence.</s><s>This is another sentence</s></speak>",
 * sentences: ['This is a sentence.', 'This is another sentence']
 */
// Event if this code work, regexp can be optimized, but with more research. And right not I dont have a time,
// I will back to it at the end if possible
const sentenceSplitRegExp = new RegExp('<s>(.+?)<\\/s>', 'g')
const parseContentIntoSentences = (content: string): string[] => {
  if (!content) {
    throw new Error("This is not valid ssml");
  }

  const sentencesMatch = content.match(/<speak>(.*)<\/speak>/);
  if (!sentencesMatch || sentencesMatch?.length === 0) {
    throw new Error("This is not valid ssml");
    // return ['There was an error'];
  }
  // now split sentences
  return sentencesMatch.slice(1).flatMap(sentences => {
    const match = sentences.match(sentenceSplitRegExp);
    return match?.map(sentence => sentence
      .replace(/<\/?s>/g, '')
    )
  })
    .filter(Boolean) as string[];
};

export { fetchContent, parseContentIntoSentences };
