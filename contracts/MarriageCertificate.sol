// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
// pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contract for Ethereum Marriage Certificates
/// @author Ishan Agrawal
/// @notice Allows users to registery marriage on ethereum blockchain
/// @dev Fee payment to the officiater to be added. 
/// @dev Oracles to validate national ID to be added
contract MarriageCertificate is Ownable {


  uint public certCount;

  mapping (uint => Certificate) public certificates;
  mapping (address => uint) public marriedCertificates;

// TODO: Add registration and signing fee paid out to the officiator for their work

/// @notice Maintains states in lifecycle of marriage registry
  enum State {Proposed, Signed, Officiated}

  struct Spouse {
    string name;
    address ethAdd;
    string signedId;
  }

/// @notice Struct for digital certificate
  struct Certificate {
    uint certId;
    Spouse spouse1;
    Spouse spouse2;
    State state;
    string proofPhotoUrl;
    address officiatedBy;
  }

/// @notice Emit after Certificate creation by first spouse acting as a proposal
  event ProposalCreated(uint indexed certId);

/// @notice Emit after second spouse signs the marriage certificate
  event MarriageSigned(uint indexed certId);

/// @notice Emit after the officiator validates and officiates the marriage certificate
  event MarriageOfficiated(uint indexed certId);


  constructor() {
    certCount = 0;
  }

  fallback () external {
      revert();
  }

  modifier isNotMarried(address spouse) {
    require(marriedCertificates[spouse] == 0);
    _;
  }

  /// @notice Creates marriage certificate 
  /// @param _name name of first spouse
  /// @param _signedId encrypted ID information of the first spouse
  /// @param _proofPhotoUrl photo proof of the wedding
  function createCertificate(string memory _name, string memory _signedId, string memory _proofPhotoUrl) 
    public 
    payable
    isNotMarried(msg.sender) {
    certCount += 1;
    certificates[certCount] = Certificate({
      certId: certCount,
      spouse1: Spouse({
        name: _name,
        ethAdd: msg.sender,
        signedId: _signedId
      }),
      spouse2: Spouse({
        name: "",
        ethAdd: 0x0000000000000000000000000000000000000000,
        signedId: ""
      }),
      state: State.Proposed,
      proofPhotoUrl: _proofPhotoUrl,
      officiatedBy:  0x0000000000000000000000000000000000000000
    });
    emit ProposalCreated(certCount);
  }

  /// @notice Sign marriage certificate by the second spouse 
  /// @param _name name of second spouse
  /// @param _signedId encrypted ID information of the second spouse
  /// @param certId certificate ID for the certificate created by the first spouse
  function signCertificate(string memory _name, string memory _signedId, uint certId) 
    public
    payable 
    isNotMarried(msg.sender) {
    // cannot be signed by the proposer themselves
    require(msg.sender != certificates[certId].spouse1.ethAdd);
    // check previous state to be proposed
    require(certificates[certId].state == State.Proposed);
    
    // TODO: name and signed id should be the same as submitted by the first spouse
    certificates[certId].spouse2.name = _name;
    certificates[certId].spouse2.signedId = _signedId;
    certificates[certId].spouse2.ethAdd = msg.sender;
    certificates[certId].state = State.Signed;
    emit MarriageSigned(certId);
  }

  /// @notice Officiate marriage certificate by the second spouse 
  /// @param certId certificate ID for the certificate you would like to officiate
  function officiateCertificate(uint certId) public onlyOwner payable {
    //TODO: use roles from openzeppelin for contract owner to assign officiator role to others 

    //check if the current state is signed
    require(certificates[certId].state == State.Signed);
    certificates[certId].state = State.Officiated;
    certificates[certId].officiatedBy = msg.sender;
    marriedCertificates[certificates[certId].spouse1.ethAdd] = certId;
    marriedCertificates[certificates[certId].spouse2.ethAdd] = certId;
    emit MarriageOfficiated(certId);
  }

}
