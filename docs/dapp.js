var web3
var marriageContract
var mcAddress
var mcABI

$.getJSON("deployed_address.json", function(data){
	mcAddress = data.address
}).fail(function(){
	console.log("An error has occurred while fetching contract address")});

$.getJSON("abi.json", function(data){
	mcAddress = data
}).fail(function(){
	console.log("An error has occurred while fetching contract ABI")});
	

window.addEventListener('load', function(){
    if (typeof window.ethereum !== 'undefined') {
        $('#mm-connection-message').text('Metamask has been detected')
    }
    else {
        console.log('Wallet not avaialble')
        alert('you need to install a ethereum wallet')
    }
    $('#app-display').hide()
    $('#mc-cert-display').hide()
    $('#sign-proposal').hide()
    $('#officiate-marriage').hide()
    $('#create-cert-form').hide()
})


document.getElementById('mm-connect-button').onclick = async () => {
    await ethereum.request({method: 'eth_requestAccounts'})
    $('#mm-connection-message').text('Metamask connected at ' + ethereum.selectedAddress)
    $('#mm-connect-button').hide()
    $('#app-display').show()
    web3 = new Web3(window.ethereum)
    marriageContract = new web3.eth.Contract(mcABI, mcAddress)

    marriageContract.events.ProposalCreated(function(error, event){
        console.log(event)
        certId = event.returnValues['certId']
        transactionHash = event.transactionHash
        $('#message').text('Congrats! Your marriage certificate has been created with a certificate ID ' + certId + ' with transactionHash ' + transactionHash)
    })

    marriageContract.events.MarriageSigned(function(error, event){
        console.log(event)
		certId = event.returnValues['certId']
        transactionHash = event.transactionHash
        $('#message').text('Congrats! Your marriage certificate with ID ' + certId + ' has been signed with transactionHash ' + transactionHash)
    })

    marriageContract.events.MarriageOfficiated(function(error, event){
        console.log(event)
		certId = event.returnValues['certId']
        transactionHash = event.transactionHash
        $('#message').text('Congrats! Your marriage certificate with ID ' + certId + '  has been officiated with transactionHash ' + transactionHash)
    })

}

document.getElementById('mc-createCert-button').onclick = async () => {
    $('#create-cert-form').show()
    $('#mc-cert-display').text('')
}

document.getElementById('mc-getCert-button').onclick = async () => {
	$('#message').text('')
    var mc = await marriageContract.methods.certificates($('#mc-input-cert').val()).call()
    $('#certid').text(mc.certId)
    $('#spouse1').text(mc.spouse1.name)
    $('#spouse1-eth-add').text(mc.spouse1.ethAdd)
    $('#spouse2').text(mc.spouse2.name)
    $('#spouse2-eth-add').text(mc.spouse2.ethAdd)
    $('#proofPhotoUrl').attr("src",mc.proofPhotoUrl)
    $('#mc-cert-display').show()
    switch(mc.state) {
        case '0':
            $('#sign-proposal').show()
            $('#officiate-marriage').hide()
            break;
        case '1':
            $('#sign-proposal').hide()
            $('#officiate-marriage').show()
            break;
        case '2':
            $('#sign-proposal').hide()
            $('#officiate-marriage').hide()
            break;    
        } 
}

document.getElementById('create-cert-button').onclick = async () => {
    $('#message').text('')
    try {
        await marriageContract.methods.createCertificate($('#sp1-name').val(),$('#sp1-id').val(), $('#photo-url').val()).send({from: ethereum.selectedAddress})
		$('#message').text('Your certificate creation will be confirmed soon')
    } catch (err) {
        $('#message').text('Sorry, your transaction failed')
    }
    $('#create-cert-form').hide()
}

document.getElementById('mc-signCert-button').onclick = async () => {
    $('#message').text('')
    try {
        await marriageContract.methods.signCertificate($('#sp2-name').val(),$('#sp2-id').val(),$('#certid').text()).send({from: ethereum.selectedAddress})
        $('#message').text('Your certificate signing will be confirmed soon')
    } catch (err) {
        $('#message').text('Sorry, your signing transaction failed')
    }    
    $('#sign-proposal').hide()
    $('#mc-cert-display').hide()
}

document.getElementById('mc-officiateCert-button').onclick = async () => {
    $('#message').text('')
    try {
        await marriageContract.methods.officiateCertificate($('#certid').text()).send({from: ethereum.selectedAddress})
        $('#message').text('Your certificate officiating will be confirmed soon')
    } catch (err) {
        $('#message').text('Sorry, your officiating transaction failed')
    }    
    $('#mc-cert-display').hide()
}