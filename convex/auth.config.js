const authConfig = {
  providers: [
    {
      domain: "https://clerk.chainlink.st",
      applicationID: "convex",
    },
    {
      domain: process.env.CLERK_ISSUER_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
