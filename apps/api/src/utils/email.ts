import { Resend } from "resend";

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

console.log(
  "Resend API Key configured:",
  process.env.RESEND_API_KEY ? "Yes" : "No"
);

// Template HTML para el correo de verificación
const createVerificationEmailTemplate = (
  name: string | undefined,
  verificationUrl: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifica tu email - ClonChat</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        .content {
          padding: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ClonChat</div>
      </div>
      
      <div class="content">
        <h1>¡Bienvenido${name ? `, ${name}` : ""}!</h1>
        
        <p>Gracias por registrarte en ClonChat. Para completar tu registro y comenzar a crear tu chatbot, necesitas verificar tu dirección de email.</p>
        
        <p>Haz clic en el botón de abajo para verificar tu email:</p>
        
        <a href="${verificationUrl}" class="button">Verificar mi email</a>
        
        <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        
        <p><strong>Nota:</strong> Este enlace expirará en 24 horas por seguridad.</p>
      </div>
      
      <div class="footer">
        <p>Si no creaste una cuenta en ClonChat, puedes ignorar este email.</p>
        <p>© 2024 ClonChat. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
  `;
};

// Función para enviar correo de verificación
export const sendVerificationEmail = async (
  email: string,
  token: string,
  name?: string
): Promise<void> => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = `${frontendUrl}/verify-email/${token}`;

  try {
    const result = await resend.emails.send({
      from: "ClonChat <clonchat.ai@gmail.com>",
      to: [email],
      subject: "Verifica tu email - ClonChat",
      html: createVerificationEmailTemplate(name, verificationUrl),
    });

    console.log(`Verification email sent to ${email}`, result);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Función para enviar correo de reenvío
export const sendResendVerificationEmail = async (
  email: string,
  token: string,
  name?: string
): Promise<void> => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = `${frontendUrl}/verify-email/${token}`;

  try {
    const result = await resend.emails.send({
      from: "ClonChat <clonchat.ai@gmail.com>",
      to: [email],
      subject: "Nuevo enlace de verificación - ClonChat",
      html: createVerificationEmailTemplate(name, verificationUrl),
    });

    console.log(`Resend verification email sent to ${email}`, result);
  } catch (error) {
    console.error("Error sending resend verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
