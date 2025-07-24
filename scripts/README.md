# Scripts

## Available Scripts

### deploy_edge_functions.sh
Deploys all Supabase Edge Functions with retry logic.

```bash
./scripts/deploy_edge_functions.sh
```

Features:
- Checks for Supabase CLI installation
- Deploys all 12 Edge Functions
- Automatic retry on failure (3 attempts)
- Detailed deployment summary

### test_edge_functions.sh
Tests deployed Edge Functions.

```bash
./scripts/test_edge_functions.sh
```

## Usage

All scripts must be run from the project root:

```bash
cd /path/to/financial-copilot
./scripts/deploy_edge_functions.sh
```

## Permissions

Scripts are already executable. If needed:

```bash
chmod +x scripts/*.sh
```
