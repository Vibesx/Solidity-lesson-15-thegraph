import styles from "../styles/Home.module.css";

export default function Home() {
	// How do we show the recently listed NFTs?

	// We will index the events off-chain and then read from our DB.
	// Setup a server to listen for those events to be fired amd we will add them to a DB to query

	// TheGraph will do this in a decentralized way, while Moralis in a centralized way

	return <div className={styles.container}>Hi!</div>;
}
