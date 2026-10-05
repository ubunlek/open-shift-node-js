const express = require("express");
const QRCode = require("qrcode");
const morgan = require("morgan");

const appVersion = process.env.API_VERSION || "unknown";
const port = process.env.PORT || 8080;


const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.get("/", async (req, res) => {
    res.send(`Welcome to the QR API on Open Shift! Version: ${appVersion}`);
});

app.post("/qr", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        const qrCode = await QRCode.toDataURL(url);

        res.json({
            message: "QR Code generated successfully",
            qr_code: qrCode,
            url: url
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to generate QR code"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});