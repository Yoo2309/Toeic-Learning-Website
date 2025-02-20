using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using toeic_web.Infrastructure;
using toeic_web.Models;

namespace toeic_web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            {
                builder.Services
                    .AddRepository()
                    .AddService();
                builder.Services.Configure<CloudinaryModel>(builder.Configuration.GetSection("CloudinarySettings"));
            }

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "https://toeic.workon.space", "http://103.169.34.149:10074")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();

                });


            });
            builder.Services.AddControllers().AddControllersAsServices();
            builder.Services.AddHttpClient();
            builder.Services.AddMemoryCache();
            //add DBContext
            builder.Services.AddDbContext<ToeicDbContext>(options =>
            {
                options.UseMySql(
                    builder.Configuration.GetConnectionString("CustomConnection"),
                    new MySqlServerVersion(new Version(8, 0, 0))
                );
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });

            //add Identity
            builder.Services.AddIdentity<Users, IdentityRole>()                
                .AddEntityFrameworkStores<ToeicDbContext>()
                .AddDefaultTokenProviders();

            //Add Authentication
            builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                
            })
            //Add google
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["Google:ClientId"];
                options.ClientSecret = builder.Configuration["Google:ClientSecret"];
                options.SignInScheme = IdentityConstants.ExternalScheme;
            })
            //Add Jwt Bearer
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"])
                    )
                };
            });
            // Add Momo Payment Option
            builder.Services.Configure<MomoOptionModel>(builder.Configuration.GetSection("MomoAPI"));

            // Add auto mapper
            builder.Services.AddAutoMapper(typeof(Program));
            //builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            //Add email config
            var emailConfig = builder.Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();
            builder.Services.AddSingleton(emailConfig);

            builder.Services.Configure<IdentityOptions>(opts => opts.SignIn.RequireConfirmedEmail = false);

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            //Add Swagger
            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Auth API", Version = "v1" });
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    },
                });
            });

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();

            // Configure CORS
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.MapControllers();

            app.Run();
        }

    }
}