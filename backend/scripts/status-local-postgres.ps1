$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$dataDir = Join-Path $projectRoot ".local-postgres"
$pgBin = if ($env:PG_BIN) { $env:PG_BIN } else { "C:\Program Files\PostgreSQL\15\bin" }
$pgCtl = Join-Path $pgBin "pg_ctl.exe"

if (-not (Test-Path $pgCtl)) {
  throw "PostgreSQL tools were not found at '$pgBin'. Set PG_BIN to your PostgreSQL bin directory."
}

& $pgCtl -D $dataDir status
