const sendOtpEmail = async ({ to, otp, gymName }) => {
  if (process.env.SIMULATE_EMAIL !== "false") {
    console.log(`[SIMULATED EMAIL] To: ${to}`);
    console.log(`[SIMULATED EMAIL] ${gymName} password reset OTP: ${otp}`);
    return { simulated: true, otp };
  }

  // Swap this block with a Nodemailer transporter in production.
  // The controller already awaits this helper, so no route changes are needed.
  throw new Error("Real email transport is not configured");
};

export default sendOtpEmail;
