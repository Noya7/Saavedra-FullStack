const HttpError = require('../models/http-error');
const transporter = require('./transporter')

const mail = {
    resetPass : (to, url) => {
        const mailOptions = {
                from: process.env.GMAIL_ACCOUNT,
                to,
                subject: "Codigo de recuperacion de contraseña",
                text: `Accede al siguiente enlace para actualizar tu contraseña: ${url}
                      Este solo sera valido por 15 minutos.`,
                html: `
                    <html>
                        <head>
                            <style>
                              body {
                                font-family: Arial, sans-serif;
                                background-color: #f5f5f5;
                                color: #333;
                                padding: 20px;
                              }
                          
                              .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #fff;
                                padding: 30px;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                              }
                          
                              h1 {
                                color: #007bff;
                                text-align: center;
                                margin-bottom: 30px;
                              }
                          
                              p {
                                margin: 20px 0;
                                line-height: 1.6;
                              }
                          
                              a {
                                color: #007bff;
                                text-decoration: none;
                                font-weight: bold;
                                padding: 10px 20px;
                                border-radius: 5px;
                                background-color: #e9ecef;
                                transition: background-color 0.3s ease;
                              }
                          
                              a:hover {
                                background-color: #d3d9df;
                              }
                            </style>
                        </head>
                        <body>
                          <div class="container">
                            <h1>Actualización de contraseña</h1>
                            <p>Estimado usuario,</p>
                            <p>Hemos recibido una solicitud para actualizar la contraseña de su cuenta. Por motivos de seguridad, le pedimos que haga clic en el siguiente enlace para completar el proceso de cambio de contraseña:</p>
                            <p><a href="${url}">Cambiar contraseña</a></p>
                            <p>Este enlace solo será válido por 15 minutos. Si no ha solicitado este cambio de contraseña, puede ignorar este correo electrónico.</p>
                            <p>Gracias por su comprensión y por ayudarnos a mantener su cuenta segura.</p>
                            <p>Atentamente,<br>El equipo de soporte</p>
                          </div>
                        </body>
                    </html>
                `
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err){
                throw new HttpError('Ha ocurrido un error durante el envio del mail de recuperacion. Error: ' + err.message, 500)
            }
            return info;
        })
    }
}

module.exports = mail;