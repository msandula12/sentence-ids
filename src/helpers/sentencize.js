import { nanoid } from "nanoid";

const sentenceEndings = new Set([".", "?", "!", "\n"]);

/**
 * Takes a string and returns a list of sentence objects.
 */
const sentencize = (text) => {
  const sentences = [];
  const offsets = [];
  let sentenceStart = 0;

  for (let i = 0; i < text.length; i++) {
    if (sentenceEndings.has(text[i])) {
      sentences.push(text.substring(sentenceStart, i + 1));
      offsets.push(sentenceStart);
      sentenceStart = i + 1;
    }
  }

  if (sentenceStart < text.length) {
    sentences.push(text.substring(sentenceStart, text.length + 1));
    offsets.push(sentenceStart);
  }

  return sentences.map((sentence, index) => ({
    id: nanoid(),
    length: sentence.length,
    offset: offsets[index],
    sentence,
  }));
};

export default sentencize;
