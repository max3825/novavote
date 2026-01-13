from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

# Thread pool for async SMTP operations
_email_executor = ThreadPoolExecutor(max_workers=3)


class EmailService:
    @staticmethod
    def _send_smtp_email(msg: MIMEMultipart, recipient: str) -> None:
        """Synchronous SMTP send - runs in thread pool."""
        try:
            if settings.MAIL_USE_SSL:
                server = smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT, timeout=30)
            else:
                server = smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT, timeout=30)
                if settings.MAIL_USE_TLS:
                    server.starttls()
            
            if settings.MAIL_USERNAME and settings.MAIL_PASSWORD:
                server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            
            server.send_message(msg)
            server.quit()
            logger.info("[EMAIL SENT] Successfully sent to %s", recipient)
        except Exception as e:
            logger.error("[EMAIL ERROR] Failed to send to %s: %s", recipient, str(e))
            raise

    @staticmethod
    async def send_magic_link(email: str, token: str, election_title: str):
        """Send Premium Midnight themed magic link email for voting."""
        if not settings.MAIL_ENABLED:
            logger.info("[EMAIL DISABLED] Would send magic link to %s", email)
            return
        
        vote_url = f"{settings.PUBLIC_URL}/vote/{token}"
        
        html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation à voter - NovaVote</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 15px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);">
                    
                    <!-- Gradient Top Bar -->
                    <tr>
                        <td style="height: 6px; background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #6366f1 100%); background-size: 200% 100%;"></td>
                    </tr>
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 48px 40px 24px 40px;">
                            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);">
                                <span style="font-size: 40px; line-height: 1;">🗳️</span>
                            </div>
                            <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 900; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.025em;">NovaVote</h1>
                            <p style="margin: 0; color: #94a3b8; font-size: 14px; font-weight: 600;">Plateforme de vote sécurisée</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <!-- Hero Title -->
                            <h2 style="margin: 0 0 16px 0; color: #f1f5f9; font-size: 28px; font-weight: 900; text-align: center; line-height: 1.3; letter-spacing: -0.025em;">
                                Votre voix est requise
                            </h2>
                            
                            <p style="margin: 0 0 32px 0; color: #cbd5e1; font-size: 16px; line-height: 1.7; text-align: center; font-weight: 500;">
                                Vous avez été invité(e) à participer à une élection officielle. Votre participation est essentielle pour garantir la légitimité du processus démocratique.
                            </p>
                            
                            <!-- Election Card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%); border: 2px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 24px; text-align: center;">
                                        <p style="margin: 0 0 12px 0; color: #818cf8; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">ÉLECTION EN COURS</p>
                                        <p style="margin: 0; color: #f1f5f9; font-size: 20px; font-weight: 900; letter-spacing: -0.025em;">{election_title}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{vote_url}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff; padding: 18px 48px; border-radius: 12px; font-weight: 800; font-size: 17px; text-decoration: none; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.5); letter-spacing: -0.025em;">
                                            Accéder au vote →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Info -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: rgba(51, 65, 85, 0.5); border-radius: 12px; padding: 20px; margin: 0 0 24px 0; border: 1px solid rgba(100, 116, 139, 0.3);">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 13px; text-align: center; font-weight: 600;">
                                            🔒 Lien sécurisé valable {settings.MAGIC_LINK_EXPIRE_MINUTES} minutes
                                        </p>
                                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-align: center;">
                                            Si le bouton ne fonctionne pas, copiez ce lien :
                                        </p>
                                        <p style="margin: 0; text-align: center;">
                                            <a href="{vote_url}" style="color: #818cf8; font-size: 11px; word-break: break-all; text-decoration: none;">{vote_url}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Trust Badge -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%); border-left: 3px solid #10b981; border-radius: 8px; padding: 16px;">
                                        <p style="margin: 0; color: #34d399; font-size: 13px; font-weight: 600;">
                                            ✓ Sécurité garantie par cryptographie asymétrique RSA-2048
                                        </p>
                                        <p style="margin: 8px 0 0 0; color: #6ee7b7; font-size: 12px;">
                                            Votre vote est chiffré end-to-end et vérifiable publiquement
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%); padding: 28px 40px; text-align: center; border-top: 1px solid rgba(51, 65, 85, 0.5);">
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 600;">
                                © 2026 NovaVote • Cryptographie asymétrique • Vote vérifiable
                            </p>
                            <p style="margin: 0; color: #475569; font-size: 11px;">
                                Si vous n'avez pas demandé ce lien, ignorez cet email
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Legal Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; margin-top: 24px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: 500;">
                                Envoyé automatiquement par le système NovaVote
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        """
        
        text_content = f"""
NovaVote - Invitation à voter

Cher(e) électeur(trice),

Vous avez été invité(e) à participer à l'élection : {election_title}

Pour voter, cliquez sur le lien suivant :
{vote_url}

Ce lien est valable pendant {settings.MAGIC_LINK_EXPIRE_MINUTES} minutes.
Votre vote est sécurisé par cryptographie RSA-2048 et vérifiable publiquement.

Si vous n'avez pas demandé ce lien, ignorez cet email.

