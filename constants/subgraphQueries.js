import { gql } from "@apollo/client";

// we can build this with the help of TheGraph playground in our subgraph; this way we can also test it there
const GET_ACTIVE_ITEMS = gql`
	{
		activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
			id
			buyer
			seller
			nftAddress
			tokenId
			price
		}
	}
`;

export default GET_ACTIVE_ITEMS;
