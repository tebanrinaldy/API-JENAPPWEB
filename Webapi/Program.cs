using Webapi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Webapi.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var cadenaconexion = builder.Configuration.GetConnectionString("CadenaConexionDB");
builder.Services.AddDbContext<Connectioncontextdb>(options => options.UseSqlServer(cadenaconexion));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") 
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
