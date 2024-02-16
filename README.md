# Mood Journal

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1707955351/Screenshot_from_2024-02-14_13-35-29_qi7i4u.png)

## Overview
Mood Journal is a web application designed to help users track their emotional well-being through journaling. It features a Langchain-powered chatbot that interacts with users, providing insights based on their journal entries and previous conversations.

## Features

- **Journal Entries**: Users can create and manage journal entries to track their mood and thoughts. The application integrates TinyMCE as the rich text editor, offering enhanced formatting options for a better journaling experience.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009292/Screenshot_from_2024-02-15_15-01-19_pvfykk.png)


![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1707957964/Screenshot_from_2024-02-15_00-45-32_tdruzl.png)


![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009038/Screenshot_from_2024-02-15_14-56-52_cul0ix.png)



- **AI Chatbot**: An AI-powered chatbot offers personalised interactions, using users' journals and chat history for context-aware responses.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009633/Screenshot_from_2024-02-15_15-06-39_k60ji9.png)


![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708009828/Screenshot_from_2024-02-15_15-09-54_xakevr.png)


![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708010037/Screenshot_from_2024-02-15_15-13-15_l0m0x7.png)




- **Mood Insights**: Analyze mood patterns over time with visual charts and summaries.

![Screenshot1](https://res.cloudinary.com/drbz4rq7y/image/upload/v1708010194/Screenshot_from_2024-02-15_15-16-15_tddiuf.png)


- **Authentication**: Utilises Clerk for user authentication.


## Chatbot Implementation Overview

The Mood Journal app includes an AI chatbot that interacts with users by providing insights based on their journal entries and chat history. This README section outlines the development of the chatbot, focusing on the challenges encountered and the solutions implemented.

**LangChain Integration**: The biggest challenge was integrating LangChain for personalized chat experiences, especially managing user-specific chat history in a serverless environment like Next.js. LangChain's documentation mainly covers local chat memory persistence, which isn't directly applicable to serverless architectures. Due to limited examples of LangChain memory in production, developing a functional chat memory solution required navigating through a significant learning curve.

The initial chatbot version faced issues with memory and token limits, causing crashes. Gaining access to LangSmith was a turning point, providing the tools needed to overcome LangChain's complexities. After testing various configurations, a relatively simple runnable chain using LangChain Expression Language (LCEL) was chosen. This approach balances the need for rich context against the limitations of token limits and API response times.

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





