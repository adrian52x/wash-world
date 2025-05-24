# Monorepo setup

pnpm-workspace.yaml
packages:

- 'apps/\*'

mkdir -p apps/backend apps/frontend

- Backend init
  cd apps/backend
  pnpm init
  pnpm add @nestjs/core @nestjs/common @nestjs/platform-express rxjs reflect-metadata
  pnpm add -D typescript ts-node @nestjs/cli
  pnpm dlx @nestjs/cli init

OR
pnpm dlx @nestjs/cli new backend

- Frontend init
  cd ../frontend
  pnpm create expo-app .
  pnpm add expo-router

cd ../..
pnpm install

Add stuff
pnpm add <package-name> --filter backend
pnpm add <package-name> --filter frontend



Observations:
1. add error handling (feedback on inputs) for login/register