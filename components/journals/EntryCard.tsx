'use client';
import { Divider } from '@nextui-org/react';
import { useState } from 'react';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;

  // Find the last space within the maxLength
  let trimmedText = text.substring(0, maxLength);
  let lastSpaceIndex = trimmedText.lastIndexOf(' ');

  if (lastSpaceIndex === -1 || lastSpaceIndex < maxLength * 0.8)
    lastSpaceIndex = maxLength;

  // Trim the text at the last space index to avoid cutting in the middle of a word
  trimmedText = text.substring(0, lastSpaceIndex);

  return trimmedText + '...';
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

// function to calculate a darker color for hover effect

const darkenColor = (color: any, amount = 20) => {
  let usePound = false;
  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }
  let num = parseInt(color, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00ff) - amount;
  let b = (num & 0x00ff) - amount;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  const result =
    (usePound ? '#' : '') +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2);

  return result;
};

const EntryCard = ({ entry }: { entry: any }) => {
  const date = new Date(entry.createdAt).toDateString();
  const maxLength = 40; // Define the maximum length of the summary text

  const analysisSummary = entry.analysis
    ? truncateText(entry.analysis.summary, maxLength)
    : 'No analysis available';
  const analysisMood = entry.analysis ? entry.analysis.mood : 'N/A';
  const analysisColor =
    entry.analysis && entry.analysis.color !== '#F8F8F8'
      ? entry.analysis.color
      : null;

  const cardStyle = analysisColor ? { backgroundColor: analysisColor } : {};

  const textColor = getContrastYIQ(analysisColor || '#FFFFFF');

  const [isHovered, setIsHovered] = useState(false);
  const hoverStyle =
    isHovered && analysisColor
      ? { backgroundColor: darkenColor(analysisColor) }
      : {};

  return (
    <div
      className={`cursor-pointer overflow-hidden px-4 py-3 sm:px-6 shadow-sm card transition-transform duration-400  `}
      style={{ ...cardStyle, ...hoverStyle, color: textColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
