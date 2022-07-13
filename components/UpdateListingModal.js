import { Modal, Input, useNotification } from "web3uikit";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
	nftAddress,
	tokenId,
	isVisible,
	marketplaceAddress,
	onClose,
}) {
	const dispatch = useNotification();

	const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);

	// we can pass a transaction as a parameter so we can use it to wait before sending a success message
	const handleUpdateListingSuccess = async (tx) => {
		await tx.wait(1);
		dispatch({
			type: "success",
			message: "listing updated",
			title: "Listing updated - please refresh and move blocks",
			position: "topR",
		});
		onCloseModal();
	};

	const { runContractFunction: updateListing } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: "updateListing",
		params: {
			nftAddress: nftAddress,
			tokenId: tokenId,
			newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
		},
	});

	const onCloseModal = () => {
		onClose && onClose();
		setPriceToUpdateListingWith("0");
	};

	return (
		<Modal
			isVisible={isVisible}
			onCancel={onCloseModal}
			onCloseButtonPressed={onCloseModal}
			onOk={() => {
				updateListing({
					onError: (error) => {
						console.log(error);
					},
					onSuccess: handleUpdateListingSuccess,
				});
			}}
		>
			<Input
				label="Update listing price in L1 Currency (ETH)"
				name="New listing price"
				type="number"
				value={priceToUpdateListingWith}
				onChange={(event) => {
					setPriceToUpdateListingWith(event.target.value);
				}}
			/>
		</Modal>
	);
}
