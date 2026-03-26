using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Tailwind.Traders.Web;
using Tailwind.Traders.Web.Standalone;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddMvc();
builder.Services.AddOptions();
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.Configure<Settings>(builder.Configuration);

// In production, the React files will be served from this directory
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});

using var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder.AddConsole());
var startupLogger = loggerFactory.CreateLogger<Program>();
builder.Services.AddStandalone(builder.Configuration, startupLogger);

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseSpaStaticFiles(new StaticFileOptions()
{
    ServeUnknownFileTypes = true
});

app.UseStandalone(builder.Configuration, app.Logger);
app.UseRouting();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseReactDevelopmentServer(npmScript: "start");
    }
});

app.Run();
