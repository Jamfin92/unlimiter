FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Unlimiter.Api/Unlimiter.Api.csproj Unlimiter.Api/
RUN dotnet restore Unlimiter.Api/Unlimiter.Api.csproj
COPY . .
WORKDIR /src/Unlimiter.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Unlimiter.Api.dll"]
