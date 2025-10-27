# 07_export_pipeline.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "=== SweetBox :: Phase 6/11 Export Pipeline ===`n"

$RootPath      = "C:\Users\chiom\AIProjects\Sweetbox_app"
$AppPath       = Join-Path $RootPath "sweetbox"
$ExportDir     = Join-Path $AppPath "export"

if (!(Test-Path $ExportDir)) {
    New-Item -ItemType Directory -Force -Path $ExportDir | Out-Null
    Write-Host "Created export directory: $ExportDir"
} else {
    Write-Host "Export directory exists: $ExportDir"
}

$ProjectId = "sweetbox_001"
$CompileUrl = "http://localhost:3000/api/compile?project_id=$ProjectId"
Write-Host "Requesting compile output from $CompileUrl ..."

$response = Invoke-WebRequest -Uri $CompileUrl -Headers @{Accept="application/json"}
$json = $response.Content | ConvertFrom-Json

# Validate expected fields
if (-not $json.ai_builder_prompt)   { throw "Missing ai_builder_prompt in compile output." }
if (-not $json.developer_spec)      { throw "Missing developer_spec in compile output." }
if (-not $json.machine_registry)    { throw "Missing machine_registry in compile output." }
if (-not $json.db_sql_schema)       { throw "Missing db_sql_schema in compile output." }

# Paths
$PromptPath   = Join-Path $ExportDir "${ProjectId}_ai_prompt.txt"
$SpecPath     = Join-Path $ExportDir "${ProjectId}_dev_spec.json"
$RegistryPath = Join-Path $ExportDir "${ProjectId}_machine_registry.json"
$SchemaPath   = Join-Path $ExportDir "${ProjectId}_db_schema.sql"

# Write files (UTF-8 no BOM)
[System.IO.File]::WriteAllText($PromptPath,   $json.ai_builder_prompt,   [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($SpecPath,     ($json.developer_spec | ConvertTo-Json -Depth 20), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($RegistryPath, ($json.machine_registry | ConvertTo-Json -Depth 20), [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($SchemaPath,   $json.db_sql_schema, [System.Text.Encoding]::UTF8)

Write-Host "Wrote $PromptPath"
Write-Host "Wrote $SpecPath"
Write-Host "Wrote $RegistryPath"
Write-Host "Wrote $SchemaPath"
Write-Host ""

# Git auto-commit (best effort)
$RepoRoot = $RootPath
if (Test-Path (Join-Path $RepoRoot ".git")) {
    Write-Host "Staging export files in git..."
    Push-Location $RepoRoot
    git add "sweetbox/export/${ProjectId}_ai_prompt.txt"
    git add "sweetbox/export/${ProjectId}_dev_spec.json"
    git add "sweetbox/export/${ProjectId}_machine_registry.json"
    git add "sweetbox/export/${ProjectId}_db_schema.sql"
    git commit -m "Export SweetBox spec + prompt + registry + DB schema"
    Pop-Location
} else {
    Write-Host "WARNING: No git repo at $RepoRoot. Skipping commit."
}

Write-Host "Phase 11 export complete."
