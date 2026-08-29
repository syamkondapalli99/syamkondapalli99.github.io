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
// VERIFY CERTIFICATE USING BACKEND API
// =========================================

async function verifyCertificate(id) {

    try {

        const response = await fetch(
            `/api/certificate/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        // Hide loading
        loading.classList.add("hidden");

        // Show result
        result.classList.remove("hidden");


        // Certificate not found
        if (!response.ok || !data.verified) {

            if (data.revoked) {

                showRevoked();

            } else {

                showInvalid(
                    data.message ||
                    "This certificate ID could not be verified."
                );

            }

            return;
        }


        // Certificate is valid
        showValid(data.certificate);

    }

    catch (error) {

        console.error("Verification error:", error);

        loading.classList.add("hidden");
        result.classList.remove("hidden");

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

            <div class="detail">

                <span>Participant</span>

                <strong>
                    ${escapeHTML(certificate.name)}
                </strong>

            </div>


            <div class="detail">

                <span>Program</span>

                <strong>
                    ${escapeHTML(certificate.event)}
                </strong>

            </div>


            <div class="detail">

                <span>Certificate ID</span>

                <strong>
                    ${escapeHTML(certificate.certificateId)}
                </strong>

            </div>


            <div class="detail">

                <span>Date</span>

                <strong>
                    ${escapeHTML(certificate.date)}
                </strong>

            </div>


            <div class="status">

                <span>STATUS</span>

                <strong>VALID</strong>

            </div>

        </div>


        <p class="footer-text">
            This certificate was issued by JKS Soft Tech.
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

        <h1>Certificate Not Found</h1>

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

        <h1>Certificate Revoked</h1>

        <p class="subtitle">
            This certificate is no longer valid.
        </p>

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