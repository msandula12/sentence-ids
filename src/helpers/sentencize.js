import { nanoid } from "nanoid";

/**
 * Takes a string and returns a list of sentence objects.
 */
const sentencize = (text) => {
  const sentenceEndings = [".", "?", "!", "\n"];

  let sentences = [];
  let offsets = [];
  let sentenceStart = 0;

  for (let i = 0; i < text.length; i++) {
    if (sentenceEndings.includes(text[i])) {
      sentences.push(text.substring(sentenceStart, i + 1));
      offsets.push(sentenceStart);
      sentenceStart = i + 1;
    }
  }

  if (sentenceStart < text.length) {
    sentences.push(text.substring(sentenceStart, text.length + 1));
    offsets.push(sentenceStart);
  }

  let results = [];

  for (let i = 0; i < sentences.length; i++) {
    let sentence = sentences[i];
    let offset = offsets[i];
    results.push({
      id: nanoid(),
      length: sentence.length,
      offset: offset,
      sentence: sentence,
    });
  }

  return results;
};

export default sentencize;
