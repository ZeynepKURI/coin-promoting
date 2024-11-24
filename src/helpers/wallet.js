import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

// Check and initialize the wallet provider
export const initializeWallet = async () => {
    try {
        const provider = await detectEthereumProvider();
        if (provider) {
            console.log('MetaMask is installed!');
            // Set the wallet provider globally
            window.ethereum = provider;
        } else {
            console.error('MetaMask is not installed!');
            alert('MetaMask not found. Please install MetaMask.');
        }
    } catch (error) {
        console.error('Error detecting Ethereum provider:', error);
        alert('Unable to connect to wallet.');
    }
};

// Connect wallet
export const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            console.error('No wallet found! Please install MetaMask.');
            alert('MetaMask not found! Please install MetaMask.');
            return;
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log('Connected address:', address);
        return address;
    } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect to wallet.');
    }
};

// Check network
export const checkNetwork = async () => {
    try {
        if (!window.ethereum) {
            console.error('No wallet found!');
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        console.log('Connected network:', network);
        return network;
    } catch (error) {
        console.error('Error checking network:', error);
        alert('Unable to check network.');
    }
};

// Disconnect wallet
export const disconnectWallet = async () => {
    try {
        console.log('Disconnect wallet function triggered.');
        // Wallet disconnection logic can be added here
    } catch (error) {
        console.error('Error during wallet disconnection:', error);
    }
};
