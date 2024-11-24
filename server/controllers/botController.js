const { Front, Snipping } = require('../models');
const sController = require('./snippingController');
const fController = require('./frontController');
const { ethers } = require('ethers');

// Check wallet connection
const checkWalletConnection = async (walletAddress) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider('YOUR_INFURA_OR_ALCHEMY_URL'); // Add your Infura or Alchemy URL here
        const balance = await provider.getBalance(walletAddress);
        console.log('Wallet balance:', ethers.utils.formatEther(balance));
        return balance;
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        throw new Error('Unable to connect to wallet!');
    }
};

// Start a transaction
const startTransaction = async (walletAddress, amount) => {
    try {
        const provider = new ethers.providers.JsonRpcProvider('YOUR_INFURA_OR_ALCHEMY_URL');
        const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider); // Private key should be securely managed
        const transaction = {
            to: walletAddress,
            value: ethers.utils.parseEther(amount), // Set amount in Ether
            gasLimit: 21000, // Gas limit for a basic transaction
            gasPrice: ethers.utils.parseUnits('10', 'gwei'), // Gas price
        };
        const txResponse = await wallet.sendTransaction(transaction);
        console.log('Transaction hash:', txResponse.hash);
        return txResponse.hash;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw new Error('Transaction failed!');
    }
};
module.exports = {
  /* snipping */

  startSnipping(req, res) {
    const { node, wallet, key, token, amount, slippage, gasprice, gaslimit } = req.body;

    try {
      sController.scanMempool(node, wallet, key, token, amount, slippage, gasprice, gaslimit);
    } catch (err) {
      console.log('snipping scanMempool error...');
    }

    /* save database */

    const status = '1';
    Snipping.update(
      {
        status: status,
        node: node,
        wallet: wallet,
        key: key,
        token: token,
        amount: amount,
        slippage: slippage,
        gasprice: gasprice,
        gaslimit: gaslimit,
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then((snipping) =>
        res.status(201).json({
          error: false,
          data: snipping,
          message: 'setting has been updated in the snipping',
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

  stopSnipping(req, res) {
    if (snipSubscription != null) {
      snipSubscription.unsubscribe(function (error, success) {
        if (success) console.log('Successfully unsubscribed!');
      });
    }

    Snipping.update(
      {
        status: '0',
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then((snipping) =>
        res.status(201).json({
          error: false,
          data: snipping,
          message: 'setting has been updated in the snipping',
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

  getSnippingStatus(req, res) {
    Snipping.findAll({
      attribute: 'status',
      where: {
        id: 1,
      },
    })
      .then((snipping) => {
        if (snipping.length == 0) {
          console.log('-------------snipping status', snipping, snipping.length);

          let item = {
            id: 1,
            status: 0,
            node: '',
            wallet: '',
            key: '',
            token: '',
            amount: '',
            slippage: '',
            gasprice: '',
            gaslimit: '',
          };

          Snipping.create(item).then((data) => {
            Snipping.findAll({
              attribute: 'status',
              where: {
                id: 1,
              },
            }).then((data) =>
              res.status(201).json({
                error: false,
                data: data,
                message: 'setting has been updated in the snipping',
              })
            );
          });
        } else {
          res.status(201).json({
            error: false,
            data: snipping,
            message: 'setting has been updated in the snipping',
          });
        }
      })
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

  /* front running ... */

  startFront(req, res) {
    const { node, wallet, key, amount, percent, minbnb, maxbnb } = req.body;

    try {
      fController.scanMempool(node, wallet, key, amount, percent, minbnb, maxbnb);
    } catch (err) {
      console.log('Front scan mempool error......');
    }

    /* save database */

    const status = '1';
    Front.update(
      {
        status: status,
        node: node,
        wallet: wallet,
        key: key,
        amount: amount,
        percent: percent,
        minbnb: minbnb,
        maxbnb: maxbnb,
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then((front) =>
        res.status(201).json({
          error: false,
          data: front,
          message: 'setting has been updated in the front running',
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

  stopFront(req, res) {
    if (frontSubscription != null) {
      frontSubscription.unsubscribe(function (error, success) {
        if (success) console.log('Successfully unsubscribed!');
      });
    }

    Front.update(
      {
        status: '0',
      },
      {
        where: {
          id: 1,
        },
      }
    )
      .then((fdata) =>
        res.status(201).json({
          error: false,
          data: fdata,
          message: 'setting has been updated in the front running',
        })
      )
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },

  getFrontStatus(req, res) {
    console.log('-------------getfront status');
    Front.findAll({
      attribute: 'status',
      where: {
        id: 1,
      },
    })
      .then((front) => {
        if (front.length == 0) {
          console.log('-------------front status', front, front.length);

          let item = {
            id: 1,
            status: 0,
            node: '',
            wallet: '',
            key: '',
            amount: '',
            percent: '',
            minbnb: '',
            maxbnb: '',
          };

          Front.create(item).then((data) => {
            Front.findAll({
              attribute: 'status',
              where: {
                id: 1,
              },
            }).then((data) =>
              res.status(201).json({
                error: false,
                data: data,
                message: 'setting has been updated in the snipping',
              })
            );
          });
        } else {
          res.status(201).json({
            error: false,
            data: front,
            message: 'setting has been updated in the snipping',
          });
        }
      })
      .catch((error) =>
        res.json({
          error: true,
          error: error,
        })
      );
  },
};

