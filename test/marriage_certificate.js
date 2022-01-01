const { catchRevert } = require("./exceptionsHelpers.js");
const MarriageCertificate = artifacts.require("MarriageCertificate");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MarriageCertificate", function ( accounts ) {

  const [_owner, spouse1, spouse2, sp1, sp2, badJoe] = accounts;
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  const sp1_name = "John"
  const sp1_signed_id = "4de160de50a7a5ff0320374987f0f067700fdd983b21b6ed0603f242e4f8433a"
  const sp2_name = "Mary"
  const sp2_signed_id = "1e362581477fa794c2bab8269aeba91749c05f4faa58efed2b6833c9c0d79f80"
  const proofPhotoUrl = "https://i.insider.com/5eac8da748d92c3d275bb2de?width=200&format=jpeg"



  let instance;
  beforeEach(async () => {
    instance = await MarriageCertificate.new();
  });

  it("is owned by owner", async () => {
    assert.equal(await instance.owner.call(), _owner, "the contract is not owned by owner");
  });

  it("should change state on certificate signing", async () => {
    var result =  await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 })
    var certId = result.logs[0].args.certId.toNumber();
    await instance.signCertificate(sp2_name, sp2_signed_id, certId, { from: spouse2 })
    certs = await instance.certificates.call(certId)
    assert.equal(certs.state, 1, "the contract is not returning a certificate ID");
  });


  it("allows only unmarried person to create a marriage certificate", async () => {
    var result =  await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 });
    var certId = result.logs[0].args.certId.toNumber();
    await instance.signCertificate(sp2_name, sp2_signed_id, certId, { from: spouse2 });
    await instance.officiateCertificate(certId, { from: _owner});
    certs = await instance.certificates.call(certId)
    await catchRevert(instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 })) 
  });

  it("allows only unmarried person to sign a marriage certificate", async () => {
    var result =  await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 });
    var certId = result.logs[0].args.certId.toNumber();
    await instance.signCertificate(sp2_name, sp2_signed_id, certId, { from: spouse2 });
    await instance.officiateCertificate(certId, { from: _owner});
    certs = await instance.certificates.call(certId)
    result =await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: sp1 })
    certId = result.logs[0].args.certId.toNumber();
    await catchRevert(instance.signCertificate(sp2_name, sp2_signed_id, certId, { from: spouse2 }))
  });

  it("allows unofficiated marriage certificated holder to register for another marriage", async () => {
    var result =  await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 });
    var certId = result.logs[0].args.certId.toNumber();
    await instance.signCertificate(sp2_name, sp2_signed_id, certId, { from: spouse2 });
    // not officiated
    certs = await instance.certificates.call(certId)
    result = await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 })

    assert.equal(2, result.logs[0].args.certId.toNumber(), "person not allowed to create certificate even though previous marriage is not officiated");
  });

  it("allows only contract owner to officiate the marriage", async () => {
    var result =  await instance.createCertificate(sp1_name, sp1_signed_id, proofPhotoUrl, { from: spouse1 });
    var certId = result.logs[0].args.certId.toNumber();
    await instance.signCertificate(sp2_name, sp2_signed_id, certId, { from: spouse2 });
    await catchRevert(instance.officiateCertificate(certId, { from: badJoe}))
  });


});
