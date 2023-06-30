const paymentOptions = [
  {
    chainId: 80001,
    receiverAddress: "0x8e2412Aa03A75dF7C76E497bdda059c6C2850079",
    superToken: {
      address: "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7",
    },
    flowRate: {
      amountEther: "10",
      period: "month",
    },
  },
];

const paymentDetails = {
  paymentOptions,
};

export { paymentDetails };
