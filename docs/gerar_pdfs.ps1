# Gera todos os PDFs da pasta de entrega da Etapa Regional.
# Uso: cd LUPA && powershell -ExecutionPolicy Bypass -File docs/gerar_pdfs.ps1
#
# Dois dos markdowns sao gerados antes, direto do codigo do site, para que o
# PDF nunca divirja do que esta no ar:
#   - DIARIO_DE_BORDO.md    <- pagina /evolucao
#   - REFERENCIAS_ABNT.md   <- pagina /pesquisa
# O COMO_LER_O_CODIGO.md e escrito a mao.
# Os fluxogramas tem pipeline propria (gerar_fluxogramas.py, via navegador).

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Atualizando os markdowns a partir do codigo do site..." -ForegroundColor Cyan
python docs/gerar_diario_bordo.py
python docs/gerar_referencias.py

Write-Host "Gerando o PDF dos fluxogramas..." -ForegroundColor Cyan
python docs/gerar_fluxogramas.py

foreach ($nome in @("DIARIO_DE_BORDO", "REFERENCIAS_ABNT", "COMO_LER_O_CODIGO", "ANEXO_II_CONTEUDO")) {
    Write-Host "Gerando $nome.pdf..." -ForegroundColor Cyan

    # xurl permite quebrar URLs longas em qualquer ponto; sem ele os links
    # das referencias estouram a margem direita da pagina
    pandoc "docs/$nome.md" -o "docs/$nome.tex" `
        --standalone --toc --toc-depth=1 `
        -V geometry:margin=2.2cm `
        -V documentclass=article `
        -V colorlinks=true `
        -V mainfont="Georgia" `
        -V lang=pt-BR `
        -V header-includes='\usepackage{xurl}'

    Push-Location docs
    # Duas passagens: a segunda resolve os links do sumario
    xelatex -interaction=nonstopmode "$nome.tex" | Out-Null
    xelatex -interaction=nonstopmode "$nome.tex" | Out-Null
    Get-ChildItem "$nome.*" | Where-Object { $_.Extension -in '.aux','.log','.toc','.out','.tex' } | Remove-Item
    Pop-Location

    Write-Host "  OK: docs/$nome.pdf" -ForegroundColor Green
}

Write-Host ""
Get-ChildItem docs/DIARIO_DE_BORDO.pdf, docs/REFERENCIAS_ABNT.pdf, docs/COMO_LER_O_CODIGO.pdf, docs/FLUXOGRAMAS.pdf |
    Select-Object Name, @{N='Tamanho';E={"{0:N0} KB" -f ($_.Length/1KB)}} | Format-Table -AutoSize
