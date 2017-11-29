# Contributing Guidelines

## Getting Started


- **Git configuration**

```
core.eol=lf
user.name=<Your Name>
user.email=<Your Email>
user.signingkey=<Your GPG key>
commit.gpgsign=True
tag.gpgsign=if-asked
log.mailmap=true
```

1. **Fork this repository**

2. **Clone your fork into any directory you want**

```
git clone --origin github/<yourname> git@github.com:<yourname>/atom-aframe.git
```

3. **Add this repository as remote**

```
git remote add github/mkungla git@github.com:mkungla/atom-aframe.git
```

4. **Link Atom package by running following in root of the repository path**

```
apm link
```
