const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecretNFT", function () {
  this.timeout(50000);

  let secretNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    const SecretNFT = await ethers.getContractFactory("TellYourSecrets");
    [owner, acc1, acc2] = await ethers.getSigners();

    secretNFT = await SecretNFT.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await secretNFT.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    
    const tokenURI = "https://example.com/1";
    const price = ethers.utils.parseUnits("1", "ether");
    await secretNFT.connect(owner).safeMint(tokenURI, price);
    await secretNFT;

    // expect(await secretNFT.balanceOf(acc1.address)).to.equal(1);
  });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    const price = ethers.utils.parseUnits("1", "ether");

    const tx1 = await secretNFT
      .connect(owner)
      .safeMint(tokenURI_1, price);
    await tx1.wait();
    const tx2 = await secretNFT
      .connect(owner)
      .safeMint(tokenURI_2, price);
    await tx2.wait();

    expect(await secretNFT.tokenURI(0)).to.equal(tokenURI_1);
    expect(await secretNFT.tokenURI(1)).to.equal(tokenURI_2);
  });
  it("Should buy and transfer the NFT", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await secretNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await secretNFT
    .connect(acc1)
    .ownSecret( 0, {value: price});
    await secretNFT.connect(acc1).makeTransfer(acc1.address, owner.address,0);
    const _owner = await secretNFT.ownerOf(0);
    console.log(_owner, owner.address);
    await secretNFT.connect(owner).disownSecret(0)
  })
  it("Should sell the nft", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await secretNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await secretNFT
    .connect(acc1)
    .ownSecret( 0, {value: price});
    await secretNFT.connect(acc1).disownSecret(0)
  })
  it("Should get the nft", async function(){
    const price = ethers.utils.parseUnits("1", "ether");

    await secretNFT
    .connect(owner)
    .safeMint("https://example.com/1", price);
     await secretNFT
    .connect(acc1)
    .getSecret(0);
  })
});
