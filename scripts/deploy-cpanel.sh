#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
project_root="$PWD"
deploy_root="$project_root/.deploy/cpanel"
deploy_key="${DREAMLAB_DEPLOY_KEY:-$HOME/.ssh/dreamlab_deploy}"
ssh_host="dreamlabmk@blastedlands.zemi.mk"
remote_repo="/home/dreamlabmk/repositories/dreamlab-production"
remote_site="/home/dreamlabmk/public_html"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Commit tracked changes before deploying." >&2
  exit 1
fi
if [[ ! -f "$deploy_key" ]]; then
  echo "Missing SSH key: $deploy_key (set DREAMLAB_DEPLOY_KEY to override)." >&2
  exit 1
fi
ssh_args=(-i "$deploy_key" -o BatchMode=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$project_root/deployment/cpanel-known-hosts" -o ConnectTimeout=15)
ssh "${ssh_args[@]}" "$ssh_host" 'printf "Hosting connection verified\n"'
npm run lint
npm run build
node scripts/check-seo.js
mkdir -p "$deploy_root"
python3 - "$project_root/dist" "$deploy_root/site" <<'PYBUILD'
import pathlib, shutil, sys
source, target = map(pathlib.Path, sys.argv[1:])
if target.exists():
    shutil.rmtree(target)
shutil.copytree(source, target)
for p in [target, *target.rglob('*')]:
    p.chmod(0o755 if p.is_dir() else 0o644)
PYBUILD
cat > "$deploy_root/.cpanel.yml" <<'YAML'
---
deployment:
  tasks:
    - /usr/bin/rsync -a --chmod=D755,F644 /home/dreamlabmk/repositories/dreamlab-production/site/ /home/dreamlabmk/public_html/
YAML
source_commit="$(git rev-parse HEAD)"
printf '%s\n' "$source_commit" > "$deploy_root/SOURCE_COMMIT"
if [[ ! -d "$deploy_root/.git" ]]; then
  git init --initial-branch=master "$deploy_root"
  git -C "$deploy_root" remote add hosting "ssh://$ssh_host$remote_repo"
fi
git -C "$deploy_root" add --all
if ! git -C "$deploy_root" diff --cached --quiet; then
  git -C "$deploy_root" commit -m "Deploy DreamLab source $source_commit"
fi
# Git receives a shell command; quote local paths before constructing it.
printf -v git_ssh '%q ' ssh "${ssh_args[@]}"
GIT_SSH_COMMAND="$git_ssh" git -C "$deploy_root" push hosting master
expected="$(shasum -a 256 "$deploy_root/site/index.html" | awk '{print $1}')"
for attempt in {1..15}; do
  actual="$(ssh "${ssh_args[@]}" "$ssh_host" "sha256sum '$remote_site/index.html'" | awk '{print $1}')"
  if [[ "$actual" == "$expected" ]]; then
    curl --fail --silent --show-error https://dreamlab.mk/ > /dev/null
    echo "Published source $source_commit to https://dreamlab.mk/"
    exit 0
  fi
  sleep 2
done
echo "Git push succeeded, but cPanel deployment was not verified. Check cPanel Git deployment logs." >&2
exit 1