---
© 2026 NovaVote - Plateforme de vote électronique sécurisée
        """
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"🗳️ Invitation à voter - {election_title}"
            msg['From'] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
            msg['To'] = email
            
            part1 = MIMEText(text_content, 'plain', 'utf-8')
            part2 = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(part1)
            msg.attach(part2)
            
            # Run SMTP in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(_email_executor, EmailService._send_smtp_email, msg, email)
            
        except Exception as e:
            logger.error("[EMAIL ERROR] Failed to send magic link to %s: %s", email, str(e))
            raise

    @staticmethod
    async def send_vote_confirmation(email: str, election_title: str, election_id: str, tracking_code: str):
        """Send Premium Midnight themed confirmation email after successful vote."""
        if not settings.MAIL_ENABLED:
            logger.info("[EMAIL DISABLED] Would send vote confirmation to %s", email)
            return
        
        results_url = f"{settings.PUBLIC_URL}/results/{election_id}?tracking={tracking_code}"
        
        html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vote enregistré - NovaVote</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 15px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);">
                    
                    <!-- Success Gradient Top Bar -->
                    <tr>
                        <td style="height: 6px; background: linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%); background-size: 200% 100%;"></td>
                    </tr>
                    
                    <!-- Header with Success Icon -->
                    <tr>
                        <td align="center" style="padding: 48px 40px 24px 40px;">
                            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.4);">
                                <span style="font-size: 40px; line-height: 1;">✓</span>
                            </div>
                            <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 900; color: #10b981; letter-spacing: -0.025em;">Vote enregistré</h1>
                            <p style="margin: 0; color: #6ee7b7; font-size: 14px; font-weight: 600;">Votre bulletin a été reçu avec succès</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <!-- Thank You Message -->
                            <h2 style="margin: 0 0 16px 0; color: #f1f5f9; font-size: 24px; font-weight: 900; text-align: center; letter-spacing: -0.025em;">
                                Merci d'avoir voté
                            </h2>
                            
                            <p style="margin: 0 0 32px 0; color: #cbd5e1; font-size: 16px; line-height: 1.7; text-align: center; font-weight: 500;">
                                Votre vote pour l'élection suivante a été enregistré avec succès et ajouté au registre public vérifiable.
                            </p>
                            
                            <!-- Election Card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%); border: 2px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 24px;">
                                        <p style="margin: 0 0 8px 0; color: #34d399; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">✓ VOTE CONFIRMÉ</p>
                                        <p style="margin: 0; color: #f1f5f9; font-size: 20px; font-weight: 900; text-align: center; letter-spacing: -0.025em;">{election_title}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Tracking Code -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 12px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-align: center;">
                                            🔍 NUMÉRO DE SUIVI
                                        </p>
                                        <p style="margin: 0 0 16px 0; text-align: center;">
                                            <span style="display: inline-block; background: rgba(51, 65, 85, 0.5); color: #a5b4fc; padding: 12px 24px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700; letter-spacing: 0.1em; border: 1px solid rgba(129, 140, 248, 0.3);">
                                                {tracking_code}
                                            </span>
                                        </p>
                                        <p style="margin: 0; color: #818cf8; font-size: 12px; text-align: center; line-height: 1.6;">
                                            Conservez ce code pour vérifier votre vote dans le registre public.<br>
                                            Votre bulletin est chiffré et seul vous pouvez confirmer qu'il s'agit du vôtre.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Results CTA -->
                            <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 15px; line-height: 1.7; text-align: center;">
                                Les résultats seront publiés dès la fermeture de l'élection. Vous pourrez les consulter avec votre code de suivi.
                            </p>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{results_url}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; padding: 16px 40px; border-radius: 12px; font-weight: 800; font-size: 16px; text-decoration: none; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4); letter-spacing: -0.025em;">
                                            Voir les résultats →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Badges -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 20px; background: rgba(51, 65, 85, 0.3); border-radius: 12px; border: 1px solid rgba(100, 116, 139, 0.3);">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="33%" align="center" style="padding: 8px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 20px; line-height: 1;">🔒</p>
                                                    <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 600;">Chiffré E2E</p>
                                                </td>
                                                <td width="33%" align="center" style="padding: 8px; border-left: 1px solid rgba(100, 116, 139, 0.3); border-right: 1px solid rgba(100, 116, 139, 0.3);">
                                                    <p style="margin: 0 0 4px 0; font-size: 20px; line-height: 1;">✓</p>
                                                    <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 600;">Vérifiable</p>
                                                </td>
                                                <td width="33%" align="center" style="padding: 8px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 20px; line-height: 1;">🌐</p>
                                                    <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 600;">Public</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%); padding: 28px 40px; text-align: center; border-top: 1px solid rgba(51, 65, 85, 0.5);">
                            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 600;">
                                © 2026 NovaVote • Registre public vérifiable • RSA-2048
                            </p>
                            <p style="margin: 0; color: #475569; font-size: 11px;">
                                Vous recevrez un email lors de la publication des résultats
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Legal Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 480px; margin-top: 24px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #64748b; font-size: 11px; font-weight: 500;">
                                Confirmation envoyée automatiquement par NovaVote
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        """
        
        text_content = f"""
✓ Merci d'avoir voté - NovaVote

Votre vote pour l'élection suivante a été enregistré avec succès :
{election_title}

Numéro de suivi : {tracking_code}
Conservez ce code pour vérifier votre vote dans le registre public.

Votre bulletin est chiffré end-to-end et vérifiable publiquement.

Voir les résultats (disponibles après fermeture de l'élection) :
{results_url}

---
© 2026 NovaVote - Plateforme de vote électronique sécurisée
Vous recevrez un email lors de la publication des résultats.
        """
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"✓ Vote enregistré - {election_title}"
            msg['From'] = f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM}>"
            msg['To'] = email
            
            part1 = MIMEText(text_content, 'plain', 'utf-8')
            part2 = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(part1)
            msg.attach(part2)
            
            # Run SMTP in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(_email_executor, EmailService._send_smtp_email, msg, email)
            
        except Exception as e:
            logger.error("[EMAIL ERROR] Failed to send vote confirmation to %s: %s", email, str(e))


email_service = EmailService()
