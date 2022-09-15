// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TellYourSecrets is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Secrets", "SEC") {}

    struct Secret {
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Secret) private secrets;

    /// @dev checks if secret with id of tokenId exists
    modifier exists(uint tokenId) {
        require(_exists(tokenId), "Query of nonexistent secret");
        _;
    }

    /**
     * @dev allow users to mint an NFT representing their secret
     * @notice secret will be put on sale
     */
    function addSecret(string calldata uri, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(bytes(uri).length > 0, "Empty uri");
        require(price > 0, "Price must be at least 1 wei");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);

        _setTokenURI(tokenId, uri);
        secrets[tokenId] = Secret(
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        return tokenId;
    }

    /**
     * @dev allow users to buy a secret on sale
     * @notice secret's selling price will be doubled after being bought but secret will no longer be on sale
     */
    function ownSecret(uint256 tokenId) public payable exists(tokenId) {
        Secret storage currentSecret = secrets[tokenId];

        require(!currentSecret.sold, "Secret is already sold");
        require(
            currentSecret.seller != msg.sender,
            "You can't buy your own secret"
        );
        require(
            msg.value == currentSecret.price,
            "Please submit the asking price in order to complete the purchase"
        );
        address seller = secrets[tokenId].seller;
        currentSecret.owner = payable(msg.sender);
        currentSecret.sold = true;
        currentSecret.seller = payable(address(0));
        currentSecret.price *= 2;
        _transfer(address(this), msg.sender, tokenId);
        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Transfer of payment failed");
    }

    /**
     * @dev allow users to put a secret back on sale
     * @notice The NFT will be transferred to the smart contract
     */
    function disownSecret(uint256 tokenId) public payable exists(tokenId) {
        Secret storage currentSecret = secrets[tokenId];
        require(
            currentSecret.owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(currentSecret.sold, "Secret is already sold");
        currentSecret.sold = false;
        currentSecret.seller = payable(msg.sender);
        currentSecret.owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);
    }

    function getSecret(uint256 tokenId) public view exists(tokenId) returns (Secret memory) {
        return secrets[tokenId];
    }

    function getSecretLength() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // The following functions are overrides required by Solidity.

    /**
     * @dev See {IERC721-transferFrom}.
     * Changes is made to transferFrom to update the value of owner in the mapping secrets
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        secrets[tokenId].owner = payable(to);
        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     * Changes is made to safeTransferFrom to update the value of owner in the mapping secrets
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        secrets[tokenId].owner = payable(to);
        _safeTransfer(from, to, tokenId, data);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
