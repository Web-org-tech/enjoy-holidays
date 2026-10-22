Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$originalDir = Join-Path $projectRoot "assets-original"
$logoOriginal = Join-Path $originalDir "logo.png"

if (-not (Test-Path $originalDir)) {
    New-Item -ItemType Directory -Force -Path $originalDir | Out-Null
}

if (-not (Test-Path $logoOriginal)) {
    Copy-Item (Join-Path $projectRoot "public/logo.png") $logoOriginal -Force
}

function Resize-Png {
    param(
        [string]$SrcPath,
        [string]$DstPath,
        [int]$W,
        [int]$H
    )
    $src = [System.Drawing.Image]::FromFile($SrcPath)
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $W, $H)
    $g.Dispose()
    $src.Dispose()
    $bmp.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

# 1. Favicon: 48x48
Resize-Png $logoOriginal (Join-Path $projectRoot "app/icon.png") 48 48

# 2. Apple Touch Icon: 180x180
Resize-Png $logoOriginal (Join-Path $projectRoot "app/apple-icon.png") 180 180

# 3. Web Logo: 512x512
Resize-Png $logoOriginal (Join-Path $projectRoot "public/logo.png") 512 512

# 4. Branded OG Image: 1200x630
function Generate-OgImage {
    param(
        [string]$LogoPath,
        [string]$DstPath
    )
    $W = 1200
    $H = 630
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Dark luxury emerald gradient background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
    $colorTop = [System.Drawing.Color]::FromArgb(255, 13, 43, 29)     # #0D2B1D
    $colorBottom = [System.Drawing.Color]::FromArgb(255, 6, 20, 14)    # #06140E
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorTop, $colorBottom, 45.0)
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    # Subtle inner border in gold
    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 212, 175, 55), 3)
    $g.DrawRectangle($goldPen, 28, 28, $W - 56, $H - 56)
    $goldPen.Dispose()

    # Draw Logo on left with circular clip
    $srcLogo = [System.Drawing.Image]::FromFile($LogoPath)
    $logoSize = 400
    $logoX = 70
    $logoY = [int](($H - $logoSize) / 2)

    $clipPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clipPath.AddEllipse($logoX, $logoY, $logoSize, $logoSize)
    $g.SetClip($clipPath)
    $g.DrawImage($srcLogo, $logoX, $logoY, $logoSize, $logoSize)
    $g.ResetClip()
    $clipPath.Dispose()
    $srcLogo.Dispose()

    # Gold rim around the logo
    $rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 230, 185, 78), 4)
    $g.DrawEllipse($rimPen, $logoX, $logoY, $logoSize, $logoSize)
    $rimPen.Dispose()

    # Right column text
    $textX = 510
    $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif

    # Eyebrow / Trust badge
    $badgeFont = New-Object System.Drawing.Font($fontFamily, 13, [System.Drawing.FontStyle]::Bold)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 185, 78))
    $g.DrawString("EST. 2004  *  MADURAI, TAMIL NADU  *  24/7 SERVICE", $badgeFont, $goldBrush, $textX, 125)
    $badgeFont.Dispose()

    # Brand Title
    $titleFont = New-Object System.Drawing.Font($fontFamily, 38, [System.Drawing.FontStyle]::Bold)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString("PADMA TOURS", $titleFont, $whiteBrush, $textX, 170)
    $g.DrawString("& TRAVELS", $titleFont, $goldBrush, $textX, 232)
    $titleFont.Dispose()

    # Subtitle / description
    $subFont = New-Object System.Drawing.Font($fontFamily, 16, [System.Drawing.FontStyle]::Regular)
    $creamBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 220, 230, 222))
    $g.DrawString("Daily Tours  *  Sightseeing  *  Car Rentals  *  Holiday Packages", $subFont, $creamBrush, $textX, 320)
    $g.DrawString("Handcrafted South India circuits across Tamil Nadu, Kerala & Pan-India.", $subFont, $creamBrush, $textX, 360)
    $subFont.Dispose()

    # Pill / highlights bar
    $pillFont = New-Object System.Drawing.Font($fontFamily, 14, [System.Drawing.FontStyle]::Bold)
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))
    $g.DrawString("Book Online & WhatsApp 24/7  *  www.padmacabs.in", $pillFont, $accentBrush, $textX, 445)
    $pillFont.Dispose()

    $goldBrush.Dispose()
    $whiteBrush.Dispose()
    $creamBrush.Dispose()
    $accentBrush.Dispose()
    $g.Dispose()

    $bmp.Save($DstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Generate-OgImage $logoOriginal (Join-Path $projectRoot "public/og-image.png")

Write-Output "Assets optimized and generated successfully:"
Get-Item (Join-Path $projectRoot "app/icon.png"), (Join-Path $projectRoot "app/apple-icon.png"), (Join-Path $projectRoot "public/logo.png"), (Join-Path $projectRoot "public/og-image.png") | Select-Object Name, Length
