$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:8765/"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

function Send-Text {
  param(
    [System.Net.HttpListenerResponse] $Response,
    [int] $StatusCode,
    [string] $Text,
    [string] $ContentType = "text/plain; charset=utf-8"
  )

  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
  $Response.StatusCode = $StatusCode
  $Response.ContentType = $ContentType
  $Response.ContentLength64 = $bytes.Length
  $Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $Response.OutputStream.Close()
}

function Get-MimeType {
  param([string] $Path)

  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "text/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".webp" { "image/webp" }
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    default { "application/octet-stream" }
  }
}

try {
  $listener.Start()
  Start-Process $prefix
  Write-Host "TierLands is running at $prefix"
  Write-Host "Admin: ${prefix}adminsecretplacenoneknow/"
  Write-Host "Press Ctrl+C to stop."

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    try {
      if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/api/save") {
        $reader = [System.IO.StreamReader]::new($request.InputStream, [System.Text.Encoding]::UTF8)
        $content = $reader.ReadToEnd()
        $reader.Close()

        if ([string]::IsNullOrWhiteSpace($content) -or $content -notmatch "window\.TIERLANDS_PLAYERS") {
          Send-Text $response 400 "Invalid leaderboard data."
          continue
        }

        $target = Join-Path $root "players-data.js"
        [System.IO.File]::WriteAllText($target, $content, $utf8NoBom)
        Send-Text $response 200 "{""ok"":true}" "application/json; charset=utf-8"
        continue
      }

      if ($request.HttpMethod -ne "GET") {
        Send-Text $response 405 "Method not allowed."
        continue
      }

      $relativePath = [Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart("/"))
      if ([string]::IsNullOrWhiteSpace($relativePath)) {
        $relativePath = "index.html"
      }

      $fullPath = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
      $rootPath = [System.IO.Path]::GetFullPath($root)

      if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        Send-Text $response 403 "Forbidden."
        continue
      }

      if ([System.IO.Directory]::Exists($fullPath)) {
        $fullPath = Join-Path $fullPath "index.html"
      }

      if (-not [System.IO.File]::Exists($fullPath)) {
        Send-Text $response 404 "Not found."
        continue
      }

      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $response.StatusCode = 200
      $response.ContentType = Get-MimeType $fullPath
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.OutputStream.Close()
    } catch {
      Send-Text $response 500 $_.Exception.Message
    }
  }
} finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
