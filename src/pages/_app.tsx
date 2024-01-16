import '@/styles/globals.css';
import Layout from '@/components/Layout';
import React, { Component } from 'react';
import { AppProps } from '../../node_modules/next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
