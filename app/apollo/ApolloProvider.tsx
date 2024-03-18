'use client';

import React, { FC, PropsWithChildren } from 'react';
import Cookies from 'js-cookie';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr';
import { setContext } from '@apollo/client/link/context';

const makeClient = () => {
  const authLink = setContext(async (_, { headers }) => {
    const token = await Cookies.get('token');

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    fetchOptions: { cache: 'no-store' }
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({ stripDefer: true }),
            authLink.concat(httpLink)
          ])
        : authLink.concat(httpLink)
  });
};
export const QUERY = makeClient().query

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
    <div>
      {children}
    </div>
    </ApolloNextAppProvider>
  );
};

export default Providers;
