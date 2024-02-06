const nodemailer = require("nodemailer")
require('dotenv').config()

exports.sendMail = async (from, to, subject, html) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            auth: {
                user: "afshanahmeda2k@gmail.com",
                pass: process.env.BREVO_KEY
            }
        })
        let messagestatus = await transporter.sendMail({
            from,
            to,
            subject,
            html,
        })
        return "message delivered";
    } catch (error) {
        console.log(error)
    }
}

// async function sendMail() {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: "smtp-relay.sendinblue.com",
//             port: 587,
//             auth: {
//                 user: "afshanahmeda2k@gmail.com",
//                 pass: process.env.BREVO_KEY
//             }
//         })
//         transporter.sendMail({
//             from: "venuewebbuilder@proton.me",
//             to: "a2kafshan@gmail.com",
//             subject: "Test mail",
//             html: `
// <html>
// <body>
// <h1>Hello User</h1>
// <h3>You have recieved a query , kindly take action to have booking .</h3>
// </body>
// </html>`
//         }).then((messagestatus) => {
//             // logger.info("message gets delivered", messagestatus)
//             // res.json({ message: "Check your mailbox for link" })
//             console.log("message delivered : ", messagestatus)
//         }).catch(err => {
//             console.log("transporter error : " , err)
//         })
//     } catch (error) {
//         console.log("error in sending mail : ", error)
//     }
// }
// sendMail()
// this.sendMail(
//     'venuewebbuilder@hotmail.com',
//     'a2kafshan@gmail.com',
//     'Mail successfull',
//     `<!DOCTYPE html>
// <html lang="en">
// <head>
// 	<title></title>
// 	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
// 	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
// 	<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
// 	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" /><!--<![endif]-->
// 	<style>
// 		* {
// 			box-sizing: border-box;
// 		}

// 		body {
// 			margin: 0;
// 			padding: 0;
// 		}

// 		a[x-apple-data-detectors] {
// 			color: inherit !important;
// 			text-decoration: inherit !important;
// 		}

// 		#MessageViewBody a {
// 			color: inherit;
// 			text-decoration: none;
// 		}

// 		p {
// 			line-height: inherit
// 		}

// 		.desktop_hide,
// 		.desktop_hide table {
// 			mso-hide: all;
// 			display: none;
// 			max-height: 0px;
// 			overflow: hidden;
// 		}

// 		.image_block img+div {
// 			display: none;
// 		}

// 		@media (max-width:670px) {
// 			.desktop_hide table.icons-inner {
// 				display: inline-block !important;
// 			}

// 			.icons-inner {
// 				text-align: center;
// 			}

// 			.icons-inner td {
// 				margin: 0 auto;
// 			}

// 			.mobile_hide {
// 				display: none;
// 			}

// 			.row-content {
// 				width: 100% !important;
// 			}

// 			.stack .column {
// 				width: 100%;
// 				display: block;
// 			}

// 			.mobile_hide {
// 				min-height: 0;
// 				max-height: 0;
// 				max-width: 0;
// 				overflow: hidden;
// 				font-size: 0px;
// 			}

// 			.desktop_hide,
// 			.desktop_hide table {
// 				display: table !important;
// 				max-height: none !important;
// 			}
// 		}
// 	</style>
// </head>
// <body style="background-color: #F5F5F5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
// This is to inform you that you can send mail
// </body>
// </html>`)