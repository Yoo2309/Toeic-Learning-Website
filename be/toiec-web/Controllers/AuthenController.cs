using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using toeic_web.Data;
using toeic_web.Models;
using toeic_web.Services.IService;
using toeic_web.ViewModels.Authentication;
using toeic_web.ViewModels.User;
using toiec_web.ViewModels.Authentication;
using static System.Net.WebRequestMethods;

namespace toeic_web.Controllers
{
    public class AuthenController : BaseAPIController
    {
        private readonly UserManager<Users> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<Users> _signManager;
        private readonly ToeicDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IStudentService _studentService;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUploadFileService _uploadFileService;
        private readonly IMapper _mapper;

        public AuthenController(UserManager<Users> userManager, RoleManager<IdentityRole> roleManager,
            SignInManager<Users> signManager, ToeicDbContext dbContext, IEmailService emailService,
             IConfiguration configuration, IStudentService studentService, IAuthenticationService authenticationService,
            IUploadFileService uploadFileService, IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signManager = signManager;
            _dbContext = dbContext;
            _configuration = configuration;
            _emailService = emailService;
            _studentService = studentService;
            _authenticationService = authenticationService;
            _uploadFileService = uploadFileService;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] SignUp signUp)
        {
            //default role = Student
            string role = "Student";

            //check user if exist
            var userExist = await _userManager.FindByEmailAsync(signUp.Email);

            if (userExist != null)
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Message = "User already exists!" });
            }

            //Add the User in the database
            var user = new Users()
            {
                Fullname = signUp.FullName,
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = signUp.Email,
                UserName = signUp.Username
            };

            //check role if exist
            if (await _roleManager.RoleExistsAsync(role))
            {
                //create user
                var result = await _userManager.CreateAsync(user, signUp.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = $"Error: {error.Description}" });
                    }
                }

                //check if user == null
                if (user == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound,
                        new Response { Status = "Error", Message = "User not found." });
                }

                //check if role == null
                if (string.IsNullOrEmpty(role))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = "Role is null or empty." });
                }

                //Add role to the user
                await _userManager.AddToRoleAsync(user, role);

                //Add Token to Verify the email...
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                //send email confirm
                //var domain = "toeic.workon.space";
                var confirmationLink = Url.Action(nameof(ConfirmEmail), "Authen", new { token, email = user.Email }, Request.Scheme);
                if (confirmationLink != null && confirmationLink.Contains("http://backend"))
                {
                    confirmationLink = confirmationLink.Replace("http://backend", "https://toeic.workon.space");
                }
                var message = new Message(new string[] { user.Email! }, "Confirmation email link", confirmationLink!);
                _emailService.SendEmail(message);

                //create Student into database
                await _studentService.AddStudent(user.Id);
                await _dbContext.SaveChangesAsync();

                //when success
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = $"We have sent EmailConfirm to {user.Email}. Verified your email to Login!" });
            }
            else
            {
                Console.WriteLine("error");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Error", Message = "This Role Does Not Exist." });
            }
        }

        [HttpGet]
        [Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var redirectUrlSuccess = "https://toeic.workon.space/login/success";
            var redirectUrlFailed = "https://toeic.workon.space/login/failed";
            if (user != null)
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (result.Succeeded)
                {
                    return Redirect(redirectUrlSuccess);
                }
            }
            return Redirect(redirectUrlFailed);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LogInModel loginModel)
        {
            //Checking the user
            var user = await _userManager.FindByNameAsync(loginModel.Username);
            //Checking email confirm
            if(user != null)
            {
                if (!user.EmailConfirmed)
                {
                    //ResendConfirmEmail(user.Email);
                    return StatusCode(StatusCodes.Status404NotFound,
                         new Response { Status = "Error", Message = $"We have sent EmailConfirm to {user.Email}. Verified your email to Login!" });
                }
            }
            //Checking the password
            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                //Claim list creation
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                //Add role to the list
                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                //Check 2FA
                if (user.TwoFactorEnabled)
                {
                    await _signManager.SignOutAsync();
                    await _signManager.PasswordSignInAsync(user, loginModel.Password, false, true);
                    var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");

                    var message = new Message(new string[] { user.Email! }, "OTP Confrimation", token);
                    _emailService.SendEmail(message);

                    return StatusCode(StatusCodes.Status200OK,
                     new Response { Status = "Success", Message = $"We have sent an OTP to your Email {user.Email}" });
                }
                //generate the token with claim
                var jwtToken = GetToken(authClaims);

                var student = new StudentModel();
                //get student
                if (userRoles.Contains("Student"))
                {
                    student = await _studentService.GetStudentByUserId(user.Id);
                }
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                    expiration = jwtToken.ValidTo,
                    user.EmailConfirmed,
                    student.freeTest,
                });
                //returning the token...
            }

            return Unauthorized();
        }

        [HttpPost]
        [Route("Login-2FA")]
        public async Task<IActionResult> LoginWithOTP(Login2FAModel model)
        {
            //get uset
            var user = await _userManager.FindByNameAsync(model.Username);
            //enable twofacter
            user.TwoFactorEnabled = true;
            var signIn = await _signManager.TwoFactorSignInAsync("Email", model.Code, false, false);
            if (signIn.Succeeded)
            {
                if (user != null)
                {
                    var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                    var userRoles = await _userManager.GetRolesAsync(user);
                    foreach (var role in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, role));
                    }

                    var jwtToken = GetToken(authClaims);

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                        expiration = jwtToken.ValidTo
                    });
                    //returning the token...
                }
            }
            return StatusCode(StatusCodes.Status404NotFound,
                new Response { Status = "Error", Message = $"Invalid Code" });
        }

        [HttpPost]
        [Route("LoginGoogleResponse")]
        public async Task<IActionResult> LoginGoogleResponse(LoginGoogleResponseModel model)
        {

            if (model == null)
                return BadRequest("Error loading external login information (info == null)");

            JwtSecurityToken jwtToken;
            Users user;
            string userId;
            var username = GetUsernameFromEmail(model.Email);

            //check user if exist
            var userExist = await _userManager.FindByEmailAsync(model.Email);
            if (userExist != null)
            {
                //confirmEmail
                userExist.EmailConfirmed = true;
                //Claim list creation
                var authClaims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, userExist.UserName),
                            new Claim(ClaimTypes.NameIdentifier, userExist.Id),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        };
                //Add role to the list
                var userRoles = await _userManager.GetRolesAsync(userExist);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                //generate the token with claim
                jwtToken = GetToken(authClaims);
                userId = userExist.Id;
            }
            else
            {
                //default role = Student
                string role = "Student";
                //Add the User in the database
                user = new Users()
                {
                    Fullname = model.Fullname,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    Email = model.Email,
                    UserName = username,
                };
                //create user
                var newUser = await _userManager.CreateAsync(user, "NewPass@123");
                if (newUser.Succeeded)
                {
                    //Add role to the user
                    await _userManager.AddToRoleAsync(user, role);
                    //confirmEmail
                    user.EmailConfirmed = true;
                    //Claim list creation
                    var authClaims = new List<Claim>
                                {
                                    new Claim(ClaimTypes.Name, user.UserName),
                                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                                    new Claim(ClaimTypes.Role, role),
                                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                                };
                    //generate the token with claim
                    jwtToken = GetToken(authClaims);
                    // Send password to the user's email
                    var message = new Message(new string[] { model.Email }, "Signup successfully", $"Your account: Username:{username}, Password: NewPass@123. Please change password to security your account!");
                    _emailService.SendEmail(message);
                    //create Student into database
                    await _studentService.AddStudent(user.Id);
                    userId = user.Id;
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    return BadRequest("Error loading external login information (newUser cannot create)");
                }
            }
            var student = await _studentService.GetStudentByUserId(userId);
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                expiration = jwtToken.ValidTo,
                emailConfirm = true,
                freetest = student.freeTest
            });

        }

        [HttpGet]
        [Route("ResendConfirmEmail")]
        public async Task<IActionResult> ResendConfirmEmail(string username)
        {
            //check user if exist
            var userExist = await _userManager.FindByNameAsync(username);

            if (userExist != null)
            {
                if (userExist.EmailConfirmed)
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Error", Message = "Your email already confirm!" });
                }
                //Add Token to Verify the email...
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(userExist);

                // send email confirm
                //var confirmationLink = Url.Action(nameof(ConfirmEmail), "Authen", new { token, email }, Request.Scheme);
                //if (confirmationLink != null && confirmationLink.Contains("http://backend"))
                //{
                //    confirmationLink = confirmationLink.Replace("http://backend", "https://toeic.workon.space");
                //}
                //var message = new Message(new string[] { email! }, "Confirmation email link", confirmationLink!);
                //_emailService.SendEmail(message);

                var confirmationLink = Url.Action(nameof(ConfirmEmail), "Authen", new { token, userExist.Email }, Request.Scheme);
                if (confirmationLink != null && confirmationLink.Contains("http://backend"))
                {
                    confirmationLink = confirmationLink.Replace("http://backend", "https://toeic.workon.space");
                }

                //Tạo nội dung email dưới dạng HTML
               var htmlContent = $@"
                <!DOCTYPE html>
                <html lang=""en"">
                <head>
                    <meta charset=""UTF-8"">
                    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                    <title>Xác nhận Email</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            padding: 20px;
                            margin: 0;
                        }}
                        .container {{
                            max-width: 600px;
                            margin: auto;
                            background: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }}
                        .button {{
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #aaaaaa;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 5px;
                        }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <h2>Xác nhận email của bạn</h2>
                        <p>Vui lòng xác nhận email của bạn bằng cách nhấn vào đường link dưới đây:</p>
                        <a class=""button"" href=""{confirmationLink}"">Xác nhận Email</a>
                        <p>Nếu bạn không thể nhấn vào liên kết trên, hãy sao chép và dán đường link sau vào trình duyệt của bạn:</p>
                        <p>{confirmationLink}</p>
                    </div>
                </body>
                </html>";

                var message = new Message(new string[] { userExist.Email! }, "Confirm Email", htmlContent);
                //Đảm bảo rằng bạn đã cấu hình EmailService để chấp nhận nội dung HTML
                _emailService.SendEmail(message);

                //when success
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = $"We have sent EmailConfirm to {userExist.Email}. Verified your email to Login!" });

            }
            return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Message = "User doesn't exist, please signup to get email confirm !" });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GoogleLogin")]
        public IActionResult GoogleLogin()
        {

            string redirectUrl = Url.Action(nameof(GoogleResponse), "Authen");
            var properties = _signManager.ConfigureExternalAuthenticationProperties("Google", redirectUrl);
            return new ChallengeResult("Google", properties);
        }


        [AllowAnonymous]
        [HttpGet]
        [Route("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            ExternalLoginInfo info = await _signManager.GetExternalLoginInfoAsync();
            if (info == null)
                return BadRequest("Error loading external login information (info == null)");

            string email = info.Principal.FindFirst(ClaimTypes.Email).Value;
            string username = GetUsernameFromEmail(email);
            string fullname = info.Principal.FindFirst(ClaimTypes.Name).Value;
            JwtSecurityToken jwtToken;

            //check user if exist
            var userExist = await _userManager.FindByEmailAsync(email);
            if (userExist != null)
            {
                //confirmEmail
                userExist.EmailConfirmed = true;
                //Claim list creation
                var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, userExist.UserName),
                        new Claim(ClaimTypes.NameIdentifier, userExist.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };
                //Add role to the list
                var userRoles = await _userManager.GetRolesAsync(userExist);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                //generate the token with claim
                jwtToken = GetToken(authClaims);
                await _userManager.AddLoginAsync(userExist, info);
            }
            else
            {
                //default role = Student
                string role = "Student";
                //Add the User in the database
                var user = new Users()
                {
                    Fullname = fullname,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    Email = email,
                    UserName = username
                };
                //create user
                var newUser = await _userManager.CreateAsync(user, "NewPass@123");
                if (newUser.Succeeded)
                {
                    //Add role to the user
                    await _userManager.AddToRoleAsync(user, role);
                    //confirmEmail
                    user.EmailConfirmed = true;
                    //Claim list creation
                    var authClaims = new List<Claim>
                            {
                                new Claim(ClaimTypes.Name, user.UserName),
                                new Claim(ClaimTypes.NameIdentifier, user.Id),
                                new Claim(ClaimTypes.Role, role),
                                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                            };
                    //generate the token with claim
                    jwtToken = GetToken(authClaims);
                    // Send password to the user's email
                    var message = new Message(new string[] { email }, "Signup successfully", $"Your account: Username:{username}, Password: NewPass@123.");
                    _emailService.SendEmail(message);
                    //create Student into database
                    await _studentService.AddStudent(user.Id);
                    //save userLogin
                    await _userManager.AddLoginAsync(user, info);
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    return BadRequest("Error loading external login information (newUser cannot create)");
                }
            }

            var result = await _signManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, true);
            var token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
            if (result.Succeeded)
            {
                string homePage = "https://toeic.workon.space/generate-token?token=";
                var returnUrl = homePage + token;
                return Redirect(returnUrl);
            }
            else
            {
                return BadRequest("Error loading external login information (result signin failed)");
            }
        }

        [HttpPost]
        [Route("SendForgotPasswordCode")]
        public async Task<IActionResult> SendForgotPasswordCode(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email should not be null or empty");
            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            int otp = GenerateOTP();

            var resetPassword = new ResetPassword
            {
                UserId = user.Id,
                OTP = otp.ToString(),
                InsertDateTimeUTC = DateTime.UtcNow
            };

            _dbContext.ResetPasswords.Add(resetPassword);
            await _dbContext.SaveChangesAsync();

            // Send the OTP to the user's email
            var message = new Message(new string[] { user.Email }, "Reset Password OTP", $"OTP: {otp}");
            _emailService.SendEmail(message);

            return Ok(new { Status = "Success", Message = "OTP sent successfully" });
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ResetPasswordModel model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.OTP) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest("Email, OTP, and New Password should not be null or empty");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var resetPasswordDetails = await _dbContext.ResetPasswords
                .Where(rp => rp.OTP == model.OTP && rp.UserId == user.Id)
                .OrderByDescending(rp => rp.InsertDateTimeUTC)
                .FirstOrDefaultAsync();

            if (resetPasswordDetails == null)
            {
                return BadRequest("Invalid OTP");
            }

            // Verify if OTP is expired (15 minutes in this example)
            if (resetPasswordDetails.InsertDateTimeUTC.AddMinutes(15) < DateTime.UtcNow)
            {
                return BadRequest("OTP is expired, please request a new one");
            }

            // Reset the user's password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest("Failed to reset the password");
            }

            // Delete the used OTP from the database
            //_dbContext.ResetPasswords.Remove(resetPasswordDetails);
            //await _dbContext.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = $"Password reset successfully! Your new password: {model.NewPassword}" });
        }

        [Authorize]
        [HttpGet]
        [Route("GetProfile")]
        public async Task<IActionResult> GetProfile(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            var userView = _mapper.Map<UserViewModel>(user);
            return Ok(userView);
        }

        [HttpGet]
        [Route("GetUserInfo")]
        public async Task<IActionResult> GetUserInfo(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Error", Message = "This User Does Not Exist" });
            }
            else
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Error", Message = "This User Does Not Exist" });
                }
                var userView = _mapper.Map<UserViewModel>(user);
                return Ok(new
                {
                    userView.fullname,
                    userView.imageURL
                });
            }

        }

        [Authorize]
        [HttpPut]
        [Route("Update-Profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileModel model)
        {
            // Get the current user
            var userName = HttpContext.User.Identity.Name;
            var userId = await _authenticationService.GetCurrentUserId(userName);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                // Handle the case when the user is not found
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Error", Message = "User does not exist" });
            }

            // Update user's profile properties with the provided values
            user.PhoneNumber = model.PhoneNumber;
            user.Fullname = model.FullName;
            user.DateOfBirth = model.DateOfBirth.ToString();
            user.Gender = model.Gender;
            user.TwoFactorEnabled = model.Enable2FA;

            if (model.NewImage != null)
            {
                var image = await _uploadFileService.AddFileAsync(model.NewImage);
                if (user.ImageURL != null)
                {
                    await _uploadFileService.DeleteFileAsync(user.ImageURL);
                }

                user.ImageURL = image.Url.ToString();
            }
            if (model.OldImage != null)
            {
                user.ImageURL = model.OldImage;
            }

            IdentityResult result = await _userManager.UpdateAsync(user);
            await _dbContext.SaveChangesAsync();

            if (result.Succeeded)
            {
                return StatusCode(StatusCodes.Status200OK,
                    new Response { Status = "Success", Message = "Profile updated successfully!" });
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Error", Message = "Failed to update profile." });
            }
        }

        [Authorize]
        [HttpPut]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status404NotFound,
                    new Response { Status = "Error", Message = $"User does not exist" });
            }
            if (string.Compare(model.NewPassword, model.ConfirmPassword) != 0)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new Response { Status = "Error", Message = $"The new password and the password confirm do not match." });
            }
            var resetPassResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!resetPassResult.Succeeded)
            {
                var errors = new List<string>();
                foreach (var error in resetPassResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new Response { Status = "Error", Message = string.Join(", ", errors) });
            }
            return Ok(new Response { Status = "Success", Message = "Password successfully changed" });
        }

        [Authorize]
        [HttpGet("RenewToken")]
        public async Task<IActionResult> RenewToken()
        {
            var userName = HttpContext.User.Identity.Name;
            var user = await _userManager.FindByNameAsync(userName);

            if (user != null)
            {
                //Claim list creation
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                //Add role to the list
                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                //generate the token with claim
                var jwtToken = GetToken(authClaims);
                var student = new StudentModel();
                //get student
                if (userRoles.Contains("Student"))
                {
                    student = await _studentService.GetStudentByUserId(user.Id);
                }
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                    expiration = jwtToken.ValidTo,
                    user.EmailConfirmed,
                    student.freeTest,
                });
            }
            return StatusCode(StatusCodes.Status404NotFound);
        }

        [Authorize]
        [HttpGet("CurrentRole")]
        public async Task<IActionResult> GetRoleCurrent()
        {
            var userName = HttpContext.User.Identity.Name;
            var user = await _userManager.FindByNameAsync(userName);
            var userRole = await _userManager.GetRolesAsync(user);
            if (user != null)
            {
                return Ok(new { role = userRole });
            }
            return StatusCode(StatusCodes.Status404NotFound);
        }
        [Authorize]
        [HttpGet("CurrentUserInfo")]
        public async Task<IActionResult> CurrentUserInfo()
        {
            var userName = HttpContext.User.Identity.Name;
            var user = await _userManager.FindByNameAsync(userName);
            var userRole = await _userManager.GetRolesAsync(user);
            if (user != null)
            {
                return Ok(new { 
                    user = user,
                    role = userRole });
            }
            return StatusCode(StatusCodes.Status404NotFound);
        }

        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signManager.SignOutAsync();
            return Ok();
        }

        private static int GenerateOTP()
        {
            // Create an instance of the Random class
            Random random = new Random();

            // Generate a random 6-digit OTP (from 100000 to 999999)
            int otp = random.Next(100000, 999999);

            // Convert the OTP to a string and return it
            return otp;
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigninKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT: ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
                );
            return token;
        }

        private static string GetUsernameFromEmail(string email)
        {
            string[] parts = email.Split('@');

            if (parts.Length == 2)
            {
                return parts[0];
            }
            else
            {
                throw new ArgumentException("Invalid email format");
            }
        }
    }
}