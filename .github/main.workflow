workflow "Dokku Deployment" {
  on = "push"
  resolves = ["HTTP client"]
}

action "Deploy on Dokku" {
  uses = "./github/dokku"
  secrets = ["SSH_KEY"]
  env = {
    APP_NAME = "highlight"
    HOST = "165.227.153.207"
    GIT_USER = "dokku"
  }
}

action "HTTP client" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  needs = ["Deploy on Dokku"]
  args = "POST, https://notifications.rawnly.com/deployment, status=success&app=highlight"
}
