// lib/database.js

// import { client } from './chatbot/supabaseClient';

// export const saveToken = async (userId, token) => {
//   const { data, error } = await client.from('magic_tokens').insert([
//     {
//       user_id: userId,
//       token: token,
//       expires_at: new Date(Date.now() + 3600000),
//     }, // expires in 1 hour
//   ]);

//   if (error) throw new Error(error.message);
//   return data;
// };

// export const getUserByEmail = async (email) => {
//   const { data, error } = await client
//     .from('User')
//     .select('*')
//     .eq('email', email)
//     .single();

//   console.log(data);
//   if (error) throw new Error(error.message);
//   return data;
// };

// export const getTokenData = async (token) => {
//   const { data, error } = await client
//     .from('magic_tokens')
//     .select('*')
//     .eq('token', token)
//     .single();

//   if (error) throw new Error(error.message);
//   if (new Date(data.expires_at) < new Date()) {
//     throw new Error('Token expired');
//   }
//   return data;
// };

// export const deleteUserToken = async (token) => {
//   const { data, error } = await client
//     .from('magic_tokens')
//     .delete()
//     .match({ token: token });

//   if (error) throw new Error(error.message);
//   return data;
// };


import { prisma } from './db'




export const saveToken = async (userId, token) => {
  try {
    const newToken = await prisma.magicToken.create({
      data: {
        user_id: userId,
        token: token,
        expires_at: new Date(Date.now() + 3600000), // Token expires in 1 hour
      },
    });
    return newToken;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getTokenData = async (token) => {
  try {
    const tokenData = await prisma.magicToken.findUnique({
      where: {
        token: token,
      },
    });
    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Token expired');
    }
    return tokenData;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteUserToken = async (token) => {
  try {
    const deletedToken = await prisma.magicToken.delete({
      where: {
        token: token,
      },
    });
    return deletedToken;
  } catch (error) {
    throw new Error(error.message);
  }
};
