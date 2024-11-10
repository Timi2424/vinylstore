export type AuthenticatedRequest = {
    user?: { id: string; email: string };
    cookies?: { token: string };
};
