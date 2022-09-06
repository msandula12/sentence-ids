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
    const lengthOfUpdate = 1;
    expect(
      updateSentences(INITIAL_STATE, newSentences, offset, lengthOfUpdate)
    ).toEqual(newSentences);
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
    const lengthOfUpdate = 1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
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
    const lengthOfUpdate = 20;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([firstSentence, secondSentence]);
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
    const lengthOfUpdate = 1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      firstSentence,
      {
        ...secondSentence,
        length: 21,
        sentence: "Andd this is one too.",
      },
    ]);
  });
  it("should keep updated sentences after offset, but keep previous IDs", () => {
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
    const lengthOfUpdate = 1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
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
    const lengthOfUpdate = -1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      {
        ...firstSentence,
        length: 19,
        sentence: "Thi is a sentence. ",
      },
    ]);
  });
  it("should handle deleting a sentence", () => {
    const previousSentences = [
      firstSentence,
      {
        id: "some-unique-id-2a",
        length: 1,
        offset: 20,
        sentence: "A",
      },
    ];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
      },
    ];
    const offset = 20;
    const lengthOfUpdate = -1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([firstSentence]);
  });
  it("should handle deleting all the text", () => {
    const previousSentences = [firstSentence, secondSentence];
    const newSentences = INITIAL_STATE;
    const offset = 0;
    const lengthOfUpdate = 0;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual(INITIAL_STATE);
  });
  it("should handle merging two sentences", () => {
    const previousSentences = [firstSentence, secondSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-2a",
        length: 39,
        sentence: "This is a sentence And this is one too.",
      },
    ];
    const offset = 18;
    const lengthOfUpdate = -1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      {
        ...firstSentence,
        length: 39,
        sentence: "This is a sentence And this is one too.",
      },
    ]);
  });
  it.skip("should handle merging two sentences from different paragraphs", () => {});
  it("should handle pasting a small amount of text", () => {
    const previousSentences = [firstSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
        length: 24,
        sentence: "This is a new sentence. ",
      },
    ];
    const offset = 10;
    const lengthOfUpdate = 4;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      {
        ...firstSentence,
        length: 24,
        sentence: "This is a new sentence. ",
      },
    ]);
  });
  it.skip("should handle pasting sentences of text", () => {});
  it.skip("should handle cutting sentences of text", () => {});
  it("should handle cutting a small amount of text", () => {
    const previousSentences = [
      {
        ...firstSentence,
        length: 24,
        sentence: "This is a new sentence. ",
      },
    ];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
      },
    ];
    const offset = 10;
    const lengthOfUpdate = -4;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([firstSentence]);
  });
});
