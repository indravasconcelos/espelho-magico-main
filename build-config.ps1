# build-config.ps1 — Gera js/config.js a partir do .env
# Uso: .\build-config.ps1

$envFile = Join-Path $PSScriptRoot ".env"
$outFile = Join-Path $PSScriptRoot "js\config.js"

if (!(Test-Path $envFile)) {
    Write-Host "Arquivo .env nao encontrado. Copie .env.example para .env e preencha os valores." -ForegroundColor Red
    exit 1
}

$vars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^\s*#' -or $line -eq '') { return }
    $key, $value = $line -split '=', 2
    $vars[$key.Trim()] = $value.Trim()
}

$whatsapp = if ($vars['WHATSAPP']) { $vars['WHATSAPP'] } else { '5569992450529' }
$frete = if ($vars['FRETE']) { $vars['FRETE'] } else { '8' }
$adminHash = if ($vars['ADMIN_HASH']) { $vars['ADMIN_HASH'] } else { '' }
$maxTentativas = if ($vars['ADMIN_MAX_TENTATIVAS']) { $vars['ADMIN_MAX_TENTATIVAS'] } else { '5' }
$blocoMs = if ($vars['ADMIN_BLOCO_MS']) { $vars['ADMIN_BLOCO_MS'] } else { '30000' }

$config = @"
/* ====== CONFIG — Gerado automaticamente por build-config.ps1 ====== */
/* NAO EDITE ARQUIVO. Altere valores no .env e rode: .\build-config.ps1 */
const CONFIG = {
  WHATSAPP: '$whatsapp',
  FRETE: $frete,
  ADMIN_MAX_TENTATIVAS: $maxTentativas,
  ADMIN_BLOCO_MS: $blocoMs,
  ADMIN_HASH: '$adminHash'
};
"@

Set-Content -Path $outFile -Value $config -Encoding UTF8
Write-Host "js/config.js gerado com sucesso!" -ForegroundColor Green
