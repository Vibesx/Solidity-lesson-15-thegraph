import styles from "../styles/Home.module.css";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";

export default function Home() {
	// How do we show the recently listed NFTs?

	// We will index the events off-chain and then read from our DB.
	// Setup a server to listen for those events to be fired amd we will add them to a DB to query

	// TheGraph will do this in a decentralized way, while Moralis in a centralized way

	// docs for useMoralisquery: https://github.com/MoralisWeb3/react-moralis#usemoralisquery
	// example: const { data, error, isLoading } = useMoralisQuery("GameScore");
	// ActiveItem will be the table name and 2nd parameter is a function describing the query

	const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
		"ActiveItem",
		(query) => query.limit(10).descending("tokenId")
	);
	const { isWeb3Enabled } = useMoralis();

	console.log(listedNfts);

	return (
		<div className="container mx-auto">
			<h1 className="py-4 px-4 font-bold text-2xl">RecentlyListed</h1>
			<div className="flex flex-wrap">
				{isWeb3Enabled ? (
					fetchingListedNfts ? (
						<div>Loading...</div>
					) : (
						listedNfts.map((nft) => {
							console.log(nft.attributes);
							const { price, nftAddress, tokenId, marketplaceAddress, seller } =
								nft.attributes;
							return (
								<div>
									{/* NFTBox has 5 params, which we add below as tag properties (I guess that's what they're called? :-?) */}
									{/* the key property is like a unique id for each mapping */}
									<NFTBox
										price={price}
										nftAddress={nftAddress}
										tokenId={tokenId}
										marketplaceAddress={marketplaceAddress}
										seller={seller}
										key={`${nftAddress}${tokenId}`}
									/>
								</div>
							);
						})
					)
				) : (
					<div>Web3 Currently Not Enabled</div>
				)}
			</div>
		</div>
	);
}
