import { updateSentences } from "./editor";

jest.mock("nanoid", () => () => ({
  nanoid: () => {},
}));

const INITIAL_STATE = [];

const partialSentence = {
  id: "some-unique-id-1a",
  length: 1,
  offset: 0,
  sentence: "T",
};

const firstSentence = {
  id: "some-unique-id-1a",
  length: 20,
  offset: 0,
  sentence: "This is a sentence. ",
};

const secondSentence = {
  id: "some-unique-id-2a",
  length: 20,
  offset: 20,
  sentence: "And this is one too.",
};

describe("updateSentences function", () => {
  it("should return new sentences if no previous sentences", () => {
    const newSentences = [partialSentence];
    const offset = 1;
    expect(updateSentences(INITIAL_STATE, newSentences, offset)).toEqual(
      newSentences
    );
  });
  it("should keep previous ID when updating existing sentence", () => {
    const previousSentences = [partialSentence];
    const newSentences = [
      {
        ...partialSentence,
        id: "some-unique-id-1b",
        length: 2,
        sentence: "Th",
      },
    ];
    const offset = 2;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        ...partialSentence,
        length: 2,
        sentence: "Th",
      },
    ]);
  });
  it("should handle adding a new sentence", () => {
    const previousSentences = [firstSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
      },
      secondSentence,
    ];
    const offset = 40;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      firstSentence,
      secondSentence,
    ]);
  });
  it("should keep sentences before offset intact", () => {
    const previousSentences = [firstSentence, secondSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
      },
      {
        ...secondSentence,
        id: "some-unique-id-2b",
        length: 21,
        sentence: "Andd this is one too.",
      },
    ];
    const offset = 24;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      firstSentence,
      {
        ...secondSentence,
        length: 21,
        sentence: "Andd this is one too.",
      },
    ]);
  });
  it("should keep update sentences after offset, but keep previous IDs", () => {
    const previousSentences = [firstSentence, secondSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
        length: 21,
        sentence: "This is an sentence. ",
      },
      {
        ...secondSentence,
        id: "some-unique-id-2b",
        offset: 21,
      },
    ];
    const offset = 10;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        ...firstSentence,
        length: 21,
        sentence: "This is an sentence. ",
      },
      {
        ...secondSentence,
        offset: 21,
      },
    ]);
  });
  it.skip("should handle multiple paragraphs", () => {});
  it("should handle deleting a single character", () => {
    const previousSentences = [firstSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
        length: 19,
        sentence: "Thi is a sentence. ",
      },
    ];
    const offset = 3;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        ...firstSentence,
        length: 19,
        sentence: "Thi is a sentence. ",
      },
    ]);
  });
  it.skip("should handle deleting a sentence", () => {});
  it.skip("should handle merging two sentences", () => {});
  it.skip("should handle pasting text", () => {});
  it.skip("should handle cutting text", () => {});
});
