import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	// uri is taken from TheGraph subgraph -> Details -> Development Query URL
	// this is centralized because of the same reason as ipfs: not enough protocols adopted TheGraph
	uri: "https://api.studio.thegraph.com/query/30983/nft-marketplace/v0.0.2",
});

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<Head>
				<title>NFT Marketplace</title>
				<meta name="description" content="NFT Marketplace" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<MoralisProvider initializeOnMount={false}>
				<ApolloProvider client={client}>
					<NotificationProvider>
						<Header />
						<Component {...pageProps} />
					</NotificationProvider>
				</ApolloProvider>
			</MoralisProvider>
		</div>
	);
}

export default MyApp;
