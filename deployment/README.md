# DreamLab deployment without GitHub Actions

Run `npm run deploy` from the project after committing changes.

The command verifies the SSH connection, runs lint/build/SEO checks, creates a separate Git repository of the production build in `.deploy/cpanel`, and pushes it to the cPanel-managed `DreamLab Production` repository. Its `.cpanel.yml` hook copies only the built site to `/home/dreamlabmk/public_html`. Existing hashed assets are retained for visitors with cached HTML. Source code and `.git` stay outside the public document root.

GitHub remains the source-code remote (`origin`). `git push origin main` stores source changes but does not publish the website. The old GitHub Actions workflow is archived here and disabled. Publishing uses the existing SSH key at `~/.ssh/dreamlab_deploy`; set `DREAMLAB_DEPLOY_KEY` to use a different local path. No private key is committed. The hosting SSH host key is pinned in `cpanel-known-hosts`.

A fresh checkout requires `npm ci`, the existing authorized SSH key, Git, Python 3, curl and Node.js. The hosting needs Git Version Control and rsync, but no Node.js build runtime.

If verification fails after a push, inspect cPanel → Git Version Control → DreamLab Production → Manage → Pull or Deploy. A failed deployment is reported as an error, not as a successful publication.
