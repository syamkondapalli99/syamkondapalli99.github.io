require("dotenv").config();
console.log(process.env.EMAIL_USER);

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();


// Middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Gmail / Google Workspace SMTP configuration
const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: process.env.SMTP_PORT,

    secure: false, // false for port 587 (TLS)

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASSWORD

    }

});


// Test SMTP connection
transporter.verify((error, success) => {

    if (error) {

        console.log("SMTP connection failed:");
        console.log(error);

    } else {

        console.log("SMTP server is ready");

    }

});

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running");
});


// Contact form API
app.post("/send-email", async (req, res) => {

    console.log("FORM DATA RECEIVED:");
    console.log(req.body);

    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {

        return res.status(400).json({

            success: false,

            message: "Please fill in all fields"

        });

    }


    try {


        await transporter.sendMail({


            // Email account sending the message
            from: process.env.EMAIL_USER,


            // Where you receive the enquiry
            to: "info@jkssofttech.com",


            subject: "New Website Contact Form Submission",


           html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>

body {
    margin: 0;
    padding: 0;
    background-color: #f3f6f9;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
}

.email-wrapper {
    width: 100%;
    padding: 40px 0;
}

.email-container {
    max-width: 620px;
    margin: auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}


/* Header */

.header {
    background: #003b5c;
    padding: 35px 40px;
    color: white;
}

.logo {
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 0.5px;
}

.header-title {
    margin-top: 20px;
    font-size: 22px;
}

.header-text {
    margin-top: 8px;
    font-size: 14px;
    opacity: 0.85;
}


/* Content */

.content {
    padding: 35px 40px;
}


.section-title {

    font-size: 15px;
    font-weight: bold;
    color: #003b5c;
    margin-bottom: 15px;

}


.info-card {

    background: #f8fafc;
    border-radius: 8px;
    padding: 18px;
    margin-bottom: 18px;

}


.label {

    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 8px;

}


.value {

    font-size: 15px;
    color: #111827;

}


/* Message */

.message-box {

    background: #f0fdfa;
    border-left: 4px solid #00a6a6;
    padding: 20px;
    border-radius: 8px;
    line-height: 1.6;

}


/* Footer */

.footer {

    background: #f8fafc;
    padding: 25px 40px;
    text-align: center;
    font-size: 12px;
    color: #64748b;

}


.footer strong {

    color: #003b5c;

}


</style>

</head>


<body>


<div class="email-wrapper">


<div class="email-container">


<!-- HEADER -->

<div class="header">

    <div class="logo">
        JKS Soft Tech
    </div>


    <div class="header-title">
        Client Enquiry Received
    </div>


    <div class="header-text">
        Website contact form submission
    </div>

</div>



<!-- CONTENT -->

<div class="content">


<div class="section-title">
    Contact Details
</div>



<div class="info-card">

    <div class="label">
        Full Name
    </div>

    <div class="value">
        ${name}
    </div>

</div>




<div class="info-card">

    <div class="label">
        Email Address
    </div>

    <div class="value">
        ${email}
    </div>

</div>



<div class="section-title">
    Enquiry Details
</div>



<div class="message-box">

    ${message}

</div>



<br>


<div style="font-size:13px;color:#64748b;">

    Submitted through:
    <strong>jkssofttech.com</strong>

</div>



</div>



<!-- FOOTER -->


<div class="footer">

    <strong>JKS Soft Tech Pte. Ltd.</strong><br>

    Consulting · Technology · Outsourcing

    <br><br>

    This email was automatically generated from the website contact form.

</div>



</div>


</div>


</body>
</html>
`
});

        res.json({

            success: true,

            message: "Message sent successfully!"

        });



    } catch (error) {


        console.log("Email sending error:");

        console.log(error);


        res.status(500).json({

            success: false,

            message: "Failed to send message"

        });


    }


});


// Start server
app.listen(3000, () => {

    console.log("Server running on port 3000");

});