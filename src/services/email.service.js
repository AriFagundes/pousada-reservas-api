const { Resend } = require('resend');

const resend = new Resend('re_eBHz9hXZ_3STfk2bQroip7J3Q6WDkfhhq');

// URL do frontend - muda conforme o ambiente
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const enviarEmailVerificacao = async (email, nome, token) => {
  const linkVerificacao = `${FRONTEND_URL}/verificar-email?token=${token}`;
  
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '🏨 Ative sua conta - Sistema de Reservas',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .header {
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #1f2937;
              font-size: 24px;
              margin-top: 0;
            }
            .content p {
              color: #4b5563;
              font-size: 16px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              margin: 30px 0;
              padding: 16px 40px;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
              transition: all 0.3s ease;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5);
            }
            .info-box {
              background: #f3f4f6;
              border-left: 4px solid #6366f1;
              padding: 15px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .info-box p {
              margin: 0;
              font-size: 14px;
              color: #6b7280;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              color: #9ca3af;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏨 Sistema de Reservas</h1>
            </div>
            <div class="content">
              <h2>Olá, ${nome}! 👋</h2>
              <p>Bem-vindo ao nosso Sistema de Gestão Hoteleira!</p>
              <p>Para ativar sua conta e começar a usar o sistema, clique no botão abaixo:</p>
              
              <center>
                <a href="${linkVerificacao}" class="button">
                  ✅ Ativar Minha Conta
                </a>
              </center>

              <div class="info-box">
                <p><strong>⏰ Este link expira em 24 horas.</strong></p>
                <p>Por segurança, o link de verificação só pode ser usado uma vez.</p>
              </div>

              <p>Se você não criou esta conta, pode ignorar este email.</p>
            </div>
            <div class="footer">
              <p>© 2026 Sistema de Reservas - Todos os direitos reservados</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Email enviado com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de verificação');
  }
};

const enviarEmailBoasVindas = async (email, nome) => {
  const linkDashboard = `${FRONTEND_URL}/dashboard`;
  
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '✅ Bem-vindo ao Sistema de Reservas!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #1f2937;
              font-size: 24px;
              margin-top: 0;
            }
            .content p {
              color: #4b5563;
              font-size: 16px;
              line-height: 1.6;
            }
            .features {
              margin: 30px 0;
            }
            .feature {
              display: flex;
              align-items: center;
              margin: 15px 0;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 10px;
            }
            .feature-icon {
              font-size: 24px;
              margin-right: 15px;
            }
            .button {
              display: inline-block;
              margin: 30px 0;
              padding: 16px 40px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              color: #9ca3af;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Conta Ativada!</h1>
            </div>
            <div class="content">
              <h2>Parabéns, ${nome}!</h2>
              <p>Sua conta foi ativada com sucesso! Agora você tem acesso completo ao sistema.</p>
              
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">📊</div>
                  <div>
                    <strong>Dashboard Completo</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Visualize todas as reservas em tempo real</p>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🏨</div>
                  <div>
                    <strong>Gestão de Quartos</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Controle completo dos quartos e tipos</p>
                  </div>
                </div>
                <div class="feature">
                  <div class="feature-icon">📅</div>
                  <div>
                    <strong>Timeline PMS</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Visualização estilo linha do tempo</p>
                  </div>
                </div>
              </div>

              <center>
                <a href="${linkDashboard}" class="button">
                  🚀 Acessar Sistema
                </a>
              </center>
            </div>
            <div class="footer">
              <p>© 2026 Sistema de Reservas - Todos os direitos reservados</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Email de boas-vindas enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email de boas-vindas:', error);
    // Não lança erro aqui pois é apenas informativo
    return { success: false, error };
  }
};

module.exports = {
  enviarEmailVerificacao,
  enviarEmailBoasVindas
};
