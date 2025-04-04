require("dotenv").config()
var {db, prisma} = require("../db")
const mailjet = require ('node-mailjet')
	.connect(process.env.mailJetClientId, process.env.mailJetClientSecret)



async function sendVerificationEmailToUserId(userId){
  let user = await prisma.user.findFirst({
    where: {id: parseInt(userId)}
  }) 
  if(user == null){
    throw new Error("Hiba a hitelesítő email küldése közben: Nem sikerült létrehozni a felhasználót", {cause:400})
  }
  let verificationLink = `${process.env.url}api/user/verify?username=${user.username}&id=${user.id}&pin=${user.tempPin}`
  let request = mailjet
	.post("send", {'version': 'v3.1'})
	.request({
		"Messages":[
				{
						"From": {
								"Email": "eventor@petokrisa.hu",
								"Name": "Eventor"
						},
						"To": [
								{
										"Email": `${user.email}`,
								}
						],
						"Subject": "Eventor hitelesítés",
						"TextPart": `Az alábbi linkre kattintva hitelesítheti a fiókjához tartozó emailcímet: ${verificationLink}`,
						"HTMLPart": `<h1>Felhasználó hitelesítés</h1> <p>Az alábbi linkre kattintva hitelesítheti a fiókjához tartozó emailcímet:</p> <br/> <a href="${verificationLink}">Hitelesítés</a>`
				}
		]
	})

} 

module.exports = {sendVerificationEmailToUserId}