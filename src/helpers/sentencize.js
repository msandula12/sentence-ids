import { nanoid } from "nanoid";
import tokenizer from "sbd";

/**
 * Overrides sbd's default options.
 * https://github.com/Tessmore/sbd
 */
const TOKENIZER_OPTIONS = {
  preserve_whitespace: true,
};

/**
 * Takes a string and returns a list of sentence objects.
 */
const sentencize = (text) => {
  let offset = 0;

  return tokenizer.sentences(text, TOKENIZER_OPTIONS).map((sentence) => {
    const sentencized = {
      id: nanoid(),
      length: sentence.length,
      offset,
      sentence,
    };
    offset += sentence.length;
    return sentencized;
  });
};

export default sentencize;
