import { authMiddleware } from '@clerk/nextjs';
export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: ['/', '/api', '/api/chat', '/api/entries', '/api/entries/:id'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
