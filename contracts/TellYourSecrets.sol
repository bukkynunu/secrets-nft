// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TellYourSecrets is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Secrets", "SEC") {}

    uint256 owners = 0;

    struct Secret {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Secret) private secrets;

    function safeMint(string memory uri, uint256 price)
        public
        payable
        returns (uint256)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);

        _setTokenURI(tokenId, uri);
        addSecret(tokenId, price);
        // setApprovalForAll(msg.sender, true);

        return tokenId;
    }

    function makeTransfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        
        _transfer(from, to, tokenId);
        secrets[tokenId].owner = payable(to);
        owners++;
    }

    function addSecret(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        secrets[tokenId] = Secret(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    function ownSecret(uint256 tokenId) public payable {
        uint256 price = secrets[tokenId].price;
        address seller = secrets[tokenId].seller;
        require(
            msg.value >= price,
            "Please submit the asking price in order to complete the purchase"
        );
        secrets[tokenId].owner = payable(msg.sender);
        secrets[tokenId].sold = true;
        secrets[tokenId].seller = payable(address(0));
        secrets[tokenId].price *= 2;
        _transfer(address(this), msg.sender, tokenId);

        payable(seller).transfer(msg.value);
    }

    function disownSecret(uint256 tokenId) public payable {
        require(
            secrets[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        secrets[tokenId].sold = false;
        secrets[tokenId].seller = payable(msg.sender);
        secrets[tokenId].owner = payable(address(this));

        _transfer(msg.sender, address(this), tokenId);
    }

    function getSecret(uint256 tokenId) public view returns (Secret memory) {
        return secrets[tokenId];
    }

    function getSecretLength() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getOwners() public view returns (uint256) {
        return owners;
    }

    // The following functions are overrides required by Solidity.

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
