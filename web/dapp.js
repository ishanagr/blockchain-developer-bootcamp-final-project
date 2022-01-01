var web3
var marriageContract

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
        transactionHash = event.transactionHash
        $('#message').text('Congrats! Your marriage certificate with ID ' + certId + ' has been signed with transactionHash ' + transactionHash)
    })

    marriageContract.events.MarriageOfficiated(function(error, event){
        console.log(event)
        transactionHash = event.transactionHash
        $('#message').text('Congrats! Your marriage certificate with ID ' + certId + '  has been officiated with transactionHash ' + transactionHash)
    })

}

document.getElementById('mc-createCert-button').onclick = async () => {
    $('#create-cert-form').show()
    $('#mc-cert-display').text('')
}

document.getElementById('mc-getCert-button').onclick = async () => {
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


const mcAddress = '0x626104a350e25f001183fe7826C1dB44e7b7c5cb'

const mcABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			}
		],
		"name": "MarriageOfficiated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			}
		],
		"name": "MarriageSigned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			}
		],
		"name": "ProposalCreated",
		"type": "event"
	},
	{
		"stateMutability": "nonpayable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "certCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "ethAdd",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "signedId",
						"type": "string"
					}
				],
				"internalType": "struct MarriageCertificate.Spouse",
				"name": "spouse1",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "ethAdd",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "signedId",
						"type": "string"
					}
				],
				"internalType": "struct MarriageCertificate.Spouse",
				"name": "spouse2",
				"type": "tuple"
			},
			{
				"internalType": "enum MarriageCertificate.State",
				"name": "state",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "proofPhotoUrl",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "officiatedBy",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_signedId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_proofPhotoUrl",
				"type": "string"
			}
		],
		"name": "createCertificate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "marriedCertificates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			}
		],
		"name": "officiateCertificate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_signedId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "certId",
				"type": "uint256"
			}
		],
		"name": "signCertificate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]