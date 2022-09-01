import { updateSentences } from "./editor";

jest.mock("nanoid", () => () => ({
  nanoid: () => {},
}));

describe("updateSentences function", () => {
  it("should return new sentences if no previous sentences", () => {
    const previousSentences = [];
    const newSentences = [
      {
        id: "some-unique-id-0",
        length: 1,
        offset: 0,
        sentence: "T",
      },
    ];
    const offset = 1;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual(
      newSentences
    );
  });
  it("should keep previous ID when updating existing sentence", () => {
    const previousSentences = [
      {
        id: "some-unique-id-0",
        length: 1,
        offset: 0,
        sentence: "T",
      },
    ];
    const newSentences = [
      {
        id: "some-unique-id-1",
        length: 2,
        offset: 0,
        sentence: "Th",
      },
    ];
    const offset = 2;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        id: "some-unique-id-0",
        length: 2,
        offset: 0,
        sentence: "Th",
      },
    ]);
  });
  it("should handle adding a new sentence", () => {
    const previousSentences = [
      {
        id: "some-unique-id-0",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
    ];
    const newSentences = [
      {
        id: "some-unique-id-1",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
      {
        id: "some-unique-id-2",
        length: 20,
        offset: 20,
        sentence: "And this is one too.",
      },
    ];
    const offset = 40;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        id: "some-unique-id-0",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
      {
        id: "some-unique-id-2",
        length: 20,
        offset: 20,
        sentence: "And this is one too.",
      },
    ]);
  });
  it("should keep sentences before offset intact", () => {
    const previousSentences = [
      {
        id: "some-unique-id-0",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
      {
        id: "some-unique-id-1",
        length: 20,
        offset: 20,
        sentence: "And this is one too.",
      },
    ];
    const newSentences = [
      {
        id: "some-unique-id-2",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
      {
        id: "some-unique-id-3",
        length: 21,
        offset: 20,
        sentence: "Andd this is one too.",
      },
    ];
    const offset = 24;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        id: "some-unique-id-0",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
      {
        id: "some-unique-id-1",
        length: 21,
        offset: 20,
        sentence: "Andd this is one too.",
      },
    ]);
  });
  it("should keep update sentences after offset, but keep previous IDs", () => {
    const previousSentences = [
      {
        id: "some-unique-id-0",
        length: 20,
        offset: 0,
        sentence: "This is a sentence. ",
      },
      {
        id: "some-unique-id-1",
        length: 20,
        offset: 20,
        sentence: "And this is one too.",
      },
    ];
    const newSentences = [
      {
        id: "some-unique-id-2",
        length: 21,
        offset: 0,
        sentence: "This is an sentence. ",
      },
      {
        id: "some-unique-id-3",
        length: 20,
        offset: 21,
        sentence: "And this is one too.",
      },
    ];
    const offset = 10;
    expect(updateSentences(previousSentences, newSentences, offset)).toEqual([
      {
        id: "some-unique-id-0",
        length: 21,
        offset: 0,
        sentence: "This is an sentence. ",
      },
      {
        id: "some-unique-id-1",
        length: 20,
        offset: 21,
        sentence: "And this is one too.",
      },
    ]);
  });
  it.skip("should handle multiple paragraphs", () => {});
  it.skip("should handle deleting a single character", () => {});
  it.skip("should handle deleting a sentence", () => {});
  it.skip("should handle pasting text", () => {});
  it.skip("should handle cutting text", () => {});
});
