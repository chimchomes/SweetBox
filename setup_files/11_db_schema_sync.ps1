# 11_db_schema_sync.ps1
# Helper: just regenerate DB schema file (without touching prompt/spec)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "=== SweetBox :: Phase 11 DB Schema Sync ===`n"

$RootPath      = "C:\Users\chiom\AIProjects\Sweetbox_app"
$AppPath       = Join-Path $RootPath "sweetbox"
$ExportDir     = Join-Path $AppPath "export"

if (!(Test-Path $ExportDir)) {
    New-Item -ItemType Directory -Force -Path $ExportDir | Out-Null
    Write-Host "Created export directory: $ExportDir"
}

$ProjectId = "sweetbox_001"
$CompileUrl = "http://localhost:3000/api/compile?project_id=$ProjectId"

Write-Host "Requesting compile output from $CompileUrl ..."
$response = Invoke-WebRequest -Uri $CompileUrl -Headers @{Accept="application/json"}
$json = $response.Content | ConvertFrom-Json

if (-not $json.db_sql_schema) {
    throw "Missing db_sql_schema in compile output."
}

$SchemaPath   = Join-Path $ExportDir "${ProjectId}_db_schema.sql"
[System.IO.File]::WriteAllText($SchemaPath, $json.db_sql_schema, [System.Text.Encoding]::UTF8)

Write-Host "Wrote $SchemaPath"
Write-Host "Done."
