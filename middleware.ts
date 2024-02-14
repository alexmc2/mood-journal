import {
  authMiddleware,
  redirectToSignIn,
  redirectToSignUp,
} from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/sign-in/[[...sign-in]]',
    '/sign-up/[[...sign-up]]',
    '/new-user',
    '/',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

// export default authMiddleware({
//   afterAuth(auth, req, evt) {
//     // handle users who aren't authenticated
//     if (!auth.userId && !auth.isPublicRoute) {
//       if (req.url === '/new-user') {
//         return redirectToSignUp({ returnBackUrl: '/new-user' });
//       } else if (req.url === '/journal') {
//         return redirectToSignIn({ returnBackUrl: '/journal' });
//       }
//     }
//   },
//   publicRoutes: ['/sign-in/[[...sign-in]]', '/sign-up/[[...sign-up]]', '/new-user', '/'],
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };
