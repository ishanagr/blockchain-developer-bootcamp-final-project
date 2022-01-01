# Design patterns used in this project

## Access Control Design Patterns

- `Ownable` design pattern used in the `officiateCertificate()` function. This functions should only be executed by the contract creator, i.e. the who will be officiating all marriages.

## Inheritance and Interfaces

- `MarriageCertificate` contract inherits the OpenZeppelin `Ownable` contract to enable ownership for officiated marriages.