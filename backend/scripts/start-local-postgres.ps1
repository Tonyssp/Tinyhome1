$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$dataDir = Join-Path $projectRoot ".local-postgres"
$logFile = Join-Path $projectRoot ".local-postgres.log"
$port = if ($env:LOCAL_POSTGRES_PORT) { $env:LOCAL_POSTGRES_PORT } else { "55432" }
$database = if ($env:LOCAL_POSTGRES_DB) { $env:LOCAL_POSTGRES_DB } else { "tiny_house_laos" }
$user = if ($env:LOCAL_POSTGRES_USER) { $env:LOCAL_POSTGRES_USER } else { "postgres" }
$pgBin = if ($env:PG_BIN) { $env:PG_BIN } else { "C:\Program Files\PostgreSQL\15\bin" }

$initdb = Join-Path $pgBin "initdb.exe"
$pgCtl = Join-Path $pgBin "pg_ctl.exe"
$psql = Join-Path $pgBin "psql.exe"
$createdb = Join-Path $pgBin "createdb.exe"

if (-not (Test-Path $pgCtl)) {
  throw "PostgreSQL tools were not found at '$pgBin'. Set PG_BIN to your PostgreSQL bin directory."
}

if (-not (Test-Path (Join-Path $dataDir "PG_VERSION"))) {
  & $initdb -D $dataDir -U $user -A trust -E UTF8
}

& $pgCtl -D $dataDir -l $logFile -o "-p $port" start

$exists = & $psql -h localhost -p $port -U $user -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$database'"
if ($exists.Trim() -ne "1") {
  & $createdb -h localhost -p $port -U $user $database
}

Write-Host "Local PostgreSQL is running on localhost:$port, database '$database'."
