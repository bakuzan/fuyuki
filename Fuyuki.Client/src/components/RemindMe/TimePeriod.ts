import typedKeys from 'src/utils/typedKeys';

export enum TimePeriod {
  Minute = 1,
  Hour,
  Day,
  Week,
  Month,
  Year
}

export const periods = Object.entries(TimePeriod)
  .filter(([key]) => isNaN(Number(key)))
  .map(([text, value]) => ({
    text,
    value
  }));
