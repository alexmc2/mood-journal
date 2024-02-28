# Mood Chat

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708660386/Screenshot_from_2024-02-23_03-52-53_vsx82z.png)

## Overview

Mood Chat is a web application designed to help users track their emotional well-being through journaling. It features a Langchain-powered chatbot that interacts with users, providing insights based on their journal entries and previous conversations.

## Features

- **Journal Entries**: Users can create and manage journal entries to track their mood and thoughts. The application integrates TinyMCE as the rich text editor, offering enhanced formatting options for a better journaling experience. Upon save, an AI analysis is invoked, summarising the journal entry and attributing a sentiment score. These are used to chart sentiment scores over time.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708659945/Screenshot_from_2024-02-23_03-44-11_bbcqml.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009292/Screenshot_from_2024-02-15_15-01-19_pvfykk.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708660127/Screenshot_from_2024-02-23_03-47-28_yn9xyw.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708725010/Screenshot_from_2024-02-23_21-49-34_v6feuo.png)

- **AI Chatbot**: An AI-powered chatbot offers personalised interactions, using users' journals and chat history for context-aware responses.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1709038949/Screenshot_from_2024-02-27_13-02-06_ghzh60.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1709040595/Screenshot_from_2024-02-27_13-29-40_emccks.png)

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708010037/Screenshot_from_2024-02-15_15-13-15_l0m0x7.png)

- **Mood Insights**: Analyse mood patterns over time with visual charts and summaries.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708010194/Screenshot_from_2024-02-15_15-16-15_tddiuf.png)

- **Responsive Design**: Fully responsive and mobile-friendly interface designed with Tailwind CSS, ensuring a good user experience across all device sizes.

- **Authentication**: Utilises Clerk for user authentication.

- **Security**: All sensitive content such as chat messages and journal entries is encrypted using the Prisma field-level encryption extension. This encryption process is initiated on the server-side and ensures that all sensitive information is securely encrypted before being stored in the database.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708891452/Screenshot_from_2024-02-25_20-04-03_syet6z.png)

## Implementation Overview

The Mood Chat app includes an AI chatbot that interacts with users by providing insights based on their journal entries and chat history. This README section outlines the development of the application, focusing on the challenges encountered and the solutions implemented.

**LangChain Integration**: The biggest challenge was integrating LangChain for personalised chat experiences, especially managing user-specific chat history in a serverless environment like Next.js. LangChain's documentation mainly covers local chat memory persistence, which isn't directly applicable to serverless architectures. Due to limited examples of LangChain memory in production, developing a functional chat memory solution required navigating through a significant learning curve.

The initial chatbot version faced issues with memory and token limits, causing crashes. Gaining access to LangSmith was a turning point, providing the tools needed to overcome LangChain's complexities. After testing various configurations, a relatively simple runnable chain using LangChain Expression Language (LCEL) was chosen. This approach balances the need for rich context against the limitations of token limits and API response times.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708043195/Screenshot_from_2024-02-16_00-26-16_vgjwfu.png)

**Rich Text Editor Integration**: To enhance the user experience, the decision to integrate a rich text editor was made, moving beyond basic text input to a more interactive and engaging interface. This upgrade, however, introduced several technical challenges. I experimented with various rich text editors, including Lexical Editor, before deciding on TinyMCE for its ease of use, generous free tier, and relative ease of integration.

Saving and retrieving journal entries from the database, along with running AI analysis on these entries, proved significantly more complex with a rich text editor than with the original basic text input. The original app configuration, centered around a straightforward text area, allowed for a more direct and less complicated data handling and storage process. In contrast, the rich text editor required a more nuanced approach to manage the content state effectively, such as optimising the saving process by utilising content hashes to listen for unsaved changes.

Preventing data loss when the user navigated away from the editor page also proved to be a challenge. A manual save button was initially implemented because the original autosave function triggered too many unnecessary API calls for the corresponding AI analysis. However, the issue of potential data loss when users navigated away from the page still needed to be addressed. Two main solutions were explored: a modal pop-up warning users of unsaved changes and an additional autosave feature for the journal content only. Each solution had its own set of challenges, especially in the context of Next.js 14's app router, which lacks the router.events available in the pages router. This complicated the implementation of a navigation interruption mechanism and required integrating a custom unsavedChangesContext and link component to invoke the modal pop-up.

The modal pop-up solution, while initially promising, was found to be overly aggressive in interrupting user navigation, often at the cost of user experience. It was challenging to finely tune this approach to differentiate between significant unsaved changes and minor, inconsequential alterations.

The autosave feature, while ultimately selected as the preferred solution, also presented its own challenges, particularly in terms of integration with TinyMCE as a controlled component. This required leveraging the useRef and useState hooks for real-time content tracking and state management, ensuring that changes within the TinyMCE editor are accurately captured and reflected in the application's state.

**Database** The app uses Supabase with the Pgvector extension for data storage. It stores vector representations of chat messages and journal entries using OpenAI embeddings. This setup ensures the chatbot can access relevant historical data for meaningful interactions. Recent chat history is retrieved as text from the database and used to maintain continuity in ongoing chats.

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
