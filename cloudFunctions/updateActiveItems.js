// Create a new table called "ActiveItem"
// Add items when they are listed on the marketplace
// Remove them when they are bought or canceled

Moralis.Cloud.afterSave("ItemListed", async (request) => {
	// Every event gets triggered twice, once on unconfirmed, again on confirmed (think unconfirmed before .wait(1), confirmed after)
	const confirmed = request.object.get("confirmed");
	// logger allows us to log things to Moralis DB
	const logger = Moralis.Cloud.getLogger();
	logger.info("Looking for confirmed Tx");
	// we only trigger this logic if confirmed is true (block has been mined; on local environment this is done with the moveBlocks functionality)
	if (confirmed) {
		logger.info("Found item!");
		// following code means: if ActiveItem exists, grab it; if not, create it
		const ActiveItem = Moralis.Object.extend("ActiveItem");

		// check if item already listed in DB; this can occur if we do an updateListing from our contract
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("nftAddress", request.object.get("nftAddress"));
		query.equalTo("tokenId", request.object.get("tokenId"));
		query.equalTo("marketplaceAddress", request.object.get("address"));
		query.equalTo("seller", request.object.get("seller"));
		const alreadyListedItem = await query.first();
		if (alreadyListedItem) {
			logger.info(`Deleting already listed ${request.object.get("objectId")}`);
			await alreadyListedItem.destroy();
			logger.info(
				`Deleted item with tokenId ${request.object.get(
					"tokenId"
				)} at address ${request.object.get("address")} since it's already been listed`
			);
		}

		// we instantiate an ActiveItem object
		const activeItem = new ActiveItem();
		// we add the "address" object from request to the marketplaceAddress column of ActiveItem table
		// all the requests coming from events contain the address they are coming from
		activeItem.set("marketplaceAddress", request.object.get("address"));
		// requests also contain all of the params of the event
		activeItem.set("nftAddress", request.object.get("nftAddress"));
		activeItem.set("price", request.object.get("price"));
		activeItem.set("tokenId", request.object.get("tokenId"));
		activeItem.set("seller", request.object.get("seller"));
		// so basically we get the address from the event emitter and the following 4 properties from the params of the event
		logger.info(
			`Adding Address: ${request.object.get("address")}. TokenId: ${request.object.get(
				"tokenId"
			)}`
		);
		logger.info("Saving...");
		await activeItem.save();
	}
});

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
	const confirmed = request.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	logger.info(`Marketplace | Object: ${request.object}`);
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		// docs on queries: https://docs.moralis.io/moralis-dapp/database/queries#basic-queries
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketplaceAddress", request.object.get("address"));
		query.equalTo("nftAddress", request.object.get("nftAddress"));
		query.equalTo("tokenId", request.object.get("tokenId"));
		logger.info(`Marketplace | Query: ${query}`);
		const canceledItem = await query.first();
		logger.info(`Marketplace | CanceledItem: ${canceledItem}`);
		// if it find something, apply logic; if it doesn't, canceledItem will be undefined
		if (canceledItem) {
			logger.info(
				`Deleting ${request.object.get("tokenId")} at address ${request.object.get(
					"address"
				)} since it was canceled`
			);
			await canceledItem.destroy();
		} else {
			logger.info(
				`No item found with address ${request.object.get(
					"address"
				)} and tokenId ${request.object.get("tokenId")}`
			);
		}
	}
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
	const confirmed = request.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	logger.info(`Marketplace | Object: ${request.object}`);
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		// docs on queries: https://docs.moralis.io/moralis-dapp/database/queries#basic-queries
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketplaceAddress", request.object.get("address"));
		query.equalTo("nftAddress", request.object.get("nftAddress"));
		query.equalTo("tokenId", request.object.get("tokenId"));
		logger.info(`Marketplace | Query: ${query}`);
		const boughtItem = await query.first();
		logger.info(`Marketplace | boughtItem: ${JSON.stringify(boughtItem)}`);
		// if it find something, apply logic; if it doesn't, canceledItem will be undefined
		if (boughtItem) {
			logger.info(
				`Deleting ${request.object.get("tokenId")} at address ${request.object.get(
					"address"
				)} since it was bought`
			);
			await boughtItem.destroy();
			logger.info(
				`Deleted item with Token id ${request.object.get(
					"tokenId"
				)} at address ${request.object.get("address")} }`
			);
		} else {
			logger.info(
				`No item found with address ${request.object.get(
					"address"
				)} and tokenId ${request.object.get("tokenId")}`
			);
		}
	}
});
