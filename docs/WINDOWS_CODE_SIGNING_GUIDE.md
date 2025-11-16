# Windows Code Signing Guide

## Overview
Code signing your Windows installer prevents SmartScreen warnings and builds user trust. This guide covers obtaining and using a code signing certificate.

## Option 1: Commercial Certificate Authority (Recommended for Distribution)

### Purchase Certificate
1. **Choose a CA:**
   - DigiCert (~$474/year)
   - Sectigo (~$179/year)
   - SSL.com (~$159/year)
   - GoDaddy (~$200/year)

2. **Verify Your Identity:**
   - Business: DUNS number, articles of incorporation
   - Individual: Government-issued ID, address verification

3. **Receive Certificate:**
   - Download as PFX/P12 format
   - Save password securely (needed for signing)

### Configure Signing

Add to `package.json` under `"build"`:

```json
"win": {
  "certificateFile": "./certs/your-certificate.pfx",
  "certificatePassword": "your-password-here",
  "signingHashAlgorithms": ["sha256"],
  "target": [
    {
      "target": "portable",
      "arch": ["x64"]
    },
    {
      "target": "nsis",
      "arch": ["x64"]
    }
  ]
}
```

**Security Best Practice:**
Store password in environment variable:

```json
"certificatePassword": "${env.WIN_CERT_PASSWORD}"
```

Then set before building:
```powershell
$env:WIN_CERT_PASSWORD = "your-password"
npm run electron:build
```

### Sign Existing Build

If you already have the installer built:

```powershell
# Install Windows SDK (includes signtool.exe)
# Download from: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/

# Sign the installer
& "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe" sign `
  /f "path\to\certificate.pfx" `
  /p "certificate-password" `
  /fd SHA256 `
  /tr http://timestamp.digicert.com `
  /td SHA256 `
  "dist-electron\FretPilot Setup 1.0.0.exe"
```

## Option 2: Self-Signed Certificate (Development/Testing Only)

⚠️ **Warning:** Self-signed certificates still trigger SmartScreen warnings. Use only for internal testing.

### Create Self-Signed Certificate

```powershell
# Create certificate
$cert = New-SelfSignedCertificate `
  -Type CodeSigningCert `
  -Subject "CN=FretPilot Studio" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -NotAfter (Get-Date).AddYears(3)

# Export as PFX
$password = ConvertTo-SecureString -String "YourPassword123!" -Force -AsPlainText
Export-PfxCertificate `
  -Cert $cert `
  -FilePath ".\fretpilot-cert.pfx" `
  -Password $password

# Install to Trusted Root (required for self-signed)
Import-PfxCertificate `
  -FilePath ".\fretpilot-cert.pfx" `
  -CertStoreLocation "Cert:\LocalMachine\Root" `
  -Password $password
```

### Sign with Self-Signed Certificate

```powershell
& "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe" sign `
  /f "fretpilot-cert.pfx" `
  /p "YourPassword123!" `
  /fd SHA256 `
  "dist-electron\FretPilot Setup 1.0.0.exe"
```

## Option 3: Azure Code Signing (Cloud-based HSM)

Microsoft's cloud solution using Azure Key Vault:

1. **Set Up Azure Key Vault:**
   ```powershell
   # Install Azure CLI
   winget install Microsoft.AzureCLI
   
   # Login
   az login
   
   # Create Key Vault
   az keyvault create --name fretpilot-kv --resource-group fretpilot-rg --location eastus
   
   # Import certificate
   az keyvault certificate import --vault-name fretpilot-kv --name fretpilot-cert --file certificate.pfx
   ```

2. **Install Azure Code Signing Tool:**
   ```powershell
   dotnet tool install --global AzureSignTool
   ```

3. **Sign Installer:**
   ```powershell
   AzureSignTool sign `
     --azure-key-vault-url https://fretpilot-kv.vault.azure.net/ `
     --azure-key-vault-certificate fretpilot-cert `
     --timestamp-rfc3161 http://timestamp.digicert.com `
     --timestamp-digest sha256 `
     "dist-electron\FretPilot Setup 1.0.0.exe"
   ```

## Verify Signature

After signing, verify the signature:

```powershell
# Check signature exists
signtool verify /pa "dist-electron\FretPilot Setup 1.0.0.exe"

# View signature details
Get-AuthenticodeSignature "dist-electron\FretPilot Setup 1.0.0.exe" | Format-List
```

## SmartScreen Reputation

Even with a valid certificate, new apps may show SmartScreen warnings until they build reputation:

- **Download threshold:** ~1,000-10,000 downloads
- **Time frame:** 2-4 weeks of consistent downloads
- **Submit to Microsoft:** Use [SmartScreen file reputation service](https://www.microsoft.com/en-us/wdsi/filesubmission)

## Automated Signing in CI/CD

For GitHub Actions (covered in separate CI/CD guide):

```yaml
- name: Sign Windows Installer
  env:
    CERTIFICATE: ${{ secrets.WIN_CERT_BASE64 }}
    CERTIFICATE_PASSWORD: ${{ secrets.WIN_CERT_PASSWORD }}
  run: |
    [System.Convert]::FromBase64String($env:CERTIFICATE) | Set-Content -Path cert.pfx -AsByteStream
    & "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe" sign /f cert.pfx /p $env:CERTIFICATE_PASSWORD /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 "dist-electron\FretPilot Setup 1.0.0.exe"
    Remove-Item cert.pfx
```

## Cost Comparison

| Provider | Type | Annual Cost | EV Available |
|----------|------|-------------|--------------|
| DigiCert | OV | $474 | Yes ($600+) |
| Sectigo | OV | $179 | Yes ($400+) |
| SSL.com | OV | $159 | Yes ($299+) |
| GoDaddy | OV | $200 | Yes ($500+) |
| Azure | Cloud HSM | Pay-per-use | N/A |

**EV (Extended Validation)** certificates build SmartScreen reputation faster but require USB token.

## Current Status

✅ Unsigned installer built: `dist-electron\FretPilot Setup 1.0.0.exe`
⚠️ Will show SmartScreen warning: "Windows protected your PC"

**Next Steps:**
1. Purchase certificate from preferred CA (recommend Sectigo for best value)
2. Complete business verification process (1-3 days)
3. Add certificate to project and rebuild with signing enabled
4. Optionally submit to Microsoft for faster reputation building

## Quick Start for Testing

If you need to distribute immediately without warnings to a small audience:

1. Use self-signed certificate (Option 2)
2. Instruct users to click "More info" → "Run anyway"
3. Or distribute via portable version (no installation, fewer warnings)

The portable version is already built: `dist-electron\FretPilot 1.0.0.exe`
