import { updateSentences } from "./editor";

jest.mock("nanoid", () => () => ({
  nanoid: () => "some-unique-id",
}));

describe("updateSentences function", () => {
  it("should return previous new sentences if no previous sentences", () => {
    const previousSentences = [];
    const newSentences = [
      {
        id: "some-unique-id",
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
});
