const STOPWORDS_LIST = [
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '也',
  '很', '都', '可以', '要', '会', '对', '于', '而', '把', '被',
  '这', '那', '你', '他', '她', '它', '们', '这个', '那个',
  '什么', '怎么', '为什么', '如何', '哪个',
];

export const STOPWORDS = new Set(STOPWORDS_LIST);

export function isStopword(word: string): boolean {
  return STOPWORDS.has(word);
}