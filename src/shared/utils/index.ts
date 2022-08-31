export interface Option {
  label: string;
  value: string;
}

export const isNullOrEmpty = (text?: string | null): boolean =>
  typeof text === 'undefined' || text === null || text.trim().length === 0;

export const randomId = (prefix?: string): string =>
  `${prefix ?? ''}${Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5)}`;

export const removeDuplicates = <T>(array: T[]): T[] =>
  array.filter((item, index, self) => self.indexOf(item) === index);

export const getOptionsFromEnum = <T>(enumType: T): Option[] => {
  return Object.entries(enumType)
    .filter((entry) => !Number.isInteger(parseInt(entry[0])))
    .map((entry) => {
      return {
        label: entry[0].toString(),
        value: (entry[1] as string).toString(),
      };
    });
};
