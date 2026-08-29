// =========================================
// GET CERTIFICATE ID FROM URL
// =========================================

const params = new URLSearchParams(window.location.search);
const certificateId = params.get("id");

const loading = document.getElementById("loading");
const result = document.getElementById("result");


// =========================================
// START VERIFICATION
// =========================================

if (!certificateId) {

    showInvalid("No certificate ID was provided.");

} else {

    verifyCertificate(certificateId);

}


// =========================================
// VERIFY CERTIFICATE
// =========================================

async function verifyCertificate(id) {

    try {

        // Load certificate database
        const response = await fetch("certificates.json");

        if (!response.ok) {

            throw new Error(
                "Unable to load certificate data."
            );

        }


        const certificates = await response.json();


        // Find certificate by ID
        const certificate = certificates.find(

            cert =>

                cert.certificateId &&
                cert.certificateId.toLowerCase() ===
                id.trim().toLowerCase()

        );


        // Hide loading
        if (loading) {

            loading.classList.add("hidden");

        }


        // Show result
        if (result) {

            result.classList.remove("hidden");

        }


        // =========================================
        // CERTIFICATE NOT FOUND
        // =========================================

        if (!certificate) {

            showInvalid(
                "This certificate ID could not be verified."
            );

            return;

        }


        // =========================================
        // CERTIFICATE REVOKED
        // =========================================

        if (

            certificate.status &&
            certificate.status.toLowerCase() === "revoked"

        ) {

            showRevoked();

            return;

        }


        // =========================================
        // CERTIFICATE VALID
        // =========================================

        showValid(certificate);

    }


    catch (error) {

        console.error(
            "Certificate verification error:",
            error
        );


        // Hide loading
        if (loading) {

            loading.classList.add("hidden");

        }


        // Show result
        if (result) {

            result.classList.remove("hidden");

        }


        showInvalid(
            "Unable to verify the certificate at this time."
        );

    }

}


// =========================================
// SHOW VALID CERTIFICATE
// =========================================

function showValid(certificate) {

    result.innerHTML = `

        <div class="icon valid">
            ✓
        </div>


        <h1>Certificate Verified</h1>


        <p class="subtitle">

            This certificate is registered with
            JKS Soft Tech.

        </p>


        <div class="certificate-details">


            <!-- PARTICIPANT -->

            <div class="detail">

                <span>
                    Participant
                </span>

                <strong>
                    ${escapeHTML(certificate.name)}
                </strong>

            </div>


            <!-- PROGRAM -->

            <div class="detail">

                <span>
                    Program
                </span>

                <strong>
                    ${escapeHTML(certificate.event)}
                </strong>

            </div>


            <!-- CERTIFICATE ID -->

            <div class="detail">

                <span>
                    Certificate ID
                </span>

                <strong>
                    ${escapeHTML(
                        certificate.certificateId
                    )}
                </strong>

            </div>


            <!-- DATE -->

            <div class="detail">

                <span>
                    Date
                </span>

                <strong>
                    ${escapeHTML(certificate.date)}
                </strong>

            </div>


            <!-- STATUS -->

            <div class="status">

                <span>
                    STATUS
                </span>

                <strong>
                    VALID
                </strong>

            </div>


        </div>


        <p class="footer-text">

            This certificate was issued by
            JKS Soft Tech.

        </p>

    `;

}


// =========================================
// SHOW INVALID CERTIFICATE
// =========================================

function showInvalid(message) {

    result.innerHTML = `

        <div class="icon invalid">
            ✕
        </div>


        <h1>
            Certificate Not Found
        </h1>


        <p class="subtitle">

            ${escapeHTML(message)}

        </p>


        <div class="invalid-box">

            <strong>
                Certificate could not be verified
            </strong>


            <p>

                Please check the Certificate ID
                and try again.

            </p>

        </div>

    `;

}


// =========================================
// SHOW REVOKED CERTIFICATE
// =========================================

function showRevoked() {

    result.innerHTML = `

        <div class="icon invalid">
            !
        </div>


        <h1>
            Certificate Revoked
        </h1>


        <p class="subtitle">

            This certificate is no longer valid.

        </p>


        <div class="invalid-box">

            <strong>
                Certificate is no longer valid
            </strong>


            <p>

                Please contact JKS Soft Tech
                if you believe this is an error.

            </p>

        </div>

    `;

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}