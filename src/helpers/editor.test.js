import { updateSentences } from "./editor";

jest.mock("nanoid", () => () => ({
  nanoid: () => {},
}));

const INITIAL_STATE = [];

const partialSentence = {
  id: "some-unique-id-1a",
  isDirty: false,
  length: 1,
  offset: 0,
  sentence: "T",
};

const firstSentence = {
  id: "some-unique-id-1a",
  isDirty: false,
  length: 20,
  offset: 0,
  sentence: "This is a sentence. ",
};

const secondSentence = {
  id: "some-unique-id-2a",
  isDirty: false,
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
    ).toEqual([
      {
        ...partialSentence,
        isDirty: true,
      },
    ]);
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
        isDirty: true,
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
    ).toEqual([
      firstSentence,
      {
        ...secondSentence,
        isDirty: true,
      },
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
    const lengthOfUpdate = 1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      firstSentence,
      {
        ...secondSentence,
        isDirty: true,
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
        isDirty: true,
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
        isDirty: true,
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
        isDirty: false,
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
        isDirty: true,
        length: 39,
        sentence: "This is a sentence And this is one too.",
      },
    ]);
  });
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
        isDirty: true,
        length: 24,
        sentence: "This is a new sentence. ",
      },
    ]);
  });
  it("should handle pasting sentences of text", () => {
    const previousSentences = [firstSentence, secondSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
      },
      {
        id: "some-unique-id-2b",
        isDirty: false,
        length: 34,
        offset: 20,
        sentence: "This sentence was just pasted in. ",
      },
      {
        id: "some-unique-id-3b",
        isDirty: false,
        length: 20,
        offset: 54,
        sentence: " And so was this one.",
      },
      {
        ...secondSentence,
        id: "some-unique-id-4b",
        offset: 74,
      },
    ];
    const offset = 74;
    const lengthOfUpdate = 54;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      firstSentence,
      {
        id: "some-unique-id-2b",
        isDirty: true,
        length: 34,
        offset: 20,
        sentence: "This sentence was just pasted in. ",
      },
      {
        id: "some-unique-id-3b",
        isDirty: true,
        length: 20,
        offset: 54,
        sentence: " And so was this one.",
      },
      {
        ...secondSentence,
        offset: 74,
      },
    ]);
  });
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
    ).toEqual([
      {
        ...firstSentence,
        isDirty: true,
      },
    ]);
  });
  it("should handle cutting sentences of text", () => {
    const previousSentences = [
      firstSentence,
      {
        id: "some-unique-id-2a",
        isDirty: false,
        length: 34,
        offset: 20,
        sentence: "This sentence was just pasted in. ",
      },
      {
        id: "some-unique-id-3a",
        isDirty: false,
        length: 20,
        offset: 54,
        sentence: " And so was this one.",
      },
      {
        ...secondSentence,
        id: "some-unique-id-4a",
        offset: 74,
      },
    ];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
      },
      {
        ...secondSentence,
        id: "some-unique-id-2b",
      },
    ];
    const offset = 20;
    const lengthOfUpdate = -54;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      firstSentence,
      {
        ...secondSentence,
        id: "some-unique-id-4a",
      },
    ]);
  });
  it("should handle splitting an existing sentence into two", () => {
    const previousSentences = [firstSentence];
    const newSentences = [
      {
        ...firstSentence,
        id: "some-unique-id-1b",
        length: 9,
        sentence: "This is. ",
      },
      {
        id: "some-unique-id-2b",
        isDirty: false,
        length: 12,
        offset: 9,
        sentence: "a sentence. ",
      },
    ];
    const offset = 9;
    const lengthOfUpdate = 1;
    expect(
      updateSentences(previousSentences, newSentences, offset, lengthOfUpdate)
    ).toEqual([
      {
        ...firstSentence,
        isDirty: true,
        length: 9,
        sentence: "This is. ",
      },
      {
        id: "some-unique-id-2b",
        isDirty: true,
        length: 12,
        offset: 9,
        sentence: "a sentence. ",
      },
    ]);
  });
});
