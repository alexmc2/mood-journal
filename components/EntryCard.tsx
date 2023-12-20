'use client';
import { Divider } from '@nextui-org/react';

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const getContrastYIQ = (hexcolor: string) => {
  if (!hexcolor) {
    console.error('Hex color is undefined');
    return '#ffffff';
  }

  hexcolor = hexcolor.replace('#', '');
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  const maxLength = 40; // Define the maximum length of the summary text

  const analysisSummary = entry.analysis
    ? truncateText(entry.analysis.summary, maxLength)
    : 'No analysis available';
  const analysisMood = entry.analysis ? entry.analysis.mood : 'N/A';
  const analysisColor =
    entry.analysis && entry.analysis.color !== '#FFFFFF'
      ? entry.analysis.color
      : null;

  const cardStyle = analysisColor
    ? { backgroundColor: analysisColor, borderWidth: '1px' }
    : {};

  const textColor = getContrastYIQ(analysisColor || '#FFFFFF');

  return (
    <div
      className={`cursor-pointer overflow-hidden px-4 py-3 sm:px-6 card shadow-xl ${
        analysisColor ? '' : 'bg-base-100 dark:bg-blue-900'
      }`}
      style={{ ...cardStyle, color: textColor }}
    >
      <div className="py-3">{date}</div>
      <Divider />
      <div className="py-3">{analysisSummary}</div>
      <Divider />
      <div className="py-3 justify-start">
        {`Mood:`} {analysisMood}
      </div>
    </div>
  );
};

export default EntryCard;
