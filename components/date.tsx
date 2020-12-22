import { format, parseISO } from 'date-fns';

export const Date: React.FC<{ dateString: string }> = ({ dateString }) => {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
};
