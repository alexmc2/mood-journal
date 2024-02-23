import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';

import { z } from 'zod';
import { prisma } from './db';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z.string().describe('quick summary of the entire entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. For example, Contentment (#DBCCA6), Playfulness (#B586DE), Affection (#C88AB3), Refreshed (#84FCD3), Calm (#92ABEE), Relaxed (#BADBB7), Inspired (#AB80E8), Peaceful (#D9ECF5), Joyful (#E88CE7), Optimistic (#D5E080), Serene (#F0E3FC), Warmth (#E1AD80), Comfort (#E5C198), Harmony (#A9B9A7), Invigorated (#81FFC8), Soothed (#DED2C9), Tranquil (#B5C9DA), Loved (#FACBCA), Delighted (#FACEDA), Hopeful (#9ED4A3), Despair (#2B2B2B), Melancholy (#5F5F5F), Sorrow (#5A5A5A), Grief (#1F1F1F), Loneliness (#222222), Isolation (#1A1A1A), Anxiety (#535353), Tension (#3D3D3D), Stress (#555555), Overwhelm (#383838), Regret (#724F5D), Envy (#364839), Guilt (#021D18), Shame (#756B6C), Anger (#6D0213), Resentment (#623436), Confusion (#442C75), Fear (#2A096E), Dread (#074344), Panic (#28172E), Nostalgia (#272954), Sadness (#271A72), Loss (#0E0159), Emptiness (#291864), Bitterness (#51062E), Disappointment (#273C6C), Jealousy (#0E532C), Pessimism (#355328), Fatigue (#4C716B), Worry (#3E4F08). Do not change this unless the entry changes significantly.'
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive. After giving the entry a sentiment score do not change this unless the sentiment of the entry changes significantly.'
      ),
  })
);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyse the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! DO NOT analyze if the journal entry contains the default content: "Write about your day..." \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyse = async (content: string) => {
  if (
    !content ||
    content.trim() === '' ||
    content === 'Write about your day...'
  ) {
    // Return a default analysis or skip the analysis
    return {
      mood: 'Neutral',
      subject: 'None',
      negative: false,
      summary: 'None',
      sentimentScore: 0,
      color: '#0101fe',
    };
  }
  const input = await getPrompt(content);
  const model = new OpenAI({
    temperature: 0.6,
    modelName: 'gpt-3.5-turbo-0125',
  });
  const output = await model.invoke(input);

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo-0125' }),
      parser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

//chat summary code for sidebar
const chatParser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.string().describe('a quick summary of the chat.'),
  })
);

const getChatSummaryPrompt = async (chatContent: string) => {
  const format_instructions = chatParser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Summarize the following chat conversation. Follow the instructions and format your response to match the format instructions. \n{format_instructions}\n{chat}',
    inputVariables: ['chat'],
    partialVariables: { format_instructions },
  });

  return await prompt.format({ chat: chatContent });
};

export const chatSummary = async (chatContent: string) => {
  if (!chatContent || chatContent.trim() === '') {
    return {
      summary: 'No chat content available.',
    };
  }

  const input = await getChatSummaryPrompt(chatContent);
  const model = new OpenAI({
    temperature: 0.4,
    modelName: 'gpt-3.5-turbo-0125',
  });
  const output = await model.invoke(input);

  try {
    return chatParser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0.4, modelName: 'gpt-3.5-turbo-0125' }),
      chatParser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};


//        'a hexidecimal color code that represents the mood of the entry. For example, use #008000 for envy. Use a wide variety of bright, interesting and vibrant colors for positive moods such as #DBCCA6, #B586DE, #C88AB3, #84FCD3, #92ABEE, #BADBB7, #AB80E8, #D9ECF5, #E88CE7, #D5E080, #F0E3FC, #E1AD80, #E5C198, #A9B9A7, #81FFC8, #DED2C9, #B5C9DA, #FACBCA, #FACEDA or #9ED4A3. Use somber colors for negative sentiments such as #2B2B2B, #5F5F5F, #5A5A5A, #1F1F1F, #222222, #1A1A1A, #535353, #3D3D3D, #555555, #383838, #724F5D, #364839, #021D18, #756B6C, #6D0213, #623436, #442C75, #2A096E, #074344, #28172E, #272954, #271A72, #0E0159, #291864, #51062E, #273C6C, #0E532C, #355328, #4C716B or #3E4F08. Do not just pick the first color - consider them all or choose your own interesting color. Do not change this unless the entry changes significantly.'
