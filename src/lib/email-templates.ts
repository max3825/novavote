/**
 * Email Template Builder
 * Génère du HTML d'email avec CSS INLINE
 * IMPORTANT: Les clients email (Gmail, Outlook) n'acceptent pas les classes Tailwind
 * Toutes les couleurs sont hardcoded en HEX
 */

interface EmailTemplateParams {
  recipientName: string;
  subject: string;
  content: string;
  actionButtonText?: string;
  actionButtonUrl?: string;
  footerText?: string;
}

export function generateMagicLinkEmail(
  recipientName: string,
  magicLink: string
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre lien de vote sécurisé</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
          
          <!-- Header avec Logo -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div style="font-size: 48px; margin-bottom: 15px;">🔐</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">NovaVote</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Vote électronique sécurisé</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: bold;">Bonjour ${recipientName},</h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Vous avez été invité à participer à une élection officielle. Votre participation est essentielle pour garantir la légitimité du processus démocratique.
              </p>

              <div style="margin: 40px 0; padding: 20px; background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px;">
                <p style="margin: 0; color: #0c4a6e; font-size: 14px; font-weight: bold;">ÉLECTION EN COURS</p>
                <p style="margin: 8px 0 0 0; color: #0ea5e9; font-size: 18px; font-weight: bold;">C'est sécurisé</p>
              </div>

              <p style="margin: 20px 0 40px 0; color: #475569; font-size: 16px; font-weight: 500;">Cliquez sur le bouton ci-dessous pour accéder au vote :</p>

              <!-- Action Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto; width: 100%; max-width: 400px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${magicLink}" style="display: inline-block; padding: 16px 48px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; transition: background-color 0.3s ease;">
                      Accéder au vote →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <div style="margin: 40px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; font-weight: 600;">🔗 Lien sécurisé valable 15 minutes</p>
                <p style="margin: 0 0 10px 0; color: #475569; font-size: 12px;">Si le bouton ne fonctionne pas, copiez ce lien :</p>
                <p style="margin: 0; color: #6366f1; font-size: 12px; word-break: break-all;">
                  <a href="${magicLink}" style="color: #6366f1; text-decoration: none;">${magicLink}</a>
                </p>
              </div>

              <!-- Security Info -->
              <div style="margin: 40px 0 0 0; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px;">
                <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: bold;">✓ Sécurité garantie par cryptographie asymétrique RSA-2048</p>
                <p style="margin: 8px 0 0 0; color: #047857; font-size: 13px;">Votre vote est chiffré end-to-end et vérifiable publiquement</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                © 2026 NovaVote • Cryptographie asymétrique • Vote vérifiable
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                Si vous n'avez pas demandé ce lien, ignorez cet email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Générique Email Template (réutilisable)
 */
export function generateGenericEmail(params: EmailTemplateParams): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">NovaVote</h1>
              <h2 style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px; font-weight: normal;">${params.subject}</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px; color: #1e293b; font-size: 16px; line-height: 1.6;">
              <p style="margin: 0 0 20px 0;">Bonjour ${params.recipientName},</p>
              ${params.content.split('\n').map((line) => `<p style="margin: 0 0 20px 0;">${line}</p>`).join('')}
              ${
                params.actionButtonUrl
                  ? `
                <table cellpadding="0" cellspacing="0" style="margin: 40px auto; width: 100%; max-width: 300px;">
                  <tr>
                    <td style="text-align: center;">
                      <a href="${params.actionButtonUrl}" style="display: inline-block; padding: 12px 40px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold;">
                        ${params.actionButtonText || "Cliquez ici"}
                      </a>
                    </td>
                  </tr>
                </table>
              `
                  : ''
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                © 2026 NovaVote
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                ${params.footerText || "Plateforme de vote électronique sécurisée"}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
