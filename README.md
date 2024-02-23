# Mood Journal

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708449926/Screenshot_from_2024-02-20_17-25-12_zovwjv.png)

## Overview

Mood Journal is a web application designed to help users track their emotional well-being through journaling. It features a Langchain-powered chatbot that interacts with users, providing insights based on their journal entries and previous conversations.

## Features

- **Journal Entries**: Users can create and manage journal entries to track their mood and thoughts. The application integrates TinyMCE as the rich text editor, offering enhanced formatting options for a better journaling experience. Upon save, an AI analysis is invoked, summarising the journal entry and attributing a sentiment score. These can be used to chart sentiment scores over time.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708492303/Screenshot_from_2024-02-21_05-10-29_j34zwt.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009292/Screenshot_from_2024-02-15_15-01-19_pvfykk.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1707957964/Screenshot_from_2024-02-15_00-45-32_tdruzl.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009038/Screenshot_from_2024-02-15_14-56-52_cul0ix.png)

- **AI Chatbot**: An AI-powered chatbot offers personalised interactions, using users' journals and chat history for context-aware responses.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708492528/Screenshot_from_2024-02-21_05-15-18_otmliv.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009633/Screenshot_from_2024-02-15_15-06-39_k60ji9.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009828/Screenshot_from_2024-02-15_15-09-54_xakevr.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708010037/Screenshot_from_2024-02-15_15-13-15_l0m0x7.png)

- **Mood Insights**: Analyse mood patterns over time with visual charts and summaries.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708010194/Screenshot_from_2024-02-15_15-16-15_tddiuf.png)

- **Responsive Design**: Fully responsive and mobile-friendly interface designed with Tailwind CSS, ensuring a good user experience across all device sizes.

- **Authentication**: Utilises Clerk for user authentication.

## Implementation Overview

The Mood Journal app includes an AI chatbot that interacts with users by providing insights based on their journal entries and chat history. This README section outlines the development of the application, focusing on the challenges encountered and the solutions implemented.

**LangChain Integration**: The biggest challenge was integrating LangChain for personalised chat experiences, especially managing user-specific chat history in a serverless environment like Next.js. LangChain's documentation mainly covers local chat memory persistence, which isn't directly applicable to serverless architectures. Due to limited examples of LangChain memory in production, developing a functional chat memory solution required navigating through a significant learning curve.

The initial chatbot version faced issues with memory and token limits, causing crashes. Gaining access to LangSmith was a turning point, providing the tools needed to overcome LangChain's complexities. After testing various configurations, a relatively simple runnable chain using LangChain Expression Language (LCEL) was chosen. This approach balances the need for rich context against the limitations of token limits and API response times.

**Rich Text Editor Integration**: The decision to integrate a rich text editor was made to enhance the user experience, moving beyond basic text input to a more interactive and engaging interface. This upgrade, however, introduced several technical challenges that required innovative solutions. I experimented with various options, including Lexical editor, before deciding on TinyMCE for its ease of use, generous free tier, and relative ease of integration. 

Saving and retrieving journal entries from the database, along with running AI analysis on these entries, proved significantly more complex with a rich text editor than with the original basic text input. The original app configuration, centered around a straightforward text area, allowed for a more direct and less complicated data handling and storage process. In contrast, the rich text editor required a more nuanced approach to manage the content's rich formatting and the subsequent AI analysis effectively.

Preventing data loss when the user navigated away from the editor page also proved to be a challenge. A manual save button was initially implemented because the original autosave function triggered too many unnecessary API calls for the corresponding AI analysis. However, the issue of potential data loss when users navigated away from the page still needed to be addressed. Two main solutions were explored: a modal pop-up warning users of unsaved changes or an additional autosave feature for the journal content only. Each solution had its own set of challenges, especially in the context of Next.js 14's app router, which lacks the router.events available in the pages router. This complicated the implementation of a navigation interruption mechanisms and required integrating a custom unsaved changes context and link component to invoke the modal pop-up. 

The modal pop-up solution, while initially promising, was found to be overly aggressive in interrupting user navigation, often at the cost of user experience. It was challenging to finely tune this approach to differentiate between significant unsaved changes and minor, inconsequential alterations.

The autosave feature, ultimately selected as the preferred solution, also presented its own challenges, particularly in terms of integration with TinyMCE. Integrating TinyMCE as a controlled component required careful management of its internal state and the app's state to ensure that the autosave feature functioned effectively, minimising unnecessary disruptions to the user experience while safeguarding against data loss. 

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708043195/Screenshot_from_2024-02-16_00-26-16_vgjwfu.png)

**Database** The app uses Supabase with the Pgvector extension for data storage. It stores vector representations of chat messages and journal entries using OpenAI embeddings. This setup ensures the chatbot can access relevant historical data for meaningful interactions. Recent chat history is retrieved as text from the database and used by LangChain's buffer memory to maintain continuity in ongoing chats.

## Tech Stack

- **Frontend**:

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **Backend**:

![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/-Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)

- **AI & Chatbot**:

![LangChain](https://img.shields.io/badge/-LangChain-FFA500?style=for-the-badge&logo=langchain&logoColor=white)
![OpenAI](https://img.shields.io/badge/-OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
