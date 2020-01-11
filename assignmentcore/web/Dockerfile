# FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
# WORKDIR /app
# EXPOSE 80
# EXPOSE 443

# FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
# WORKDIR /src
# COPY ["web/web.csproj", "web/"]
# RUN dotnet restore "web/web.csproj"
# COPY . .
# WORKDIR "/src/web"
# RUN dotnet build "web.csproj" -c Release -o /app

# FROM build AS publish
# RUN dotnet publish "web.csproj" -c Release -o /app

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app .
# ENTRYPOINT ["dotnet", "web.dll"]


FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore web.csproj

COPY . ./
RUN dotnet publish web.csproj -c Release -o out

FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime

WORKDIR /app

COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "web.dll"]`