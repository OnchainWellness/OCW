
const authConfig = {
  callbacks: {
    // @ts-expect-error bypass
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    // @ts-expect-error bypass
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      return session;
    },
  },
};

export default authConfig;