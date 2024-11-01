# Web Base CLI

This is the CLI tool that allows the web base to install/publish modules to the web base.

# Development

The CLI is a simple node typescript project. Changesets are managed by changets:

When making a commit with a change that should be noted in a release version, run changeset and follow the prompts:

```
changeset
```

When preparing for publishing, run:

```
changeset version
```

Then merge into main and allow the CI to build for release.

In the future, changeset version and check-in should probably also be handled in the CI (KIV).
