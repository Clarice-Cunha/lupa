# Gera DIARIO_DE_BORDO.pdf e COMO_LER_O_CODIGO.pdf a partir dos arquivos .md
# Uso: cd LUPA && powershell -ExecutionPolicy Bypass -File docs/gerar_diario.ps1
#
# O DIARIO_DE_BORDO.md e gerado antes por docs/gerar_diario_bordo.py, que le os
# marcos direto da pagina /evolucao do site.

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Atualizando o markdown a partir da pagina /evolucao..." -ForegroundColor Cyan
python docs/gerar_diario_bordo.py

foreach ($nome in @("DIARIO_DE_BORDO", "COMO_LER_O_CODIGO")) {
    Write-Host "Gerando $nome.pdf..." -ForegroundColor Cyan

    pandoc "docs/$nome.md" -o "docs/$nome.tex" `
        --standalone --toc --toc-depth=1 `
        -V geometry:margin=2.2cm `
        -V documentclass=article `
        -V colorlinks=true `
        -V mainfont="Georgia" `
        -V lang=pt-BR

    Push-Location docs
    # Duas passagens: a segunda resolve os links do sumario
    xelatex -interaction=nonstopmode "$nome.tex" | Out-Null
    xelatex -interaction=nonstopmode "$nome.tex" | Out-Null
    Get-ChildItem "$nome.*" | Where-Object { $_.Extension -in '.aux','.log','.toc','.out','.tex' } | Remove-Item
    Pop-Location

    Write-Host "  OK: docs/$nome.pdf" -ForegroundColor Green
}

Write-Host ""
Get-ChildItem docs/DIARIO_DE_BORDO.pdf, docs/COMO_LER_O_CODIGO.pdf |
    Select-Object Name, @{N='Tamanho';E={"{0:N0} KB" -f ($_.Length/1KB)}} | Format-Table -AutoSize
