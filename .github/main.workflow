workflow "New workflow" {
  on = "push"
  resolves = ["Deploy on Dokku"]
}

action "Deploy on Dokku" {
  uses = "Dokku"
  secrets = ["SSH_KEY"]
  env = {
    APP_NAME = "highlight"
    HOST = "165.227.153.207"
    GIT_USER = "dokku"
  }
}
