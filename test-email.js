const { Resend } = require('resend');

const resend = new Resend('re_eBHz9hXZ_3STfk2bQroip7J3Q6WDkfhhq');

async function testarEmail() {
  try {
    console.log('📧 Enviando email de teste...');
    
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'aricontato1@gmail.com',
      subject: '🎉 Teste de Email - Sistema de Reservas',
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
              <h2>Email de Teste! 🎉</h2>
              <p>Este é um email de teste do seu sistema de reservas hoteleiras.</p>
              <p>Se você está vendo isso, significa que a integração com Resend está funcionando perfeitamente!</p>
              
              <center>
                <a href="http://localhost:5173" class="button">
                  🚀 Acessar Sistema
                </a>
              </center>

              <p>Próximos passos:</p>
              <ul>
                <li>✅ Criar nova conta</li>
                <li>✅ Verificar email</li>
                <li>✅ Fazer login</li>
                <li>✅ Acessar dashboard</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2026 Sistema de Reservas - Todos os direitos reservados</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Email enviado com sucesso!');
    console.log('📊 Dados:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

testarEmail();
