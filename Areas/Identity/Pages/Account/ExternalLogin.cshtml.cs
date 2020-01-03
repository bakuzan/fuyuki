using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Fuyuki.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication;

namespace Fuyuki.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ExternalLoginModel : PageModel
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger<ExternalLoginModel> _logger;

        public ExternalLoginModel(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            ILogger<ExternalLoginModel> logger,
            IEmailSender emailSender)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _logger = logger;
            _emailSender = emailSender;
        }

        public string LoginProvider { get; set; }

        public string ReturnUrl { get; set; }

        [TempData]
        public string ErrorMessage { get; set; }
        [TempData]
        public string StatusMessage { get; set; }

        public IActionResult OnGetAsync()
        {
            return RedirectToPage("./Login");
        }

        public IActionResult OnPost(string provider, string returnUrl = null)
        {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.Page("./ExternalLogin", pageHandler: "Callback", values: new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return new ChallengeResult(provider, properties);
        }

        public async Task<IActionResult> OnGetCallbackAsync(string returnUrl = null, string remoteError = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            if (remoteError != null)
            {
                ErrorMessage = $"Error from external provider: {remoteError}";
                return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
            }

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                ErrorMessage = "Error loading external login information.";
                return RedirectToPage("./Login", new { ReturnUrl = returnUrl });
            }

            // Sign in the user with this external login provider if the user already has a login.
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider,
                                                                       info.ProviderKey,
                                                                       isPersistent: true,
                                                                       bypassTwoFactor: true);

            if (result.Succeeded)
            {
                await _signInManager.UpdateExternalAuthenticationTokensAsync(info);

                var externalUsername = info.Principal.Identity.Name;
                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", externalUsername, info.LoginProvider);

                return LocalRedirect(returnUrl);
            }

            if (result.IsLockedOut)
            {
                return RedirectToPage("./Lockout");
            }
            else
            {
                // If the user does not have an account, generate one...

                var guid = Guid.NewGuid().ToString();
                var email = $"{guid}@{guid}.fyk";
                var user = new ApplicationUser { UserName = email, Email = email };

                var userResult = await _userManager.CreateAsync(user);

                if (userResult.Succeeded)
                {
                    userResult = await _userManager.AddLoginAsync(user, info);

                    if (userResult.Succeeded)
                    {
                        _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);

                        var props = new AuthenticationProperties();
                        props.StoreTokens(info.AuthenticationTokens);
                        props.IsPersistent = true;

                        await _signInManager.SignInAsync(user, props);
                        await _signInManager.UpdateExternalAuthenticationTokensAsync(info);

                        var userId = await _userManager.GetUserIdAsync(user);
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var confirmResult = await _userManager.ConfirmEmailAsync(user, code);

                        StatusMessage = confirmResult.Succeeded ? "Thank you for using Fuyuki." : "Error allowing access to your account.";
                        return LocalRedirect(returnUrl);
                    }
                }

                foreach (var error in userResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }


                LoginProvider = info.LoginProvider;
                ReturnUrl = returnUrl;
                return Page();
            }
        }

    }
}
