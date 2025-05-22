export const authenticatedRoutes = [
  '/dashboard',
  '/notifications',
  '/bookmarks',
  '/search',
  '/settings',
  '/settings/email',
  '/profile',
  // Add other authenticated routes here
];

export const isAuthenticatedRoute = (path: string) => {
  return authenticatedRoutes.some(route => path.startsWith(route));
}; 