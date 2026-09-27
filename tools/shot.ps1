# Screenshot one page of the app and print console errors.
# Usage: powershell -File tools\shot.ps1 <chapterIndex> <stepIndex> [outDir]
# <chapter> may be an index or a chapter id (e.g. roots), optionally with a lesson: lesson-2:roots
param([string]$ci = '0', [int]$si = 0, [string]$out = "$env:TEMP\gp-shots")
New-Item -ItemType Directory -Force $out | Out-Null
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$root = (Resolve-Path "$PSScriptRoot\..").Path -replace '\\', '/'
$url = "file:///$root/index.html#go=$ci,$si"
$tag = $ci -replace '[:\\/]', '_'
$png = Join-Path $out "shot-$tag-$si.png"
$log = Join-Path $out "log-$tag-$si.txt"
$prof = Join-Path $env:TEMP ("gp-profile-" + [guid]::NewGuid().ToString('N'))
$args = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1366,800',
  "--user-data-dir=$prof", '--enable-logging=stderr', '--v=0', '--virtual-time-budget=4000',
  "--screenshot=$png", $url)
$p = Start-Process -FilePath $chrome -ArgumentList $args -RedirectStandardError $log -Wait -PassThru -WindowStyle Hidden
Select-String -Path $log -Pattern 'CONSOLE|Uncaught|Error' | Where-Object { $_.Line -notmatch 'fonts.g|net::ERR|gcm|GCM|DEPRECATED|dbus|Fontconfig|registration' } | ForEach-Object { $_.Line }
Remove-Item -Recurse -Force $prof -ErrorAction SilentlyContinue
Write-Output "Saved $png"
