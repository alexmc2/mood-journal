// Chatbot version that uses an agent to process the question and return an answer.

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';

import { RunnableSequence } from '@langchain/core/runnables';
import { BaseMessage } from '@langchain/core/messages';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

import { createClient } from '@supabase/supabase-js';
import { SupabaseHybridSearch } from '@langchain/community/retrievers/supabase';

import { Client } from 'langsmith';
import { LangChainTracer } from 'langchain/callbacks';
import {
  ConversationSummaryBufferMemory,
  VectorStoreRetrieverMemory,
} from 'langchain/memory';

import {
  PromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import { AgentExecutor, type AgentStep } from 'langchain/agents';

import { formatToOpenAIFunctionMessages } from 'langchain/agents/format_scratchpad';
import { OpenAIFunctionsAgentOutputParser } from 'langchain/agents/openai/output_parser';


import { DynamicTool, Tool } from '@langchain/core/tools';
import { convertToOpenAIFunction } from '@langchain/core/utils/function_calling';
import { VectorStoreRetrieverInput } from '@langchain/core/vectorstores';

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const client = createClient(url, privateKey);

const langsmithClient = new Client();
const tracer = new LangChainTracer({
  projectName: 'Mood',
  client: langsmithClient,
});

export const qa = async (chatId: any, newMessage: { newMessage: number | Partial<VectorStoreRetrieverInput<SupabaseVectorStore>> | undefined; }, userId: any) => {
  try {
    //context
    const metadataFilter = {
      userId: userId,
      type: 'journal',
    };

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      embeddings,
      {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
      }
    );

    const retriever = vectorStore.asRetriever(
      newMessage.newMessage,
      metadataFilter
    );

    //chat history

    const fetchChatHistory = async (userId: any, chatId: any) => {
      let { data: chatHistory, error } = await client
        .from('documents')
        .select('*')
        .eq('userId', userId)
        .eq('chatId', chatId)
        .limit(20);

      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }

      chatHistory?.sort((a, b) => {
        const aCreatedAt = new Date(a.metadata.createdAt).getTime();
        const bCreatedAt = new Date(b.metadata.createdAt).getTime();
        return aCreatedAt - bCreatedAt;
      });

      return chatHistory || [];
    };

    // Function to serialize chat history into a readable string format.
    const serializeChatHistory = (chatHistory: any[]) =>
      chatHistory
        .map((doc) => {
          const { content, metadata } = doc;
          // Assuming metadata contains a type to distinguish between human and AI messages
          const typePrefix = metadata.type === 'message' ? 'Human: ' : 'AI: ';
          const createdAt = new Date(metadata.createdAt);
          return `${typePrefix}${content} Message date: ${createdAt}`;
        })
        .join('\n');

    const chatHistory = await fetchChatHistory(userId, chatId);
    const chatHistoryString = serializeChatHistory(chatHistory);

    //Make a retriever tool
    const retrieverTool = new DynamicTool({
      name: 'Retriever',
      description:
        'For additional context and information, in the form of historical chat messages and journals. This tool can be used to provide more accurate and relevant responses to the user needs.',

      func: async (input: string, runManager) => {
        const retriever = vectorStore.asRetriever(
          newMessage.newMessage,
          metadataFilter
        );
        const docs = await retriever.invoke(input, runManager?.getChild());
        return docs
          .map(
            (doc) =>
              `Retrieved docs (${doc.metadata.createdAt}): ${doc.pageContent}`
          )
          .join('\n');
      },
    });

    console.log('Retriever tool:', retrieverTool);

    const tools = [retrieverTool];

    //     const chatPrompt = ChatPromptTemplate.fromTemplate(
    //       `Assistant is designed to offer support and understanding, providing a safe space for sharing feelings and thoughts. Adopt the position of a wise and empathic friend but avoid role-playing or creating fictional scenarios. Using the information provided in the previous conversations and relevant documents, respond to the user in a friendly, kind and familiar way. Offer relevant, and practical insights or guidance. Be friendly, ask questions and be interested in the user. Compliment the user when it is appropriate.

    // Assistant leverages its capabilities to engage in meaningful conversations, drawing upon a wide range of knowledge to offer insights and suggestions. It's constantly learning from interactions to improve its ability to assist effectively.

    // In this conversation, Assistant will:
    // - Listen attentively to what's shared.
    // - Offer empathy and understanding.
    // - Provide supportive feedback and suggestions based on the conversation.
    // - Encourage reflection and self-awareness.

    // TOOL USAGE:
    // -----------
    // Assistant has access to the following tools that can provide additonal context and information, in the form of historical chat messages and journals. These tools can be used to provide more accurate and relevant responses to the user's needs. You should access these tools frequently to provide the best possible support to the user.

    // {tools}
    // Thought: Do I need to use a tool? Yes/No
    // Action: Respond to the user based on the additional context provided by the tool.
    // Action Input: [Input for the action]
    // Observation: [Result of the action]

    // When directly responding to the human without tool usage, use:
    // Thought: Do I need to use a tool? No
    // Final Answer: [Your empathetic and supportive response]

    // CONVERSATION FLOW:
    // ------------------
    // Adopt the position of a wise and empathic friend but avoid role-playing or creating fictional scenarios. The conversation should flow naturally, with Assistant considering the emotional context and the user's needs.

    // Previous conversation history:
    // {chatHistory}

    // New input: {newMessage}
    // {agent_scratchpad}`
    //     );

    const chatPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are very powerful assistant, and a friend to the user. You have access to {tools} and {chatHistory}.',
      ],
      ['human', '{newMessage}'],

      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    // Since we're adjusting to use only GPT-3.5-turbo, we'll use it for both operations
    const chatModel = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 0.6,
      verbose: true,
    });

    const modelWithFunctions = chatModel.bind({
      functions: tools.map((tool) => convertToOpenAIFunction(tool)),
    });

    // const agentWithChat = await createReactAgent({
    //   llm: chatModel,
    //   tools,
    //   prompt: chatPrompt,
    // });
    // const agentExecutorWithChat = new AgentExecutor({
    //   agent: agentWithChat,
    //   tools,
    //   callbacks: [tracer],
    // });

    const runnableAgent = RunnableSequence.from([
      {
        newMessage: (i: { newMessage: string; steps: AgentStep[] }) =>
          i.newMessage,
        agent_scratchpad: (i: { newMessage: string; steps: AgentStep[] }) =>
          formatToOpenAIFunctionMessages(i.steps),

        chatHistory: (i: { newMessage: string; steps: AgentStep[] }) =>
          chatHistoryString,

        tools: (i: { newMessage: string; steps: AgentStep[] }) => tools,
      },
      chatPrompt,
      modelWithFunctions,
      new OpenAIFunctionsAgentOutputParser(),
    ]);

    // const executor = AgentExecutor.fromAgentAndTools({
    //   agent: runnableAgent,
    //   tools,
    // });

    const agentExecutorWithChat = new AgentExecutor({
      agent: runnableAgent,
      tools,
      callbacks: [tracer],
    });

    const response = await agentExecutorWithChat.invoke({
      newMessage: newMessage,

      chatHistory: chatHistoryString,
      verbose: true,
      handleParsingErrors: async (error: any, context: any) => {
        console.log('Caught parsing error:', error);
        // Modify the context.input here based on the error
        // For example, if the error is due to an invalid date format, you can correct it
        // context.input = correctDateFormat(context.input);
        // Then rerun the executor with the corrected input
        const result = await response.invoke(context);
        return result;
      },
    });

    return response.output;
  } catch (error) {
    console.error('Error in qa function:', error);

    throw error;
  }
};
