const emailService = require("../../utils/emailService");
const sendMail = require("../../utils/emailService");


exports.signupMail = async (first_name, last_name, email) => {
    try{
        const subject = "Welcome to StoxHero - Learn, Trade, and Earn!";
        const message = `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Account Created</title>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                    }
    
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                    }
    
                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
    
                    p {
                        margin: 0 0 20px;
                    }
    
                    .userid {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
    
                    .password {
                        display: inline-block;
                        background-color: #f5f5f5;
                        padding: 10px;
                        font-size: 15px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-right: 10px;
                    }
    
                    .login-button {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        padding: 10px 20px;
                        font-size: 18px;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                    }
    
                    .login-button:hover {
                        background-color: #0069d9;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <h1>Account Created</h1>
                    <p>Dear ${first_name} ${last_name},</p>
                    <p>Welcome to the StoxHero family!</p>
                    
                    <p>Discover Stock Market success with our Paper Trading &amp; Learning App. Experience real market data, actionable insights, and a clutter-free interface on both our mobile app and web platform.</p>
                    
                    <p>What StoxHero offers:</p>
                    
                    <ol>
                        <li><strong>Learning Content:</strong> Enhance your market understanding.</li>
                        <li><strong>Real Data Trading:</strong> Practice with virtual currency and real-world data.</li>
                        <li><strong>Actionable Insights:</strong> Understand your trading style with valuable analytics.</li>
                        <li><strong>User-Friendly Interface:</strong> Navigate seamlessly for an optimal trading experience.</li>
                        <li><strong>Rewards for Success:</strong> Earn rewards for your winning trades.</li>
                    </ol>
                    
                    <p>StoxHero is your all-in-one package for Stock Market success.</p>
                    
                    <p>In case you face any issues, feel free to whatsApp support at 9354010914<a href="tel:+919830994402" rel="noreferrer" target="_blank">&nbsp;</a>or drop in an email at <a href="mailto:team@stoxhero.com">team@stoxhero.com</a></p>
                    
                    <p>To get started, visit our youtube channel to learn more about the App and StoxHero: <a href="https://www.youtube.com/channel/UCgslF4zuDhDyttD9P3ZOHbg">Visit</a></p>
                    
                    <p>Happy Trading!</p>
                    
                    <p>Best,&nbsp;</p>
                    
                    <p>StoxHero Team</p>
                    
                    <p>&nbsp;</p>
                    
                    <hr />
                    <h4 style="text-align:center"><strong>DOWNLOAD OUR APP FOR BETTER EXPERIENCE</strong></h4>
                    
                    <p>&nbsp;</p>
                    
                    <p style="text-align:center">
                    <a href="https://play.google.com/store/apps/details?id=com.stoxhero.app">
                    <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463874playStore.png" style="height:100px; width:250px" />
                    </a>&nbsp;&nbsp;
                    <a href="http://www.stoxhero.com">
                    <img alt="" src="https://dmt-trade.s3.ap-south-1.amazonaws.com/blogs/VC%20Funding/photos/1703332463880logoWeb.png" style="height:100px; width:250px" />
                    </a>
                    </p>
                    
                    <p>&nbsp;</p>
                  </body>
                </html>
    
            `;
    
        await emailService(email, subject, message);
    } catch(err){
        console.log(err);
    }
};

exports.resendOTPMail = async (first_name, last_name, email, email_otp) => {
    let subject = "OTP from StoxHero";
    let message = `
      <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <title>Email OTP</title>
              <style>
              body {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
                  margin: 0;
                  padding: 0;
              }
  
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
              }
  
              h1 {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
  
              p {
                  margin: 0 0 20px;
              }
  
              .otp-code {
                  display: inline-block;
                  background-color: #f5f5f5;
                  padding: 10px;
                  font-size: 20px;
                  font-weight: bold;
                  border-radius: 5px;
                  margin-right: 10px;
              }
  
              .cta-button {
                  display: inline-block;
                  background-color: #007bff;
                  color: #fff;
                  padding: 10px 20px;
                  font-size: 18px;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 5px;
              }
  
              .cta-button:hover {
                  background-color: #0069d9;
              }
              </style>
          </head>
          <body>
              <div class="container">
              <h1>Email OTP</h1>
              <p>Hello ${first_name},</p>
              <p>Your OTP code is: <span class="otp-code">${email_otp}</span></p>
              <p>Please use this code to verify your email address and complete your registration.</p>
              <p>If you did not request this OTP, please ignore this email.</p>
              </div>
          </body>
          </html>
      `;

    emailService(email, subject, message);
}

exports.kycVarification = async (first_name, email) => {
    await sendMail(
        email,
        "KYC Verification Request Received",
        `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <title>KYC Request Received</title>
              <style>
              body {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
                  margin: 0;
                  padding: 0;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
              }
      
              h1 {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
      
              p {
                  margin: 0 0 20px;
              }
      
              .userid {
                  display: inline-block;
                  background-color: #f5f5f5;
                  padding: 10px;
                  font-size: 15px;
                  font-weight: bold;
                  border-radius: 5px;
                  margin-right: 10px;
              }
      
              .password {
                  display: inline-block;
                  background-color: #f5f5f5;
                  padding: 10px;
                  font-size: 15px;
                  font-weight: bold;
                  border-radius: 5px;
                  margin-right: 10px;
              }
      
              .login-button {
                  display: inline-block;
                  background-color: #007bff;
                  color: #fff;
                  padding: 10px 20px;
                  font-size: 18px;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 5px;
              }
      
              .login-button:hover {
                  background-color: #0069d9;
              }
              </style>
          </head>
          <body>
              <div class="container">
              <h1>KYC Verification Request Received</h1>
              <p>Hello ${first_name},</p>
              <p>Your request for KYC verification is received by stoxhero team.</p>
              <p>We will be verifying your documents and information in the next 24-48 working hours. The final KYC Status will be intimated to you via mail and it will also be reflected in your profile section.</p>
              <p>In case of any discrepencies, raise a ticket or reply to this message.</p>
              <a href="https://stoxhero.com/contact" class="login-button">Write to Us Here</a>
              <br/><br/>
              <p>Thanks,</p>
              <p>StoxHero Team</p>
      
              </div>
          </body>
          </html>
      
      `
      );
}