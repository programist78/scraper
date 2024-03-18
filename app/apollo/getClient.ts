import { HttpLink } from '@apollo/client';
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient
} from '@apollo/experimental-nextjs-app-support/ssr';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { setContext } from '@apollo/client/link/context';
import { cookies } from 'next/headers';

const authLink = setContext((_, { headers }) => {
  const token = cookies().get('token')?.value;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const link = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`
});

const Link = authLink.concat(link);

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: Link
  });
});
