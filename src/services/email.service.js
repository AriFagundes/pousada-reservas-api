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

const enviarEmailConfirmacaoReserva = async (reserva, cliente, quarto, hotel) => {
  const checkInFormatado = new Date(reserva.dataCheckIn).toLocaleDateString('pt-BR');
  const checkOutFormatado = new Date(reserva.dataCheckOut).toLocaleDateString('pt-BR');
  const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reserva.valorTotal);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: cliente.email,
      subject: `✅ Reserva Confirmada - ${hotel.nome}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f3f4f6;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
            .success-icon {
              font-size: 60px;
              text-align: center;
              margin-bottom: 20px;
            }
            .info-card {
              background: #f9fafb;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: #6b7280;
              font-weight: 600;
            }
            .info-value {
              color: #1f2937;
              font-weight: 700;
            }
            .total {
              background: #10b981;
              color: white;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              margin: 20px 0;
            }
            .total-value {
              font-size: 32px;
              font-weight: 700;
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
              <div class="success-icon">✅</div>
              <h1>Reserva Confirmada!</h1>
            </div>
            <div class="content">
              <h2 style="color: #1f2937;">Olá, ${cliente.nome}!</h2>
              <p style="color: #4b5563; font-size: 16px;">
                Sua reserva foi confirmada com sucesso! Confira os detalhes abaixo:
              </p>
              
              <div class="info-card">
                <h3 style="margin-top: 0; color: #1f2937;">📍 ${hotel.nome}</h3>
                <div class="info-row">
                  <span class="info-label">Quarto:</span>
                  <span class="info-value">${quarto.numero} - ${quarto.tipoQuarto.nome}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Check-in:</span>
                  <span class="info-value">${checkInFormatado}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Check-out:</span>
                  <span class="info-value">${checkOutFormatado}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Diárias:</span>
                  <span class="info-value">${reserva.dias} ${reserva.dias === 1 ? 'dia' : 'dias'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Hóspedes:</span>
                  <span class="info-value">${reserva.numeroPessoas} ${reserva.numeroPessoas === 1 ? 'pessoa' : 'pessoas'}</span>
                </div>
              </div>

              <div class="total">
                <div style="font-size: 14px; margin-bottom: 8px;">VALOR TOTAL</div>
                <div class="total-value">${valorFormatado}</div>
              </div>

              <p style="color: #4b5563;">
                <strong>Código da Reserva:</strong> ${reserva.id}
              </p>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Em caso de dúvidas, entre em contato conosco através do email ${hotel.email || 'contato'}.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 ${hotel.nome} - Todos os direitos reservados</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Email de confirmação enviado para cliente:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    return { success: false, error };
  }
};

const enviarEmailNotificacaoHotel = async (reserva, cliente, quarto, hotel) => {
  const checkInFormatado = new Date(reserva.dataCheckIn).toLocaleDateString('pt-BR');
  const checkOutFormatado = new Date(reserva.dataCheckOut).toLocaleDateString('pt-BR');
  const valorFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reserva.valorTotal);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: hotel.email || 'admin@hotel.com',
      subject: `🔔 Nova Reserva - Quarto ${quarto.numero}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f3f4f6;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
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
            .alert-icon {
              font-size: 60px;
              text-align: center;
              margin-bottom: 20px;
            }
            .info-card {
              background: #f9fafb;
              border-radius: 12px;
              padding: 20px;
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              color: #6b7280;
              font-weight: 600;
            }
            .info-value {
              color: #1f2937;
              font-weight: 700;
            }
            .button {
              display: inline-block;
              margin: 20px auto;
              padding: 16px 40px;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
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
              <div class="alert-icon">🔔</div>
              <h1>Nova Reserva Recebida</h1>
            </div>
            <div class="content">
              <h2 style="color: #1f2937;">Detalhes da Reserva</h2>
              
              <div class="info-card">
                <h3 style="margin-top: 0; color: #1f2937;">👤 Cliente</h3>
                <div class="info-row">
                  <span class="info-label">Nome:</span>
                  <span class="info-value">${cliente.nome}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${cliente.email}</span>
                </div>
                ${cliente.telefone ? `
                <div class="info-row">
                  <span class="info-label">Telefone:</span>
                  <span class="info-value">${cliente.telefone}</span>
                </div>
                ` : ''}
              </div>

              <div class="info-card">
                <h3 style="margin-top: 0; color: #1f2937;">🏨 Hospedagem</h3>
                <div class="info-row">
                  <span class="info-label">Quarto:</span>
                  <span class="info-value">${quarto.numero} - ${quarto.tipoQuarto.nome}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Check-in:</span>
                  <span class="info-value">${checkInFormatado}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Check-out:</span>
                  <span class="info-value">${checkOutFormatado}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Diárias:</span>
                  <span class="info-value">${reserva.dias} ${reserva.dias === 1 ? 'dia' : 'dias'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Hóspedes:</span>
                  <span class="info-value">${reserva.numeroPessoas} ${reserva.numeroPessoas === 1 ? 'pessoa' : 'pessoas'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Valor Total:</span>
                  <span class="info-value" style="color: #10b981; font-size: 20px;">${valorFormatado}</span>
                </div>
              </div>

              <center>
                <a href="${FRONTEND_URL}/dashboard" class="button">
                  Ver no Dashboard
                </a>
              </center>

              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                <strong>Código da Reserva:</strong> ${reserva.id}
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Sistema de Reservas</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Email de notificação enviado para hotel:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email para hotel:', error);
    return { success: false, error };
  }
};

module.exports = {
  enviarEmailVerificacao,
  enviarEmailBoasVindas,
  enviarEmailConfirmacaoReserva,
  enviarEmailNotificacaoHotel
};
