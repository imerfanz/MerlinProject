const textShortner = (paragraph, wordLimit) => {
  const words = paragraph.split(" ");
  if (words.length > wordLimit) {
    const truncatedWords = words.slice(0, wordLimit);
    return truncatedWords.join(" ") + " ...";
  }
  return paragraph;
};

export default textShortner;