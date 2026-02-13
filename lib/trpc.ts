// Dummy tRPC implementation for now
export const trpc = {
  user: {
    syncData: {
      useMutation: () => ({
        mutateAsync: async () => {
          console.log("Cloud sync not configured yet");
          return null;
        }
      })
    }
  }
};