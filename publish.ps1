function Get-ScriptDirectory { Split-Path $MyInvocation.ScriptName }
function Get-OuputColour($v) { if ($v) { return "Blue" } else { return "Green" } }


Write-Host "";
$user_input = Read-Host -Prompt "Do you want to release Fuyuki after publishing?"
Write-Host "";

$release = $false;
$src = Join-Path (Get-ScriptDirectory) "\bin\Release\netcoreapp3.1\publish\*";
$dst = "C:\inetpub\wwwroot\fuyuki";

if (@("true", "false", "yes", "no", "y", "n") -contains $user_input) {
    $release = @("true", "yes", "y") -contains $user_input
}
else {
    Write-Host "Invalid release input. Enter yes or no. (y or n)" -ForegroundColor "Red";
    Read-Host -Prompt "Press Enter to exit";
    exit
}

# Start actual work...

dotnet publish --configuration Release;

Write-Host "";
Write-Host "Fuyuki published." -ForegroundColor (Get-OuputColour $release);
Write-Host "";

if ($release) {
    Write-Host "Copying release to target" -ForegroundColor "Blue";

    Copy-Item -Path $src -Destination $dst -Exclude "*.db" -Recurse -Container -Force
    
    Write-Host "";
    Write-Host "Fuyuki released." -ForegroundColor "Green";
    Write-Host "";
}

Read-Host -Prompt "Press Enter to exit";