export const DisplayDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  const date = new Date(dateString);
  return (
    <time dateTime={dateString}>
      {date.getFullYear() +
        '.' +
        String(1 + date.getMonth()).padStart(2, '0') +
        '.' +
        String(1 + date.getDate()).padStart(2, '0')}
    </time>
  );
};
